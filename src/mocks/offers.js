import { getRandomNumber } from '../utils/utils.js';
import { PRICE } from '../mocks/const.js';

const createOffer = (id, title) => ({
  id,
  title,
  price: getRandomNumber(PRICE.min, PRICE.max),
});

export const generateMockOffers = () => [
  {
    type: 'taxi',
    offers: [
      createOffer('taxi-1', 'Order Uber'),
      createOffer('taxi-2', 'Switch to comfort'),
    ],
  },

  {
    type: 'bus',
    offers: [
      createOffer('bus-1', 'Add luggage'),
      createOffer('bus-2', 'Choose seats'),
    ],
  },

  {
    type: 'train',
    offers: [
      createOffer('train-1', 'Travel by train'),
      createOffer('train-2', 'Choose compartment'),
    ],
  },

  {
    type: 'flight',
    offers: [
      createOffer('flight-1', 'Add luggage'),
      createOffer('flight-2', 'Add meal'),
      createOffer('flight-3', 'Choose seats'),
    ],
  },

  {
    type: 'ship',
    offers: [
      createOffer('ship-1', 'Cabin upgrade'),
      createOffer('ship-2', 'Add dinner'),
    ],
  },

  {
    type: 'drive',
    offers: [
      createOffer('drive-1', 'Rent GPS'),
      createOffer('drive-2', 'Add insurance'),
    ],
  },

  {
    type: 'check-in',
    offers: [
      createOffer('checkin-1', 'Early check-in'),
    ],
  },

  {
    type: 'sightseeing',
    offers: [
      createOffer('sightseeing-1', 'Personal guide'),
      createOffer('sightseeing-2', 'Museum ticket'),
    ],
  },

  {
    type: 'restaurant',
    offers: [
      createOffer('restaurant-1', 'Reserve table'),
      createOffer('restaurant-2', 'Chef special'),
    ],
  },
];
