import { render, RenderPosition } from '../render.js';
import ViewFilters from '../view/filters.js';
import ViewSort from '../view/sort.js';
import ViewEditPoint from '../view/edit-point.js';
import ViewPoint from '../view/point.js';

export default class TripPresenter {
  constructor({ filtersContainer, eventsContainer }) {
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
  }

  init() {
    const pointEditor = new ViewEditPoint();
    render(
      new ViewFilters(),
      this.filtersContainer,
    );
    render(
      new ViewSort(),
      this.eventsContainer,
      RenderPosition.AFTERBEGIN,
    );
    render(
      pointEditor,
      this.eventsContainer,
      RenderPosition.BEFOREEND,
    );

    for (let i = 0; i < 3; i++) {
      render(
        new ViewPoint(i),
        pointEditor.getElement(),
        RenderPosition.BEFOREENDEND,
      );
    }

  }
}
