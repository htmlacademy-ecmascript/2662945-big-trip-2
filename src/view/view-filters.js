import AbstractView from '../framework/view/abstract-view.js';

export default class ViewFilters extends AbstractView {
  #currentFilterType = null;
  #disabledFilters = null;
  #onFilterTypeChange = null;
  #isListenersAdded = false;

  constructor({ currentFilterType, disabledFilters, onFilterTypeChange }) {
    super();
    this.#currentFilterType = currentFilterType;
    this.#disabledFilters = disabledFilters;
    this.#onFilterTypeChange = onFilterTypeChange;
  }

  get template() {
    return `
      <form class="trip-filters" action="#" method="get">
        <div class="trip-filters__filter">
          <input
            id="filter-everything"
            class="trip-filters__filter-input visually-hidden"
            type="radio"
            name="trip-filter"
            value="everything"
            ${this.#currentFilterType === 'everything' ? 'checked' : ''}
            ${this.#disabledFilters?.everything ? 'disabled' : ''}
          >
          <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
        </div>

        <div class="trip-filters__filter">
          <input
            id="filter-future"
            class="trip-filters__filter-input visually-hidden"
            type="radio"
            name="trip-filter"
            value="future"
            ${this.#currentFilterType === 'future' ? 'checked' : ''}
            ${this.#disabledFilters?.future ? 'disabled' : ''}
          >
          <label class="trip-filters__filter-label" for="filter-future">Future</label>
        </div>

        <div class="trip-filters__filter">
          <input
            id="filter-present"
            class="trip-filters__filter-input visually-hidden"
            type="radio"
            name="trip-filter"
            value="present"
            ${this.#currentFilterType === 'present' ? 'checked' : ''}
            ${this.#disabledFilters?.present ? 'disabled' : ''}
          >
          <label class="trip-filters__filter-label" for="filter-present">Present</label>
        </div>

        <div class="trip-filters__filter">
          <input
            id="filter-past"
            class="trip-filters__filter-input visually-hidden"
            type="radio"
            name="trip-filter"
            value="past"
            ${this.#currentFilterType === 'past' ? 'checked' : ''}
            ${this.#disabledFilters?.past ? 'disabled' : ''}
          >
          <label class="trip-filters__filter-label" for="filter-past">Past</label>
        </div>
      </form>
    `;
  }

  get element() {
    const element = super.element;

    if (!this.#isListenersAdded) {
      element.addEventListener('change', this.#filtersChangeHandler);
      this.#isListenersAdded = true;
    }

    return element;
  }

  #filtersChangeHandler = (evt) => {
    const input = evt.target.closest('.trip-filters__filter-input');

    if (!input || input.disabled) {
      return;
    }

    this.#onFilterTypeChange?.(input.value);
  };
}

