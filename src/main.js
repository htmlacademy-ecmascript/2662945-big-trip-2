import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import ApiService from './api-service.js';
import ViewNewPointButton from './view/view-new-point-button.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');
const tripMainContainer = document.querySelector('.trip-main');

const api = new ApiService();
const tripModel = new TripModel(api);
const filterModel = new FilterModel();

let filterPresenter = null;
let tripPresenter = null;

const newPointButton = new ViewNewPointButton({
  onClick: buttonClickHandler,
});

function buttonClickHandler() {
  newPointButton.setDisabled(true);
  tripPresenter.createPoint();
}

function newPointDestroyHandler() {
  newPointButton.setDisabled(false);
}

filterPresenter = new FilterPresenter({
  filtersContainer,
  filterModel,
  tripModel,
  onFilterChange: () => {
    tripPresenter.rerender();
    filterPresenter.rerender();
  },
});

tripPresenter = new TripPresenter({
  eventsContainer,
  tripModel,
  filterModel,
  tripMainContainer,
  onNewPointDestroy: newPointDestroyHandler,
  onFilterReset: () => filterPresenter.rerender(),
});

tripMainContainer.append(newPointButton.element);

tripPresenter.init();

(async () => {
  try {
    await tripModel.init();
  } catch (error) {
    // пустое состояние
  } finally {
    tripPresenter.setLoadingFinished();
    tripPresenter.rerender();
    filterPresenter.init();
  }
})();
