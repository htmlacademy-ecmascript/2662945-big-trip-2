import { render, replace, remove } from '../framework/render.js';
import ViewPoint from '../view/point.js';
import ViewEditPoint from '../view/edit-point.js';

export default class PointPresenter {
  #pointComponent = null;
  #editPointComponent = null;
  #container = null;
  #point = null;
  #destinations = null;
  #offers = null;
  #onDataChange = null;
  #onModeChange = null;
  #isEditMode = false;

  constructor({
    container,
    point,
    destinations,
    offers,
    onDataChange,
    onModeChange
  }) {
    this.#container = container;
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init() {
    this.#pointComponent = new ViewPoint({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
    });

    this.#editPointComponent = new ViewEditPoint({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
    });

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setRollupClickHandler(this.#handleRollupClick);
    this.#editPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointComponent, this.#container);
  }

  destroy() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
    this.#isEditMode = false;
  }

  update(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;
    const wasEditMode = this.#isEditMode;

    this.#pointComponent = new ViewPoint({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
    });

    this.#editPointComponent = new ViewEditPoint({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
    });

    this.#pointComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setRollupClickHandler(this.#handleRollupClick);
    this.#editPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (wasEditMode) {
      replace(this.#editPointComponent, prevEditPointComponent);
      return;
    }

    replace(this.#pointComponent, prevPointComponent);
  }

  resetView() {
    if (this.#isEditMode) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#isEditMode = true;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#isEditMode = false;
  }

  #handleEditClick = () => {
    this.#onModeChange();
    this.#replacePointToForm();
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#onDataChange(updatedPoint);
    this.#replaceFormToPoint();
  };

  #handleDeleteClick = () => {
    this.#replaceFormToPoint();
  };

  #handleFavoriteClick = () => {
    this.#onDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite,
    });
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };
}
