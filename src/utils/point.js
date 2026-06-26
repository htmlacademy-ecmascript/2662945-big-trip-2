import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const EDIT_DATE_FORMAT = 'DD/MM/YY HH:mm';

export const humanizeEventDate = (date) => dayjs(date).format(DATE_FORMAT);
export const humanizeEventTime = (date) => dayjs(date).format(TIME_FORMAT);
export const humanizeEditEventDate = (date) => dayjs(date).format(EDIT_DATE_FORMAT);
export const humanizeHeaderDate = (date) => dayjs(date).format('D MMM');

export const getEventDuration = (dateFrom, dateTo) => {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom));
  const eventDuration = dayjs.duration(diff);
  const days = eventDuration.days();
  const hours = eventDuration.hours();
  const minutes = eventDuration.minutes();

  const formatItem = (value) => String(value).padStart(2, '0');

  if (days > 0) {
    return `${formatItem(days)}D ${formatItem(hours)}H ${formatItem(minutes)}M`;
  }

  if (hours > 0) {
    return `${formatItem(hours)}H ${formatItem(minutes)}M`;
  }

  return `${formatItem(minutes)}M`;
};

