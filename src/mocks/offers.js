import { getRandomArrayElement, OFFERS, PRICE } from '../mocks/utils.js';

export const generateMockOffer = (id) => ({
  id,
  title: getRandomArrayElement(OFFERS),
  price: Math.floor(Math.random() * (PRICE.max - PRICE.min + 1)) + PRICE.min,
});

export const generateMockOffers = () => [
  generateMockOffer('luggage'),
  generateMockOffer('comfort'),
  generateMockOffer('meal'),
  generateMockOffer('seats'),
  generateMockOffer('train'),
];
