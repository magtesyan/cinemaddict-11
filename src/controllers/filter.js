import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {getFilmsByFilter} from "../utils/filter.js";
import MenuComponent from "../components/menu.js";
import {FilterType} from "../const.js";
import StatisticsComponent from "../components/statistics.js";
import moment from "moment";

const DAYS_IN_WEEK = 7;

class FilterController {
  constructor(container, moviesModel, pageController) {
    this.pageController = pageController;
    this._container = container;
    this._moviesModel = moviesModel;
    this._activeFilterType = FilterType.ALL;
    this._menuComponent = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._statisticsComponent = null;
    this._watchedFilms = null;
    this._onStatsPeriodChangeHandler = this._onStatsPeriodChangeHandler.bind(this);

    this.Periods = {
      "All time": true,
      "Today": false,
      "Week": false,
      "Month": false,
      "Year": false
    };

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allFilms = this._moviesModel.getAll();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmsByFilter(allFilms, filterType) ? getFilmsByFilter(allFilms, filterType).length : 0,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._menuComponent;
    this._menuComponent = new MenuComponent(filters);
    this._menuComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._menuComponent, oldComponent);
    } else {
      render(container, this._menuComponent, RenderPosition.BEFOREEND);
    }

    this._watchedFilms = this._moviesModel.getAll() ? this._moviesModel.getAll().filter((movies) => movies.alreadyWatched === true) : undefined;
    this._statisticsComponent = new StatisticsComponent(this._watchedFilms, this.Periods);
    render(this._container, this._statisticsComponent, RenderPosition.BEFOREEND);
    this._statisticsComponent.setPeriodChangeHandler(this._onStatsPeriodChangeHandler);
    this._statisticsComponent.hide();
  }

  _resetPeriods() {
    for (let period in this.Periods) {
      if (Object.prototype.hasOwnProperty.call(this.Periods, period)) {
        this.Periods[period] = false;
      }
    }
  }

  _onFilterChange(filterType) {
    if (filterType === `stats`) {
      this.pageController._filmsComponent.hide();
      this.pageController._sortComponent.hide();
      this._statisticsComponent.show();
    } else {
      remove(this._statisticsComponent);
      this.pageController._filmsComponent.show();
      this.pageController._sortComponent.show();
      this._moviesModel.setFilter(filterType);
      this._activeFilterType = filterType;
      this.render();
    }
  }

  _onDataChange() {
    remove(this._statisticsComponent);
    this.render();
  }

  _onStatsPeriodChangeHandler(evt) {
    const today = new Date();
    let filteredFilms;
    this._watchedFilms = this._moviesModel.getAll().filter((movies) => movies.alreadyWatched === true);

    switch (evt.target.value) {
      case `today`:
        filteredFilms = this._watchedFilms.filter((film) => moment(film.watchingDate).isAfter(today.setDate(today.getDate() - 1)));
        this._resetPeriods();
        this.Periods[`Today`] = true;
        break;
      case `week`:
        filteredFilms = this._watchedFilms.filter((film) => moment(film.watchingDate).isAfter(today.setDate(today.getDate() - DAYS_IN_WEEK)));
        this._resetPeriods();
        this.Periods[`Week`] = true;
        break;
      case `month`:
        filteredFilms = this._watchedFilms.filter((film) => moment(film.watchingDate).isAfter(today.setMonth(today.getMonth() - 1)));
        this._resetPeriods();
        this.Periods[`Month`] = true;
        break;
      case `year`:
        filteredFilms = this._watchedFilms.filter((film) => moment(film.watchingDate).isAfter(today.setYear(today.getYear() - 1)));
        this._resetPeriods();
        this.Periods[`Year`] = true;
        break;
      default:
        filteredFilms = this._watchedFilms;
        this._resetPeriods();
        this.Periods[`All time`] = true;
    }

    remove(this._statisticsComponent);
    this._statisticsComponent = new StatisticsComponent(filteredFilms, this.Periods);
    render(this._container, this._statisticsComponent, RenderPosition.BEFOREEND);
    this._statisticsComponent.setPeriodChangeHandler(this._onStatsPeriodChangeHandler);
  }
}

export default FilterController;
