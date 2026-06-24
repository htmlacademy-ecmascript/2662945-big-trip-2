import { render, replace, remove } from '../framework/render.js';
import ViewPoint from '../view/point.js';
import ViewEditPoint from '../view/edit-point.js';

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

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#editPointComponent = new ViewEditPoint({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      isCreating: false,
    });

    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setRollupClickHandler(this.#handleRollupClick);
    this.#editPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

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
    document.removeEventListener('keydown', this.#handleEscKeyDown);
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

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFavoriteClick = async () => {
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

  #handleRollupClick = () => {
    this.#replaceFormToCard();
  };

  #handleDeleteClick = async () => {
    try {
      this.#editPointComponent?.setDeleting();
      await this.#onDataChange(this.#point, 'delete');
    } catch (error) {
      this.#editPointComponent?.setAborting();
    }
  };

  #handleFormSubmit = async (updatedPoint) => {
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
    document.addEventListener('keydown', this.#handleEscKeyDown);
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    this.#mode = Mode.DEFAULT;
  }

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };
}

