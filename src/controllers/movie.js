import {render, appendChild, removeChild, RenderPosition, replace} from "../utils/render.js";
import {ESC_KEY} from "../const.js";
import FilmDetailsPopupComponent from "../components/film-details-popup.js";
import FilmCardComponent from "../components/film-card.js";

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._siteMain = document.querySelector(`.main`);
    this._filmDetailsPopupComponent = null;
    this._filmCardComponent = null;
  }

  _onCloseFilmDetailsPopup() {
    removeChild(this._siteMain, this._filmDetailsPopupComponent);
    this._mode = Mode.DEFAULT;

    this._filmDetailsPopupComponent.removeClickHandler(() => {
      this._onCloseFilmDetailsPopup();
    });

    document.removeEventListener(`keydown`, (evt) => {
      if (evt.key === ESC_KEY) {
        this._onCloseFilmDetailsPopup();
      }
    });
  }

  render(film) {
    const oldFilmComponent = this._filmCardComponent;
    const oldFilmPopupComponent = this._filmDetailsPopupComponent;
    this._filmDetailsPopupComponent = new FilmDetailsPopupComponent(film);
    this._filmCardComponent = new FilmCardComponent(film);

    const onPosterClick = () => {
      this._onViewChange();

      appendChild(this._siteMain, this._filmDetailsPopupComponent);
      this._mode = Mode.POPUP;

      this._filmDetailsPopupComponent.setClickHandler(() => {
        this._onCloseFilmDetailsPopup();
      });

      document.addEventListener(`keydown`, (evt) => {
        if (evt.key === ESC_KEY) {
          this._onCloseFilmDetailsPopup();
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

  _setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._onCloseFilmDetailsPopup();
    }
  }
}

export default MovieController;
