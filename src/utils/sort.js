import dayjs from 'dayjs';

export const sortPointByDay = (pointA, pointB) =>
  dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

export const sortPointByPrice = (pointA, pointB) =>
  pointB.basePrice - pointA.basePrice;

export const sortPointByTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return durationB - durationA;
};
