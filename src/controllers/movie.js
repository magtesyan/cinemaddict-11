import {render, appendChild, removeChild, RenderPosition, replace} from "../utils/render.js";
import {ESC_KEY} from "../const.js";
import FilmDetailsPopupComponent from "../components/film-details-popup.js";
import FilmCardComponent from "../components/film-card.js";

class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._siteMain = document.querySelector(`.main`);
    this._filmDetailsPopupComponent = null;
    this._filmCardComponent = null;
  }

  render(film) {
    console.log(film);
    const oldFilmComponent = this._filmCardComponent;
    const oldFilmPopupComponent = this._filmDetailsPopupComponent;
    this._filmDetailsPopupComponent = new FilmDetailsPopupComponent(film);
    this._filmCardComponent = new FilmCardComponent(film);

    const onPosterClick = () => {
      const onCloseFilmDetailsPopup = () => {
        removeChild(this._siteMain, filmDetailsPopupComponent);

        filmDetailsPopupComponent.removeClickHandler(onCloseFilmDetailsPopup);
        document.removeEventListener(`keydown`, function (evt) {
          if (evt.key === ESC_KEY) {
            onCloseFilmDetailsPopup();
          }
        });
      };

      const filmDetailsPopupComponent = new FilmDetailsPopupComponent(film);
      appendChild(this._siteMain, filmDetailsPopupComponent);

      filmDetailsPopupComponent.setClickHandler(onCloseFilmDetailsPopup);

      document.addEventListener(`keydown`, function (evt) {
        if (evt.key === ESC_KEY) {
          onCloseFilmDetailsPopup();
        }
      });
    };

    if (oldFilmComponent && oldFilmPopupComponent) {
      replace(this._filmCardComponent, oldFilmComponent);
      replace(this._filmDetailsPopupComponent, oldFilmPopupComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    this._filmCardComponent.setClickHandler(onPosterClick);

    this._filmCardComponent.setWatchlistButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        addToWatchList: !film.addToWatchList,
      }));
    });

    this._filmCardComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        alreadyWatched: !film.alreadyWatched,
      }));
    });

    this._filmCardComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, film, Object.assign({}, film, {
        addToFavorites: !film.addToFavorites,
      }));
    });
  }
}

export default MovieController;
