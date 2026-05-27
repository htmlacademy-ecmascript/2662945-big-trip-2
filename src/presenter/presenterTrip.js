import { render, RenderPosition } from '../framework/render.js';
import ViewFilters from '../view/filters.js';
import ViewSort from '../view/sort.js';
import ViewPointList from '../view/point-list.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #filtersContainer = null;
  #eventsContainer = null;
  #tripModel = null;

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

    render(
      new ViewSort(),
      this.#eventsContainer,
      RenderPosition.AFTERBEGIN
    );

    const pointListComponent = new ViewPointList();

    render(pointListComponent, this.#eventsContainer);

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        container: pointListComponent.element,
        point,
        destinations,
        offers,
      });

      pointPresenter.init();
    });
  }
}
