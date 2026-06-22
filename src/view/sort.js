import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../mocks/const.js';

export default class ViewSort extends AbstractView {
  #currentSortType = SortType.DAY;
  #onSortTypeChange = null;
  #isListenersAdded = false;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#onSortTypeChange = onSortTypeChange;
  }

  get template() {
    return `
      <form class="trip-events__trip-sort trip-sort" action="#" method="get">
        <div class="trip-sort__item trip-sort__item--day">
          <input
            id="sort-day"
            class="trip-sort__input visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-day"
            data-sort-type="${SortType.DAY}"
            ${this.#currentSortType === SortType.DAY ? 'checked' : ''}
          >
          <label class="trip-sort__btn" for="sort-day">Day</label>
        </div>

        <div class="trip-sort__item trip-sort__item--event">
          <input
            id="sort-event"
            class="trip-sort__input visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-event"
            disabled
          >
          <label class="trip-sort__btn" for="sort-event">Event</label>
        </div>

        <div class="trip-sort__item trip-sort__item--time">
          <input
            id="sort-time"
            class="trip-sort__input visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-time"
            data-sort-type="${SortType.TIME}"
            ${this.#currentSortType === SortType.TIME ? 'checked' : ''}
          >
          <label class="trip-sort__btn" for="sort-time">Time</label>
        </div>

        <div class="trip-sort__item trip-sort__item--price">
          <input
            id="sort-price"
            class="trip-sort__input visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-price"
            data-sort-type="${SortType.PRICE}"
            ${this.#currentSortType === SortType.PRICE ? 'checked' : ''}
          >
          <label class="trip-sort__btn" for="sort-price">Price</label>
        </div>

        <div class="trip-sort__item trip-sort__item--offer">
          <input
            id="sort-offer"
            class="trip-sort__input visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-offer"
            disabled
          >
          <label class="trip-sort__btn" for="sort-offer">Offers</label>
        </div>
      </form>
    `;
  }

  get element() {
    const element = super.element;

    if (!this.#isListenersAdded) {
      element.addEventListener('change', this.#sortTypeChangeHandler);
      this.#isListenersAdded = true;
    }

    return element;
  }

  #sortTypeChangeHandler = (evt) => {
    const input = evt.target.closest('.trip-sort__input');

    if (!input || input.disabled) {
      return;
    }

    const sortType = input.dataset.sortType;

    if (!sortType) {
      return;
    }

    this.#onSortTypeChange?.(sortType);
  };
}
