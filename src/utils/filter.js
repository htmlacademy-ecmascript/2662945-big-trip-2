import dayjs from 'dayjs';
import { FilterType } from '../mocks/const.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,

  [FilterType.FUTURE]: (points) =>
    points.filter((point) =>
      dayjs(point.dateFrom).isAfter(dayjs())
    ),

  [FilterType.PAST]: (points) =>
    points.filter((point) =>
      dayjs(point.dateTo).isBefore(dayjs())
    ),

  [FilterType.PRESENT]: (points) =>
    points.filter((point) =>
      (dayjs(point.dateFrom).isBefore(dayjs()) || dayjs(point.dateFrom).isSame(dayjs())) &&
      (dayjs(point.dateTo).isAfter(dayjs()) || dayjs(point.dateTo).isSame(dayjs()))
    ),
};
