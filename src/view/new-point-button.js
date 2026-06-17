import AbstractView from '../framework/view/abstract-view.js';

export default class ViewNewPointButton extends AbstractView {
  #onClick = null;

  constructor({ onClick }) {
    super();
    this.#onClick = onClick;
  }

  get template() {
    return `
      <button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">
        New event
      </button>
    `;
  }

  get element() {
    const element = super.element;
    element.addEventListener('click', this.#onClick);
    return element;
  }
}
