import TripPresenter from './presenter/presenterTrip.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const presenter = new TripPresenter({
  filtersContainer,
  eventsContainer,
});

presenter.init();
