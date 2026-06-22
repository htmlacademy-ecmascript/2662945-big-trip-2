export const sortPointByDay = (pointA, pointB) => new Date(pointA.dateFrom) - new Date(pointB.dateFrom);

export const sortPointByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortPointByTime = (pointA, pointB) => {
  const durationA = new Date(pointA.dateTo) - new Date(pointA.dateFrom);
  const durationB = new Date(pointB.dateTo) - new Date(pointB.dateFrom);
  return durationB - durationA;
};
