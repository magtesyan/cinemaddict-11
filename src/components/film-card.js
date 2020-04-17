import {createElement} from "../util.js";

const setControlItemActive = (item) => {
  return item ? `film-card__controls-item--active` : ``;
};

const createFilmCardTemplate = (filmCard) => {
  const {name, rating, year, duration, genre, poster, description, comments, addToWatchList, alreadyWatched, addToFavorites} = filmCard;
  const commentsLength = comments ? comments.length : 0;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${Array.from(genre)[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${commentsLength} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${setControlItemActive(addToWatchList)}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${setControlItemActive(alreadyWatched)}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${setControlItemActive(addToFavorites)}">Mark as favorite</button>
      </form>
    </article>`
  );
};

class FilmCard {
  constructor(filmCard) {
    this._filmCard = filmCard;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._filmCard);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default FilmCard;