
import { render, remove, RenderPosition } from '../framework/render.js';
import ViewSort from '../view/sort.js';
import { SortType, FilterType } from '../mocks/const.js';
import {
  sortPointByDay,
  sortPointByTime,
  sortPointByPrice
} from '../utils/sort.js';
import ViewPointList from '../view/point-list.js';
import ViewEmptyPointListFilter from '../view/empty-point-list-filter.js';
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
  #newPointEditComponent = null;
  #currentSortType = SortType.DAY;
  #isCreatingNewPoint = false;

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' && this.#newPointEditComponent) {
      remove(this.#newPointEditComponent);
      this.#newPointEditComponent = null;

      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  constructor({ eventsContainer, tripModel, filterModel }) {
    this.#eventsContainer = eventsContainer;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
  }

  init() {
    this.rerender();
  }

  createPoint() {
    if (this.#newPointEditComponent) {
      return;
    }

    this.#handleModeChange();

    const destination = this.#tripModel.destinations[0];

    this.#newPointEditComponent = new ViewEditPoint({
      point: {
        id: 'new-point',
        type: 'flight',
        destination: destination.id,
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
    document.addEventListener('keydown', this.#escKeyDownHandler);

    this.#newPointEditComponent.setRollupClickHandler(() => {
      remove(this.#newPointEditComponent);
      this.#newPointEditComponent = null;

      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#newPointEditComponent.setDeleteClickHandler(() => {
      remove(this.#newPointEditComponent);
      this.#newPointEditComponent = null;

      document.removeEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#newPointEditComponent.setFormSubmitHandler((point) => {
      this.#tripModel.addPoint(point);

      document.removeEventListener('keydown', this.#escKeyDownHandler);

      this.#newPointEditComponent = null;

      this.rerender();
    });

    render(
      this.#newPointEditComponent,
      this.#pointListComponent.element,
      RenderPosition.AFTERBEGIN
    );
  }

  rerender() {
    this.#clearTripBoard();
    this.#renderTrip();
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
        return points.sort(sortPointByTime);
      case SortType.PRICE:
        return points.sort(sortPointByPrice);
      case SortType.DAY:
      default:
        return points.sort(sortPointByDay);
    }
  }

  #renderTrip() {
    const points = this.#getSortedPoints();

    if (points.length === 0 && !this.#isCreatingNewPoint) {
      this.#emptyPointListComponent = new ViewEmptyPointListFilter({
        filterType: this.#filterModel.filter,
      });

      render(this.#emptyPointListComponent, this.#eventsContainer);
      return;
    }

    this.#renderSort();
    this.#renderPointList();

    const destinations = this.#tripModel.destinations;
    const offers = this.#tripModel.offers;

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        container: this.#pointListComponent.element,
        point,
        destinations,
        offers,
        onDataChange: this.#handlePointChange,
        onModeChange: this.#handleModeChange,
      });

      pointPresenter.init();
      this.#pointPresenters.set(point.id, pointPresenter);
    });
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
    this.#sortComponent = null;

    remove(this.#pointListComponent);
    this.#pointListComponent = null;

    remove(this.#emptyPointListComponent);
    this.#emptyPointListComponent = null;

    remove(this.#newPointEditComponent);
    this.#newPointEditComponent = null;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.rerender();
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripModel.updatePoint(updatedPoint);

    const presenter = this.#pointPresenters.get(updatedPoint.id);
    if (presenter) {
      presenter.update(updatedPoint);
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
