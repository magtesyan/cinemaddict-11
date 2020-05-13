import {getFilmsByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";

class Movies {
  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getMovies() {
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getMoviesAll() {
    return this._films;
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }
    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);
    return true;
  }

  setMovies(films) {
    this._films = films;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}

export default Movies;
