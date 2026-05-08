import { createElement } from '../framework/render.js';

export default class ViewEditPoint {
  getTemplate() {
    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/bus.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
            </div>

            <div class="event__field-group event__field-group--destination">
              <label class="event__label event__type-output" for="event-destination-1">Bus</label>
              <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva">
            </div>

            <div class="event__field-group event__field-group--time">
              <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
              &mdash;
              <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
            </div>

            <div class="event__field-group event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="">
            </div>

            <button class="event__save-btn btn btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Delete</button>
          </header>
        </form>
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
