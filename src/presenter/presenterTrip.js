import { render, remove, RenderPosition } from '../framework/render.js';
import ViewSort from '../view/sort.js';
import { SortType, FilterType } from '../mocks/const.js';
import { sortPointByDay, sortPointByTime, sortPointByPrice } from '../utils/sort.js';
import ViewPointList from '../view/point-list.js';
import ViewEmptyPointListFilter from '../view/empty-point-list-filter.js';
import ViewLoading from '../view/loading.js';
import PointPresenter from './point-presenter.js';
import ViewEditPoint from '../view/edit-point.js';

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
  #currentSortType = SortType.DAY;
  #isLoading = true;

  constructor({ eventsContainer, tripModel, filterModel }) {
    this.#eventsContainer = eventsContainer;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
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

  #renderTrip() {
    if (this.#isLoading) {
      this.#loadingComponent = new ViewLoading();
      render(this.#loadingComponent, this.#eventsContainer);
      return;
    }

    const points = this.#getSortedPoints();

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
      onDataChange: async (updatedPoint) => this.#tripModel.updatePointOnServer(updatedPoint),
      onModeChange: () => this.#clearOpenedForms(),
    });

    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderNewPointForm() {
    const firstDestination = this.#tripModel.destinations[0];
    const firstOfferType = this.#tripModel.offers[0]?.type ?? 'flight';

    this.#newPointEditComponent = new ViewEditPoint({
      point: {
        id: 'new-point',
        type: firstOfferType,
        destination: firstDestination?.id ?? '',
        basePrice: 0,
        dateFrom: new Date(),
        dateTo: new Date(),
        offers: [],
        isFavorite: false,
      },
      destinations: this.#tripModel.destinations,
      offers: this.#tripModel.offers,
      isCreating: true,
    });

    this.#newPointEditComponent.setFormSubmitHandler(this.#handleNewPointSubmit);
    this.#newPointEditComponent.setRollupClickHandler(this.#closeNewPointForm);
    this.#newPointEditComponent.setDeleteClickHandler(this.#closeNewPointForm);

    render(
      this.#newPointEditComponent,
      this.#pointListComponent.element,
      RenderPosition.AFTERBEGIN
    );

    document.addEventListener('keydown', this.#handleEscKeyDown);
  }

  #renderSort() {
    this.#sortComponent = new ViewSort({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
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

    remove(this.#sortComponent);
    remove(this.#pointListComponent);
    remove(this.#emptyPointListComponent);
    remove(this.#loadingComponent);
    remove(this.#newPointEditComponent);

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
    document.removeEventListener('keydown', this.#handleEscKeyDown);
  };

  #handleNewPointSubmit = async (newPoint) => {
    try {
      await this.#tripModel.updatePointOnServer(newPoint);
      this.#closeNewPointForm();
      this.rerender();
    } catch (error) {
      this.#newPointEditComponent?.setAborting();
    }
  };

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeNewPointForm();
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.rerender();
  };
}

