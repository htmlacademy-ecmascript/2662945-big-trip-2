import dayjs from 'dayjs';
export const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];
export const CITIES = [
  'Tokyo',
  'Chamonix',
  'Geneva',
  'Barcelona',
  'London',
  'Amsterdam',
  'Prague',
];
export const TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

export const OFFERS = [
  'Add luggage',
  'Switch to comfort',
  'Order Uber',
  'Add meal',
  'Travel by train',
];

export const PRICE = {
  min: 30,
  max: 3000,
};
export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const DURATION = {
  day: 1,
  hour: 2,
  min: 20,
};

export function getDate({ next }) {
  const daysGap = Math.floor(Math.random() * (DURATION.day + 1));
  const hoursGap = Math.floor(Math.random() * (DURATION.hour + 1));
  const minsGap = Math.floor(Math.random() * (DURATION.min + 1));

  if (next) {
    return dayjs()
      .add(daysGap, 'day')
      .add(hoursGap, 'hour')
      .add(minsGap, 'minute')
      .toDate();
  }

  return dayjs()
    .subtract(daysGap, 'day')
    .subtract(hoursGap, 'hour')
    .subtract(minsGap, 'minute')
    .toDate();
}

