import AbstractView from '../framework/view/abstract-view.js';

export default class ViewNewPointButton extends AbstractView {
  #onClick = null;

  constructor({ onClick }) {
    super();
    this.#onClick = onClick;

    this.element.addEventListener('click', this.#newPointButtonClickHandler);
  }

  get template() {
    return `
      <button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">
        New event
      </button>
    `;
  }

  setDisabled(isDisabled) {
    this.element.disabled = isDisabled;
  }

  #newPointButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onClick?.();
  };
}
