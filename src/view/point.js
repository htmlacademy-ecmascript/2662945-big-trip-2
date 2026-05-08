import { createElement } from '../render.js';

export default class ViewPoint {
  constructor(eventNumber = 1) {
    this.eventNumber = eventNumber;
  }

  getTemplate() {
    return `
      <li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" src="img/icons/flight.png" width="42" height="42" alt="Event type icon">
          </div>
          <h3 class="event__title">Flight Chamonix</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="2019-03-18T12:25">12:25</time>
              &mdash;
              <time class="event__end-time" datetime="2019-03-18T13:35">13:35</time>
            </p>
            <p class="event__duration">01H 10M</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">160</span>
          </p>
          <button class="event__favorite-btn" type="button">
            <span class="visually-hidden">Add to favorite</span>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`;
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
