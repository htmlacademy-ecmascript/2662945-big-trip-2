import TripPresenter from './presenter/presenterTrip.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const sortContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');

const presenter = new TripPresenter({
  filtersContainer,
  sortContainer,
  eventsContainer,
});

presenter.init();
