import {
  adaptDestinationToClient,
  adaptOfferToClient,
  adaptPointToClient,
  adaptPointToServer
} from '../utils/adapter.js';

export default class TripModel {
  #api = null;
  #points = [];
  #destinations = [];
  #offers = [];

  constructor(api) {
    this.#api = api;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    const [points, destinations, offers] = await Promise.all([
      this.#api.loadPoints(),
      this.#api.loadDestinations(),
      this.#api.loadOffers(),
    ]);

    this.#points = points.map(adaptPointToClient);
    this.#destinations = destinations.map(adaptDestinationToClient);
    this.#offers = offers.map(adaptOfferToClient);
  }

  updatePoint(updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      return;
    }

    this.#points.splice(index, 1, updatedPoint);
  }

  async updatePointOnServer(updatedPoint) {
    const response = await this.#api.updatePoint(adaptPointToServer(updatedPoint));
    const adaptedPoint = adaptPointToClient(response);

    this.updatePoint(adaptedPoint);
    return adaptedPoint;
  }
}

