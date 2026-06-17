import { render } from '../framework/render.js';
import ViewFilters from '../view/filters.js';

export default class FilterPresenter {
  #filtersContainer = null;
  #filterModel = null;
  #onFilterChange = null;
  #filtersComponent = null;

  constructor({ filtersContainer, filterModel, onFilterChange }) {
    this.#filtersContainer = filtersContainer;
    this.#filterModel = filterModel;
    this.#onFilterChange = onFilterChange;
  }

  init() {
    this.#filtersComponent = new ViewFilters({
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    render(this.#filtersComponent, this.#filtersContainer);
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(filterType);
    this.#onFilterChange?.();
  };
}
