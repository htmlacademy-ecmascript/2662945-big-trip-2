import { FilterType } from '../utils/const.js';

export default class FilterModel {
  #filter = FilterType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(filterType) {
    this.#filter = filterType;
  }
}

