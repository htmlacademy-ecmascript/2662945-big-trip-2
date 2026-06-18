import { render } from './framework/render.js';

import TripPresenter from './presenter/presenterTrip.js';
import FilterPresenter from './presenter/filter-presenter.js';

import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';

import ViewNewPointButton from './view/new-point-button.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');
const tripMainContainer = document.querySelector('.trip-main');

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

const newPointButton = new ViewNewPointButton({
  onClick: () => {
    tripPresenter.createPoint();
  }
});

tripMainContainer.append(newPointButton.element);

tripPresenter.init();
filterPresenter.init();
