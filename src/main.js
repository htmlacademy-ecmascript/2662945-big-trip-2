import TripPresenter from './presenter/presenterTrip.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const tripModel = new TripModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter({
  eventsContainer,
  tripModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filtersContainer,
  filterModel,
  onFilterChange: () => tripPresenter.rerender(),
});

tripPresenter.init();
filterPresenter.init();

