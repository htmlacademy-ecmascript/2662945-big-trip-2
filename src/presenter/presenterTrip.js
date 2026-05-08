import { render, RenderPosition } from '../framework/render.js';
import ViewFilters from '../view/filters.js';
import ViewSort from '../view/sort.js';
import ViewCreatePoint from '../view/create-point.js';
import ViewEditPoint from '../view/edit-point.js';
import ViewPoint from '../view/point.js';

export default class TripPresenter {
  constructor({ filtersContainer, sortContainer, eventsContainer }) {
    this.filtersContainer = filtersContainer;
    this.sortContainer = sortContainer;
    this.eventsContainer = eventsContainer;
  }

  init() {
    render(new ViewFilters(), this.filtersContainer);
    render(new ViewSort(), this.sortContainer);
    render(new ViewCreatePoint(), this.sortContainer, RenderPosition.AFTEREND);
    render(
      new ViewEditPoint(),
      this.eventsContainer,
      RenderPosition.AFTERBEGIN,
    );

    for (let i = 0; i < 3; i++) {
      render(new ViewPoint(i), this.eventsContainer);
    }
  }
}
