import { render, replace, remove } from '../framework/render.js';
import ViewPoint from '../view/view-point.js';
import ViewEditPoint from '../view/view-edit-point.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #container = null;
  #point = null;
  #destinations = [];
  #offers = [];
  #pointComponent = null;
  #editPointComponent = null;
  #mode = Mode.DEFAULT;
  #onDataChange = null;
  #onModeChange = null;

  constructor({ container, point, destinations, offers, onDataChange, onModeChange }) {
    this.#container = container;
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init() {
    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new ViewPoint({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
    });

    this.#pointComponent.setEditClickHandler(this.#editClickHandler);
    this.#pointComponent.setFavoriteClickHandler(this.#favoriteClickHandler);

    this.#editPointComponent = new ViewEditPoint({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      isCreating: false,
    });

    this.#editPointComponent.setFormSubmitHandler(this.#formSubmitHandler);
    this.#editPointComponent.setRollupClickHandler(this.#rollupClickHandler);
    this.#editPointComponent.setDeleteClickHandler(this.#formDeleteClickHandler);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
    document.removeEventListener('keydown', this.#documentKeydownHandler);
  }

  resetView() {
    if (this.#mode === Mode.EDITING) {
      this.#replaceFormToCard();
    }
  }

  update(point) {
    this.#point = point;
    this.init();
  }

  #editClickHandler = () => {
    this.#replaceCardToForm();
  };

  #favoriteClickHandler = async () => {
    try {
      const updatedPoint = {
        ...this.#point,
        isFavorite: !this.#point.isFavorite,
      };

      const result = await this.#onDataChange(updatedPoint);
      this.update(result);
    } catch (error) {
      this.#editPointComponent?.setAborting();
    }
  };

  #rollupClickHandler = () => {
    this.#replaceFormToCard();
  };

  #formDeleteClickHandler = async () => {
    try {
      this.#editPointComponent?.setDeleting();
      await this.#onDataChange(this.#point, 'delete');
    } catch (error) {
      this.#editPointComponent?.setAborting();
    }
  };

  #formSubmitHandler = async (updatedPoint) => {
    try {
      this.#editPointComponent?.setSaving();
      const result = await this.#onDataChange(updatedPoint);
      this.#replaceFormToCard();
      this.update(result);
    } catch (error) {
      this.#editPointComponent?.setAborting();
    }
  };

  #replaceCardToForm() {
    this.#onModeChange();
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#documentKeydownHandler);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#documentKeydownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #documentKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };
}

