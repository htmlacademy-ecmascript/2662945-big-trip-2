import TripPresenter from './presenter/presenterTrip.js';

const filtersContainer = document.querySelector('.trip-controls');
const sortContainer = document.querySelector('.trip-events');
const eventsContainer = document.querySelector('.trip-events__list');

const presenter = new TripPresenter({
  filtersContainer,
  sortContainer,
  eventsContainer,
});

presenter.init();
