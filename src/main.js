import TripPresenter from './presenter/presenterTrip.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import ApiService from './api.js';
import ViewNewPointButton from './view/new-point-button.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');
const tripMainContainer = document.querySelector('.trip-main');

const api = new ApiService();
const tripModel = new TripModel(api);
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
  onClick: () => tripPresenter.createPoint(),
});

tripMainContainer.append(newPointButton.element);

(async () => {
  try {
    await tripModel.init();
  } catch (error) {
    // пустое состояние
  } finally {
    tripPresenter.setLoadingFinished();
    tripPresenter.init();
    filterPresenter.init();
  }
})();
