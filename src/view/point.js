import AbstractView from '../framework/view/abstract-view.js';
import {
  humanizeEventDate,
  humanizeEventTime,
  getEventDuration
} from '../utils/point.js';

export default class ViewPoint extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;

  constructor({ point, destinations, offers }) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    const {
      type,
      destination,
      basePrice,
      isFavorite,
      offers,
      dateFrom,
      dateTo
    } = this.#point;

    const destinationData = this.#destinations.find((dest) => dest.id === destination);
    const destinationName = destinationData ? destinationData.name : '';

    const selectedOffers = this.#offers.filter((offer) => offers.includes(offer.id));

    const offersMarkup = selectedOffers.map((offer) => `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
    `).join('');

    return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${dateFrom}">
            ${humanizeEventDate(dateFrom)}
          </time>

          <div class="event__type">
            <img
              class="event__type-icon"
              width="42"
              height="42"
              src="img/icons/${type}.png"
              alt="Event type icon"
            >
          </div>

          <h3 class="event__title">
            ${type} ${destinationName}
          </h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${dateFrom}">
                ${humanizeEventTime(dateFrom)}
              </time>
              —
              <time class="event__end-time" datetime="${dateTo}">
                ${humanizeEventTime(dateTo)}
              </time>
            </p>

            <p class="event__duration">
              ${getEventDuration(dateFrom, dateTo)}
            </p>
          </div>

          <p class="event__price">
            € <span class="event__price-value">${basePrice}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>

          <ul class="event__selected-offers">
            ${offersMarkup}
          </ul>

          <button
            class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}"
            type="button"
          >
            <span class="visually-hidden">Add to favorite</span>
            <svg
              class="event__favorite-icon"
              width="28"
              height="28"
              viewBox="0 0 28 28"
            >
              <path
                d="M14 21l-7.053 3.708 1.347-7.854L2.588 11.292l7.886-1.146L14 3l3.526 7.146 7.886 1.146-5.706 5.562 1.347 7.854z"
              />
            </svg>
          </button>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
    `;
  }

  setEditClickHandler(callback) {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', callback);
  }

  setFavoriteClickHandler(callback) {
    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', (evt) => {
        evt.preventDefault();
        callback();
      });
  }
}
