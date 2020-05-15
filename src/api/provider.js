import Film from "../models/film.js";
import {isOnline} from "../utils/common.js";

const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
      .then((films) => {
        const items = createStoreStructure(films.map((film) => film.toRAW()));

        this._store.setItems(items);

        return films;
      });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(Film.parseFilms(storeFilms));
  }

  updateFilm(filmId, data) {
    if (isOnline()) {
      return this._api.updateFilm(filmId, data)
      .then((newFilm) => {
        this._store.setItem(newFilm.id, newFilm.toRAW());

        return newFilm;
      });
    }

    const localFilm = Film.clone(Object.assign(data, {filmId}));

    this._store.setItem(filmId, localFilm.toRAW());

    return Promise.resolve(localFilm);
  }

  getComments(filmId) {
    if (isOnline()) {
      return this._api.getComments(filmId);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  createComment(filmId, comment) {
    if (isOnline()) {
      return this._api.createComment(filmId, comment);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);
          const items = createStoreStructure([...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}

export default Provider;
