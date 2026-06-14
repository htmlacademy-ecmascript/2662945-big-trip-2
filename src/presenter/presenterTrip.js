import { render, remove, RenderPosition } from '../framework/render.js';

import ViewFilters from '../view/filters.js';
import ViewSort from '../view/sort.js';
import { SortType } from '../mocks/const.js';
import ViewPointList from '../view/point-list.js';
import ViewEmptyPointList from '../view/empty-point-list.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #filtersContainer = null;
  #eventsContainer = null;
  #tripModel = null;

  #pointPresenters = new Map();
  #sortComponent = null;
  #pointListComponent = null;
  #currentSortType = SortType.DAY;

  constructor({ filtersContainer, eventsContainer, tripModel }) {
    this.#filtersContainer = filtersContainer;
    this.#eventsContainer = eventsContainer;
    this.#tripModel = tripModel;
  }

  init() {
    render(new ViewFilters(), this.#filtersContainer);
    this.#renderTrip();
  }

  #renderTrip() {
    const points = this.#getSortedPoints();
    const destinations = this.#tripModel.destinations;
    const offers = this.#tripModel.offers;

    if (points.length === 0) {
      render(new ViewEmptyPointList(), this.#eventsContainer);
      return;
    }

    this.#renderSort();
    this.#renderPointList();

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

  #getSortedPoints() {
    const points = [...this.#tripModel.points];

    switch (this.#currentSortType) {
      case SortType.TIME:
        return points.sort((a, b) => new Date(a.dateTo) - new Date(b.dateTo));
      case SortType.PRICE:
        return points.sort((a, b) => b.basePrice - a.basePrice);
      case SortType.DAY:
      default:
        return points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    }
  }

  #clearTripBoard() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

    if (this.#pointListComponent) {
      remove(this.#pointListComponent);
      this.#pointListComponent = null;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTripBoard();
    this.#renderTrip();
  };

  #handlePointChange = (updatedPoint) => {
    const pointIndex = this.#tripModel.pointsData.findIndex(
      (point) => point.id === updatedPoint.id
    );

    if (pointIndex === -1) {
      return;
    }

    this.#tripModel.pointsData[pointIndex] = updatedPoint;

    const presenter = this.#pointPresenters.get(updatedPoint.id);
    if (presenter) {
      presenter.update(updatedPoint);
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
