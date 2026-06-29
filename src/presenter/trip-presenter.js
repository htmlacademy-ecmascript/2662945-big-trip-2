import { render, remove, RenderPosition } from '../framework/render.js';
import ViewSort from '../view/view-sort.js';
import { SortType, FilterType } from '../utils/const.js';
import { sortPointByDay, sortPointByTime, sortPointByPrice } from '../utils/sort.js';
import ViewPointList from '../view/view-point-list.js';
import ViewEmptyPointListFilter from '../view/view-empty-point-list-filter.js';
import ViewLoading from '../view/view-loading.js';
import PointPresenter from './point-presenter.js';
import ViewEditPoint from '../view/view-edit-point.js';
import ViewTripInfo from '../view/view-trip-info.js';
import { humanizeHeaderDate } from '../utils/point.js';

export default class TripPresenter {
  #eventsContainer = null;
  #tripModel = null;
  #filterModel = null;
  #pointPresenters = new Map();
  #sortComponent = null;
  #pointListComponent = null;
  #emptyPointListComponent = null;
  #loadingComponent = null;
  #newPointEditComponent = null;
  #tripInfoComponent = null;
  #currentSortType = SortType.DAY;
  #isLoading = true;
  #headerContainer;
  #onNewPointDestroy = null;
  #onFilterReset = null;

  constructor({ eventsContainer, tripModel, filterModel, tripMainContainer, onNewPointDestroy, onFilterReset }) {
    this.#eventsContainer = eventsContainer;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#headerContainer = tripMainContainer;
    this.#onNewPointDestroy = onNewPointDestroy;
    this.#onFilterReset = onFilterReset;
  }

  init() {
    this.#renderTrip();
  }

  setLoadingFinished() {
    this.#isLoading = false;
  }

  rerender() {
    this.#clearTripBoard();
    this.#renderTrip();
  }

  createPoint() {
    if (this.#isLoading || this.#newPointEditComponent) {
      return;
    }

    this.#clearOpenedForms();
    this.#filterModel.setFilter(FilterType.EVERYTHING);
    this.#onFilterReset?.();
    this.#currentSortType = SortType.DAY;
    this.rerender();
    this.#renderNewPointForm();
  }

  #getFilteredPoints() {
    const points = [...this.#tripModel.points];
    const now = new Date();

    switch (this.#filterModel.filter) {
      case FilterType.FUTURE:
        return points.filter((point) => new Date(point.dateFrom) > now);
      case FilterType.PRESENT:
        return points.filter((point) => new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now);
      case FilterType.PAST:
        return points.filter((point) => new Date(point.dateTo) < now);
      case FilterType.EVERYTHING:
      default:
        return points;
    }
  }

  #getSortedPoints() {
    const points = this.#getFilteredPoints();

    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...points].sort(sortPointByTime);
      case SortType.PRICE:
        return [...points].sort(sortPointByPrice);
      case SortType.DAY:
      default:
        return [...points].sort(sortPointByDay);
    }
  }

  #getRouteCities(points) {
    const cities = points
      .map((point) => this.#tripModel.destinations.find((dest) => dest.id === point.destination)?.name)
      .filter(Boolean);

    if (cities.length <= 3) {
      return cities.join(' — ');
    }

    return `${cities[0]} —...— ${cities[cities.length - 1]}`;
  }

  #getTripDates(points) {
    if (points.length === 0) {
      return '';
    }

    const sortedPoints = [...points].sort(sortPointByDay);
    const firstPoint = sortedPoints[0];
    const lastPoint = sortedPoints[sortedPoints.length - 1];

    return `${humanizeHeaderDate(firstPoint.dateFrom)} — ${humanizeHeaderDate(lastPoint.dateTo)}`;
  }

  #getTripPrice(points) {
    return points.reduce((sum, point) => {
      const offersByType = this.#tripModel.offers.find((offerGroup) => offerGroup.type === point.type);
      const availableOffers = offersByType ? offersByType.offers : [];
      const selectedOffers = availableOffers.filter((offer) => point.offers.includes(offer.id));
      const offersPrice = selectedOffers.reduce((offerSum, offer) => offerSum + offer.price, 0);

      return sum + point.basePrice + offersPrice;
    }, 0);
  }

  #renderTripInfo() {
    const points = this.#getSortedPoints();

    if (points.length === 0) {
      return;
    }

    this.#tripInfoComponent = new ViewTripInfo({
      route: this.#getRouteCities(points),
      date: this.#getTripDates(points),
      price: this.#getTripPrice(points),
    });

    render(this.#tripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  }

  #renderTrip() {
    if (this.#isLoading) {
      this.#loadingComponent = new ViewLoading();
      render(this.#loadingComponent, this.#eventsContainer);
      return;
    }

    const points = this.#getSortedPoints();

    this.#renderTripInfo();

    if (points.length === 0 && !this.#newPointEditComponent) {
      this.#emptyPointListComponent = new ViewEmptyPointListFilter({
        filterType: this.#filterModel.filter,
      });
      render(this.#emptyPointListComponent, this.#eventsContainer);
      return;
    }

    this.#renderSort();
    this.#renderPointList();

    if (this.#newPointEditComponent) {
      render(this.#newPointEditComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
    }

    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#pointListComponent.element,
      point,
      destinations: this.#tripModel.destinations,
      offers: this.#tripModel.offers,
      onDataChange: async (updatedPoint, action) => {
        if (action === 'delete') {
          await this.#tripModel.deletePointOnServer(updatedPoint);
          this.#pointPresenters.get(updatedPoint.id)?.destroy();
          this.#pointPresenters.delete(updatedPoint.id);
          this.rerender();
          return;
        }

        const result = await this.#tripModel.updatePointOnServer(updatedPoint);
        this.rerender();
        return result;
      },
      onModeChange: () => this.#clearOpenedForms(),
    });

    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNewPointForm() {
    this.#newPointEditComponent = new ViewEditPoint({
      point: {
        id: 'new-point',
        type: 'flight',
        destination: '',
        basePrice: 0,
        dateFrom: '',
        dateTo: '',
        offers: [],
        isFavorite: false,
      },
      destinations: this.#tripModel.destinations,
      offers: this.#tripModel.offers,
      isCreating: true,
    });

    this.#newPointEditComponent.setFormSubmitHandler(this.#formSubmitHandler);
    this.#newPointEditComponent.setRollupClickHandler(this.#closeNewPointForm);
    this.#newPointEditComponent.setDeleteClickHandler(this.#closeNewPointForm);

    render(
      this.#newPointEditComponent,
      this.#pointListComponent.element,
      RenderPosition.AFTERBEGIN
    );

    document.addEventListener('keydown', this.#escapeKeydownHandler);
  }

  #renderSort() {
    this.#sortComponent = new ViewSort({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortFormChangeHandler,
    });

    render(this.#sortComponent, this.#eventsContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPointList() {
    this.#pointListComponent = new ViewPointList();
    render(this.#pointListComponent, this.#eventsContainer);
  }

  #clearTripBoard() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#tripInfoComponent);
    remove(this.#sortComponent);
    remove(this.#pointListComponent);
    remove(this.#emptyPointListComponent);
    remove(this.#loadingComponent);
    if (this.#newPointEditComponent) {
      this.#onNewPointDestroy?.();
    }
    remove(this.#newPointEditComponent);
    this.#tripInfoComponent = null;
    this.#sortComponent = null;
    this.#pointListComponent = null;
    this.#emptyPointListComponent = null;
    this.#loadingComponent = null;
    this.#newPointEditComponent = null;
  }

  #clearOpenedForms() {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());

    if (this.#newPointEditComponent) {
      this.#closeNewPointForm();
    }
  }

  #closeNewPointForm = () => {
    remove(this.#newPointEditComponent);
    this.#newPointEditComponent = null;
    document.removeEventListener('keydown', this.#escapeKeydownHandler);

    this.#onNewPointDestroy?.();
  };

  #formSubmitHandler = async (newPoint) => {
    try {
      this.#newPointEditComponent?.setSaving();
      await this.#tripModel.addPointOnServer(newPoint);
      this.#closeNewPointForm();
      this.rerender();
    } catch (error) {
      this.#newPointEditComponent?.setAborting();
    }
  };

  #escapeKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeNewPointForm();
    }
  };

  #sortFormChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.rerender();
  };
}
