import TripPresenter from './presenter/presenterTrip.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import ApiService from './api.js';
import ViewNewPointButton from './view/new-point-button.js';
import ViewLoading from './view/loading.js';
import { render, remove, RenderPosition } from './framework/render.js';

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
  tripMainContainer,
});

const filterPresenter = new FilterPresenter({
  filtersContainer,
  filterModel,
  tripModel,
  onFilterChange: () => {
    tripPresenter.rerender();
    filterPresenter.rerender();
  },
});

const loadingComponent = new ViewLoading();
render(loadingComponent, eventsContainer, RenderPosition.BEFOREEND);

const newPointButton = new ViewNewPointButton({
  onClick: () => tripPresenter.createPoint(),
});
render(newPointButton, tripMainContainer, RenderPosition.BEFOREEND);

(async () => {
  try {
    await tripModel.init();
  } catch (error) {
    loadingComponent.element.textContent = 'Failed to load latest route information';
    return;
  }

  remove(loadingComponent);
  tripPresenter.setLoadingFinished();
  tripPresenter.init();
  filterPresenter.init();
})();
