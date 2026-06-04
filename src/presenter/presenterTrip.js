import { render, RenderPosition } from '../framework/render.js';

import ViewFilters from '../view/filters.js';
import ViewSort from '../view/sort.js';
import ViewPointList from '../view/point-list.js';
import ViewEmptyPointList from '../view/empty-point-list.js';

import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #filtersContainer = null;
  #eventsContainer = null;
  #tripModel = null;

  #pointPresenters = new Map();

  constructor({ filtersContainer, eventsContainer, tripModel }) {
    this.#filtersContainer = filtersContainer;
    this.#eventsContainer = eventsContainer;
    this.#tripModel = tripModel;
  }

  init() {
    const points = this.#tripModel.points;
    const destinations = this.#tripModel.destinations;
    const offers = this.#tripModel.offers;

    render(new ViewFilters(), this.#filtersContainer);

    if (points.length === 0) {
      render(new ViewEmptyPointList(), this.#eventsContainer);
      return;
    }

    render(
      new ViewSort(),
      this.#eventsContainer,
      RenderPosition.AFTERBEGIN
    );

    const pointListComponent = new ViewPointList();

    render(
      pointListComponent,
      this.#eventsContainer
    );

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        container: pointListComponent.element,
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
