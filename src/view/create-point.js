import { createElement } from '../render.js';

export default class ViewCreatePoint {
  getTemplate() {
    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__field-group event__field-group--destination">
              <input class="event__input event__input--destination" type="text" name="event-destination" value="">
            </div>
            <button class="event__save-btn btn btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Cancel</button>
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
