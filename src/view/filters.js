import AbstractView from '../framework/view/abstract-view.js';

export default class ViewFilters extends AbstractView {
  #currentFilterType = null;
  #onFilterTypeChange = null;

  constructor({ currentFilterType, onFilterTypeChange }) {
    super();
    this.#currentFilterType = currentFilterType;
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
          >
          <label class="trip-filters__filter-label" for="filter-past">Past</label>
        </div>
      </form>
    `;
  }

  get element() {
    const element = super.element;
    element.addEventListener('change', this.#handleChange);
    return element;
  }

  #handleChange = (evt) => {
    const input = evt.target.closest('.trip-filters__filter-input');

    if (!input) {
      return;
    }

    this.#onFilterTypeChange?.(input.value);
  };
}
