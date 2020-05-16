import {FilterType} from "../const.js";

const UserLevels = {
  0: ``,
  10: `Novice`,
  20: `Fan`,
  21: `Movie Buff`,
};

const getWatchlistFilms = (films) => {
  return films ? films.filter((film) => film.addToWatchList) : films;
};

const getHistoryFilms = (films) => {
  return films ? films.filter((film) => film.alreadyWatched) : films;
};

const getFavoriteFilms = (films) => {
  return films ? films.filter((film) => film.addToFavorites) : films;
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

const userLevel = (films) => {
  let userRank = UserLevels[`21`];
  const watchedFilmsCount = films ? films.filter((film) => film.alreadyWatched === true).length : 0;

  for (let i = 0; i < Object.keys(UserLevels).length; i++) {
    if (watchedFilmsCount <= parseInt(Object.keys(UserLevels)[i], 10)) {
      userRank = Object.values(UserLevels)[i];
      break;
    }
  }

  return userRank;
};

export {getFilmsByFilter, userLevel};
