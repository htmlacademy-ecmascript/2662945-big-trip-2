import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../utils/const.js';

const EMPTY_MESSAGES = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

export default class ViewEmptyPointListFilter extends AbstractView {
  #filterType = FilterType.EVERYTHING;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return `
      <p class="trip-events__msg">
        ${EMPTY_MESSAGES[this.#filterType] ?? EMPTY_MESSAGES[FilterType.EVERYTHING]}
      </p>
    `;
  }
}

