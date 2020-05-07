import {FilterType} from "../const.js";

const getWatchlistFilms = (films) => {
  return films.filter((film) => film.addToWatchList);
};

const getHistoryFilms = (films) => {
  return films.filter((film) => film.alreadyWatched);
};

const getFavoriteFilms = (films) => {
  return films.filter((film) => film.addToFavorites);
};

const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return getWatchlistFilms(films);
    case FilterType.HISTORY:
      return getHistoryFilms(films);
    case FilterType.FAVORITES:
      return getFavoriteFilms(films);
  }

  return films;
};

export {getFilmsByFilter};
