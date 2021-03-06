import AbstractComponent from "./abstract-component.js";
import {formatFilmDuration} from "../utils/render";

const SHORT_DESCRIPTION_LENGTH = 140;

const setControlItemActive = (item) => {
  return item ? `film-card__controls-item--active` : ``;
};

const createFilmCardTemplate = (filmCard) => {
  const {name, rating, year, duration, genre, poster, description, comments, addToWatchList, alreadyWatched, addToFavorites} = filmCard;
  const commentsLength = comments ? comments.length : 0;
  const filmCardDuration = formatFilmDuration(duration);
  const cutDescription = description.length < SHORT_DESCRIPTION_LENGTH ? description : `${description.substr(0, SHORT_DESCRIPTION_LENGTH - 1)}...`;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${filmCardDuration}</span>
        <span class="film-card__genre">${Array.from(genre)[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${cutDescription}</p>
      <a class="film-card__comments">${commentsLength} comments</a>
      <form class="film-card__controls">
        <button type="button" class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${setControlItemActive(addToWatchList)}">Add to watchlist</button>
        <button type="button" class="film-card__controls-item button film-card__controls-item--mark-as-watched ${setControlItemActive(alreadyWatched)}">Mark as watched</button>
        <button type="button" class="film-card__controls-item button film-card__controls-item--favorite ${setControlItemActive(addToFavorites)}">Mark as favorite</button>
      </form>
    </article>`
  );
};

class FilmCard extends AbstractComponent {
  constructor(filmCard) {
    super();
    this._filmCard = filmCard;
    this._submitHandler = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._filmCard);
  }

  setPosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
  }

  setCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }

  setTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }
}

export default FilmCard;
