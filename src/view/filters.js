import { createElement } from "../framework/render.js";

export default class ViewFilters {
  getTemplate() {
    return `
     <section class="trip-controls__filters filters">
        <h2 class="visually-hidden">Filter events</h2>
        <form class="filters__form" action="#" method="get">
          <div class="filters__filter">
            <input id="filter-everything" class="filters__filter-input visually-hidden" type="radio" name="trip-filter" value="everything" checked>
            <label class="filters__filter-label" for="filter-everything">Everything</label>
          </div>
          <div class="filters__filter">
            <input id="filter-future" class="filters__filter-input visually-hidden" type="radio" name="trip-filter" value="future">
            <label class="filters__filter-label" for="filter-future">Future</label>
          </div>
          <div class="filters__filter">
            <input id="filter-present" class="filters__filter-input visually-hidden" type="radio" name="trip-filter" value="present">
            <label class="filters__filter-label" for="filter-present">Present</label>
          </div>
          <div class="filters__filter">
            <input id="filter-past" class="filters__filter-input visually-hidden" type="radio" name="trip-filter" value="past">
            <label class="filters__filter-label" for="filter-past">Past</label>
          </div>
          <button class="visually-hidden" type="submit">Accept filter</button>
        </form>
      </section>`;
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
