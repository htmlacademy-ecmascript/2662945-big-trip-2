import { render, remove } from '../framework/render.js';
import ViewFilters from '../view/view-filters.js';
import { filter } from '../utils/filter.js';
import { FilterType } from '../utils/const.js';

export default class FilterPresenter {
  #filtersContainer = null;
  #filterModel = null;
  #tripModel = null;
  #onFilterChange = null;
  #filtersComponent = null;

  constructor({ filtersContainer, filterModel, tripModel, onFilterChange }) {
    this.#filtersContainer = filtersContainer;
    this.#filterModel = filterModel;
    this.#tripModel = tripModel;
    this.#onFilterChange = onFilterChange;
  }

  init() {
    const points = this.#tripModel.points;

    const disabledFilters = {
      [FilterType.EVERYTHING]: points.length === 0,
      [FilterType.FUTURE]: filter[FilterType.FUTURE](points).length === 0,
      [FilterType.PRESENT]: filter[FilterType.PRESENT](points).length === 0,
      [FilterType.PAST]: filter[FilterType.PAST](points).length === 0,
    };

    this.#filtersComponent = new ViewFilters({
      currentFilterType: this.#filterModel.filter,
      disabledFilters,
      onFilterTypeChange: this.#filtersFormChangeHandler,
    });

    render(this.#filtersComponent, this.#filtersContainer);
  }

  rerender() {
    remove(this.#filtersComponent);
    this.init();
  }

  destroy() {
    remove(this.#filtersComponent);
    this.#filtersComponent = null;
  }

  #filtersFormChangeHandler = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(filterType);
    this.#onFilterChange?.();
  };
}

