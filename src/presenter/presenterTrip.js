import { render, RenderPosition } from '../render.js';

import ViewFilters from '../view/filters.js';
import ViewSort from '../view/sort.js';
import ViewEditPoint from '../view/edit-point.js';
import ViewPoint from '../view/point.js';

export default class TripPresenter {
  constructor({ filtersContainer, eventsContainer, tripModel }) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
    this.tripModel = tripModel;
  }

  init() {
    const points = this.tripModel.points;
    const destinations = this.tripModel.destinations;
    const offers = this.tripModel.offers;

    render(new ViewFilters(), this.filtersContainer);

    render(new ViewSort(), this.eventsContainer, RenderPosition.AFTERBEGIN);

    const editPointView = new ViewEditPoint({
      point: points[0],
      destinations,
      offers,
      isCreating: false,
    });

    render(editPointView, this.eventsContainer, RenderPosition.BEFOREEND);

    points.forEach((point) => {
      render(
        new ViewPoint(point, destinations, offers),
        this.eventsContainer,
        RenderPosition.BEFOREEND,
      );
    });
  }
}
