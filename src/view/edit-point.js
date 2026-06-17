import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TYPES } from '../mocks/const.js';
import { humanizeEditEventDate } from '../utils/point.js';

const DateFormat = {
  FLATPICKR: 'd/m/y H:i',
};

export default class ViewEditPoint extends AbstractStatefulView {
  #onFormSubmit = null;
  #onRollupClick = null;
  #onDeleteClick = null;
  #dateFromPicker = null;
  #dateToPicker = null;

  constructor({ point, destinations, offers, isCreating = false }) {
    super();

    this._state = {
      point: structuredClone(point),
      destinations: structuredClone(destinations),
      offers: structuredClone(offers),
      isCreating,
    };

    this._restoreHandlers();
  }

  get template() {
    const { point, destinations, offers, isCreating } = this._state;
    const { type, destination, basePrice, dateFrom, dateTo, offers: selectedOfferIds } = point;

    const offersByType = offers.find((offer) => offer.type === type);
    const availableOffers = offersByType ? offersByType.offers : [];
    const destinationData = destinations.find((dest) => dest.id === destination);
    const pointId = point.id;

    const typeItems = TYPES.map((item) => {
      const value = item.toLowerCase();

      return `
        <div class="event__type-item">
          <input
            id="event-type-${value}-${pointId}"
            class="event__type-input visually-hidden"
            type="radio"
            name="event-type"
            value="${value}"
            ${value === type ? 'checked' : ''}
          >
          <label
            class="event__type-label event__type-label--${value}"
            for="event-type-${value}-${pointId}"
          >
            ${item}
          </label>
        </div>
      `;
    }).join('');

    const offersItems = availableOffers.map((offer) => `
      <div class="event__offer-selector">
        <input
          class="event__offer-checkbox visually-hidden"
          id="event-offer-${offer.id}-${pointId}"
          type="checkbox"
          name="event-offer-${offer.id}"
          ${selectedOfferIds.includes(offer.id) ? 'checked' : ''}
        >
        <label
          class="event__offer-label"
          for="event-offer-${offer.id}-${pointId}"
        >
          <span class="event__offer-title">${offer.title}</span>
          +€&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `).join('');

    const destinationsOptions = destinations.map((dest) => `
      <option value="${dest.name}"></option>
    `).join('');

    const offersSection = availableOffers.length
      ? `
        <section class="event__section event__section--offers">
          <h3 class="event__section-title event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offersItems}
          </div>
        </section>
      `
      : '';

    const destinationSection = destinationData
      ? `
        <section class="event__section event__section--destination">
          <h3 class="event__section-title event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
            ${destinationData.description}
          </p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${destinationData.pictures.map((pic) => `
                <img
                  class="event__photo"
                  src="${pic.src}"
                  alt="${pic.description}"
                >
              `).join('')}
            </div>
          </div>
        </section>
      `
      : '';

    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label
                class="event__type event__type-btn"
                for="event-type-toggle-${pointId}"
              >
                <span class="visually-hidden">Choose event type</span>
                <img
                  class="event__type-icon"
                  width="17"
                  height="17"
                  src="img/icons/${type}.png"
                  alt="Event type icon"
                >
              </label>

              <input
                class="event__type-toggle visually-hidden"
                id="event-type-toggle-${pointId}"
                type="checkbox"
              >

              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>
                  ${typeItems}
                </fieldset>
              </div>
            </div>

            <div class="event__field-group event__field-group--destination">
              <label
                class="event__label event__type-output"
                for="event-destination-${pointId}"
              >
                ${type}
              </label>

              <input
                class="event__input event__input--destination"
                id="event-destination-${pointId}"
                type="text"
                name="event-destination"
                value="${destinationData ? destinationData.name : ''}"
                list="destination-list-${pointId}"
                autocomplete="off"
                required
              >

              <datalist id="destination-list-${pointId}">
                ${destinationsOptions}
              </datalist>
            </div>

            <div class="event__field-group event__field-group--time">
              <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
              <input
                class="event__input event__input--time"
                id="event-start-time-${pointId}"
                type="text"
                name="event-start-time"
                value="${dateFrom ? humanizeEditEventDate(dateFrom) : ''}"
              >
              &mdash;
              <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
              <input
                class="event__input event__input--time"
                id="event-end-time-${pointId}"
                type="text"
                name="event-end-time"
                value="${dateTo ? humanizeEditEventDate(dateTo) : ''}"
              >
            </div>

            <div class="event__field-group event__field-group--price">
              <label class="event__label" for="event-price-${pointId}">
                <span class="visually-hidden">Price</span>
                €
              </label>

              <input
                class="event__input event__input--price"
                id="event-price-${pointId}"
                type="number"
                name="event-price"
                value="${basePrice}"
                min="0"
                step="1"
                required
              >
            </div>

            <button class="event__save-btn btn btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">
              ${isCreating ? 'Cancel' : 'Delete'}
            </button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </header>

          <section class="event__details">
            ${offersSection}
            ${destinationSection}
          </section>
        </form>
      </li>
    `;
  }

  removeElement() {
    this.#dateFromPicker?.destroy();
    this.#dateToPicker?.destroy();
    this.#dateFromPicker = null;
    this.#dateToPicker = null;
    super.removeElement();
  }

  _restoreHandlers() {
    this.setFormSubmitHandler(this.#onFormSubmit);
    this.setRollupClickHandler(this.#onRollupClick);
    this.setDeleteClickHandler(this.#onDeleteClick);

    this.#setTypeChangeHandler();
    this.#setDestinationChangeHandler();
    this.#setDatepickers();
  }

  setFormSubmitHandler(callback) {
    this.#onFormSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#handleSubmit);
  }

  setRollupClickHandler(callback) {
    this.#onRollupClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#handleRollupClick);
  }

  setDeleteClickHandler(callback) {
    this.#onDeleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#handleDeleteClick);
  }

  #handleSubmit = (evt) => {
    evt.preventDefault();

    const { point, destinations } = this._state;
    const destinationInput = this.element.querySelector('.event__input--destination');
    const priceInput = this.element.querySelector('.event__input--price');

    const destination = destinations.find((dest) => dest.name === destinationInput.value.trim());
    const basePrice = Number(priceInput.value);

    if (!destination || Number.isNaN(basePrice)) {
      this.element.querySelector('form').reportValidity();
      return;
    }

    const updatedPoint = {
      ...point,
      destination: destination.id,
      basePrice,
    };

    this.#onFormSubmit?.(updatedPoint);
  };

  #handleRollupClick = (evt) => {
    evt.preventDefault();
    this.#onRollupClick?.();
  };

  #handleDeleteClick = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick?.();
  };

  #setTypeChangeHandler() {
    this.element.querySelector('.event__type-group').addEventListener('change', (evt) => {
      const target = evt.target;

      if (!target.matches('.event__type-input')) {
        return;
      }

      this.updateElement({
        point: {
          ...this._state.point,
          type: target.value,
          offers: [],
        },
      });
    });
  }

  #setDestinationChangeHandler() {
    this.element.querySelector('.event__input--destination').addEventListener('change', (evt) => {
      const inputValue = evt.target.value.trim();
      const destination = this._state.destinations.find((dest) => dest.name === inputValue);

      if (!destination) {
        evt.target.setCustomValidity('Choose a city from the list');
        evt.target.reportValidity();
        return;
      }

      evt.target.setCustomValidity('');

      this.updateElement({
        point: {
          ...this._state.point,
          destination: destination.id,
        },
      });
    });
  }

  #setDatepickers() {
    const startInput = this.element.querySelector(`#event-start-time-${this._state.point.id}`);
    const endInput = this.element.querySelector(`#event-end-time-${this._state.point.id}`);

    this.#dateFromPicker = flatpickr(startInput, {
      dateFormat: DateFormat.FLATPICKR,
      defaultDate: this._state.point.dateFrom,
      enableTime: true,
      onChange: ([userDate]) => {
        this.updateElement({
          point: {
            ...this._state.point,
            dateFrom: userDate.toISOString(),
          },
        });
      },
    });

    this.#dateToPicker = flatpickr(endInput, {
      dateFormat: DateFormat.FLATPICKR,
      defaultDate: this._state.point.dateTo,
      enableTime: true,
      onChange: ([userDate]) => {
        this.updateElement({
          point: {
            ...this._state.point,
            dateTo: userDate.toISOString(),
          },
        });
      },
    });
  }
}
