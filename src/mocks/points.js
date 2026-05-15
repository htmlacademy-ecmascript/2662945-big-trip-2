import { getRandomNumber, PRICE, getDate } from '../mocks/utils.js';

export const generateMockPoints = (type, destinationId, offerIds) => ({
  id: `${Date.now()}-${getRandomNumber(1, 1000)}`,
  basePrice: Math.floor(Math.random() * (PRICE.max - PRICE.min + 1)) + PRICE.min,
  dateFrom: getDate({ next: false }),
  dateTo: getDate({ next: true }),
  destination: destinationId,
  isFavorite: Math.random() < 0.5,
  offers: offerIds,
  type,
});
