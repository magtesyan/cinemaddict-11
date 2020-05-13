import AbstractSmartComponent from "./abstract-smart-component.js";
import {filmDuration} from "../utils/render";
import moment from "moment";

const createFilmDetailsPopupTemplate = (filmCard) => {
  const {name, originalName, rating, date, duration, genre, poster, description, ageLimit, director, writer, actor, country, addToWatchList, alreadyWatched, addToFavorites} = filmCard;
  const formattedDuration = filmDuration(duration);

  const genreBlock = Array.from(genre).reduce((block, current) => {
    block += `<span class="film-details__genre">${current}</span>\n`;
    return block;
  }, ``);

  const setControlItemActive = (item) => {
    return item ? `checked` : ``;
  };

  const releaseDate = moment(date).format(`DD MMMM YYYY`);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageLimit}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${name}</h3>
                  <p class="film-details__title-original">Original: ${originalName}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writer}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actor}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formattedDuration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${genreBlock}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${setControlItemActive(addToWatchList)}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${setControlItemActive(alreadyWatched)}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${setControlItemActive(addToFavorites)}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
        </div>
      </form>
    </section>`
  );
};

class FilmDetailsPopup extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
    this._submitHandler = null;
  }

  recoveryListeners() {
    this.setClickHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailsPopupTemplate(this._film);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
    this._submitHandler = handler;
  }

  removeClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, handler);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, handler);
  }
}

export default FilmDetailsPopup;
