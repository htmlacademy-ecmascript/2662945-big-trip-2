import { render, replace } from '../framework/render.js';
import ViewPoint from '../view/point.js';
import ViewEditPoint from '../view/edit-point.js';

export default class PointPresenter {
  #pointComponent = null;
  #editPointComponent = null;

  constructor({ container, point, destinations, offers }) {
    this.container = container;
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
  }

  init() {
    this.#pointComponent = new ViewPoint({
      point: this.point,
      destinations: this.destinations,
      offers: this.offers,
    });

    this.#editPointComponent = new ViewEditPoint({
      point: this.point,
      destinations: this.destinations,
      offers: this.offers,
    });

    render(this.#pointComponent, this.container);

    this.#pointComponent.setEditClickHandler(() => {
      replace(this.#editPointComponent, this.#pointComponent);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });

    this.#editPointComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      this.#replaceFormToPoint();
    });

    this.#editPointComponent.setRollupClickHandler(() => {
      this.#replaceFormToPoint();
    });

    this.#editPointComponent.setDeleteClickHandler(() => {
      this.#handleDeleteClick();
    });
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleDeleteClick() {
    this.#replaceFormToPoint();
  }
}
