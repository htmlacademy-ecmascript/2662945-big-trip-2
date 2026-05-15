import TripPresenter from './presenter/presenterTrip.js';
import TripModel from './model/trip-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const tripModel = new TripModel();

const presenter = new TripPresenter({
  filtersContainer,
  eventsContainer,
  tripModel,
});

presenter.init();
