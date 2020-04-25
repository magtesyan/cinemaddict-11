import AbstractSmartComponent from "./abstract-smart-component.js";
import {emojies} from "../mock/comment.js";

const createEmojiesListMarkup = (selectedEmoji) => {
  let markup = ``;

  emojies.forEach((emoji) => {
    const checked = selectedEmoji === emoji ? `checked` : ``;
    markup += `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${checked}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
    </label>`;
  });

  return markup;
};

const createCommentsMarkup = (comments) => {
  const {emoji, text, author, date} = comments;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}" width="55" height="55" alt="emoji-${emoji.split(`.`).shift()}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createFilmDetailsPopupTemplate = (filmCard) => {
  const {name, originalName, rating, date, duration, genre, poster, description, comments, ageLimit, director, writer, actor, country, addToWatchList, alreadyWatched, addToFavorites, emoji} = filmCard;
  const commentsLength = comments ? comments.length : 0;

  const genreBlock = Array.from(genre).reduce((block, current) => {
    block += `<span class="film-details__genre">${current}</span>\n`;
    return block;
  }, ``);

  const commentsMarkup = comments ? comments.map((it, i) => createCommentsMarkup(it, i === 0)).join(`\n`) : ``;
  const emojiMarkup = createEmojiesListMarkup(emoji);

  const setControlItemActive = (item) => {
    return item ? `checked` : ``;
  };

  const emojiLabelMarkup = emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ``;

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

              <p class="film-details__age">${ageLimit}</p>
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
                  <td class="film-details__cell">${date}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
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
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsLength}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsMarkup}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">${emojiLabelMarkup}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${emojiMarkup}
              </div>
            </div>
          </section>
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
    this._subscribeOnEvents();
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

  _subscribeOnEvents() {
    const element = this.getElement();
    const emoji = element.querySelector(`.film-details__emoji-list`);

    if (emoji) {
      emoji.addEventListener(`change`, (evt) => {
        this._film.emoji = evt.target.value;
        this.rerender();
      });
    }
  }
}

export default FilmDetailsPopup;
