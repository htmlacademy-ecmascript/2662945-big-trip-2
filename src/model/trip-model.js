import { generateMockPoints } from '../mocks/points.js';
import { generateMockDestinations } from '../mocks/destination.js';
import { generateMockOffers } from '../mocks/offers.js';
import { getRandomArrayElement } from '../utils/utils.js';
import { TYPES, POINTS_COUNT } from '../mocks/const.js';

export default class TripModel {
  constructor() {
    this.destinationsData = Array.from({ length: POINTS_COUNT }, () => generateMockDestinations());
    this.offersData = generateMockOffers();

    this.pointsData = Array.from({ length: POINTS_COUNT }, () => {
      const destination = getRandomArrayElement(this.destinationsData);
      const type = getRandomArrayElement(TYPES).toLowerCase();
      const offersByType =
  this.offersData.find((offer) => offer.type === type);
      const allOfferIds =
  offersByType ? offersByType.offers.map((offer) => offer.id) : [];
      const randomOffersIds =
  allOfferIds.filter(() => Math.random() < 0.5);


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
