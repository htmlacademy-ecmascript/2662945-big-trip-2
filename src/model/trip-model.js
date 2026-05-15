import { generateMockPoints } from '../mocks/points.js';
import { generateMockDestinations } from '../mocks/destination.js';
import { generateMockOffers } from '../mocks/offers.js';
import { getRandomArrayElement, TYPES } from '../mocks/utils.js';

const POINTS_COUNT = 3;

export default class TripModel {
  constructor() {
    this.destinationsData = Array.from({ length: 3 }, () => generateMockDestinations());
    this.offersData = generateMockOffers();

    this.pointsData = Array.from({ length: POINTS_COUNT }, () => {
      const destination = getRandomArrayElement(this.destinationsData);

      const allOfferIds = this.offersData.map((offer) => offer.id);
      const randomOffersIds = allOfferIds.filter(() => Math.random() < 0.5);

      const type = getRandomArrayElement(TYPES).toLowerCase();

      return generateMockPoints(type, destination.id, randomOffersIds);
    });
  }

  get points() {
    return this.pointsData;
  }

  get destinations() {
    return this.destinationsData;
  }

  get offers() {
    return this.offersData;
  }
}
