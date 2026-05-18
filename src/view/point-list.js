export default class ViewPointList {
  getTemplate() {
    return '<ul class="trip-events__list"></ul>';
  }

  getElement() {
    if (!this.element) {
      const element = document.createElement('div');
      element.innerHTML = this.getTemplate();
      this.element = element.firstElementChild;
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

