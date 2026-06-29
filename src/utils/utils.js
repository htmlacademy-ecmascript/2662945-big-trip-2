import dayjs from 'dayjs';
import { DURATION } from '../utils/const.js';

export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

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

export function normalizePositiveInteger(value) {
  const digits = String(value).replace(/\D/g, '');
  return digits.replace(/^0+/, '');
}


