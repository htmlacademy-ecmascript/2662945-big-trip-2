import { getRandomNumber, getRandomArrayElement, CITIES, DESCRIPTIONS } from '../mocks/utils.js';

export const generateMockDestinations = () => ({
  id: `${Date.now()}-${getRandomNumber(1, 1000)}`,
  name: getRandomArrayElement(CITIES),
  description: getRandomArrayElement(DESCRIPTIONS),
  pictures: Array.from({ length: 5 }, () => ({
    src: `https://loremflickr.com/248/152?random=${getRandomNumber(1, 100000)}`,
    description: getRandomArrayElement(DESCRIPTIONS),
  })),
});


