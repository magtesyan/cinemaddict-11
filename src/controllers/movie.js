import {render, appendChild, removeChild, RenderPosition, replace, remove} from "../utils/render.js";
import {Keys} from "../const.js";
import FilmDetailsPopupComponent from "../components/film-details-popup.js";
import FilmCardComponent from "../components/film-card.js";
import CommentsBoardComponent from "../components/comments-board.js";
import CommentsModel from "../models/comments.js";

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

let filmsToUpdate = [];

class MovieController {
  constructor(container, onDataChange, onViewChange, onModelDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onModelDataChange = onModelDataChange;
    this._commentsModel = null;
    this._mode = Mode.DEFAULT;
    this._siteMain = document.querySelector(`.main`);
    this._filmDetailsPopupComponent = null;
    this._filmCardComponent = null;
    this.commentsBoardComponent = null;
    this.commentComponent = null;
  }

  _onCloseFilmDetailsPopup() {
    removeChild(this._siteMain, this._filmDetailsPopupComponent);
    this._mode = Mode.DEFAULT;

    this._filmDetailsPopupComponent.removeClickHandler(() => {
      this._onCloseFilmDetailsPopup();
    });

    document.removeEventListener(`keydown`, (evt) => {
      if (evt.key === Keys.ESC_KEY) {
        this._onCloseFilmDetailsPopup();
      }
    });
  }

  render(film) {
    const oldFilmComponent = this._filmCardComponent;
    const oldFilmPopupComponent = this._filmDetailsPopupComponent;
    this._filmCardComponent = new FilmCardComponent(film);
    this._filmDetailsPopupComponent = new FilmDetailsPopupComponent(film);
    this._commentsModel = new CommentsModel();
    this._commentsModel.setComments(film);

    const onPosterClick = () => {
      if (this._filmDetailsPopupComponent) {
        remove(this._filmDetailsPopupComponent);
      }
      this._mode = Mode.DEFAULT;
      this._onViewChange(film);

      filmsToUpdate = filmsToUpdate.concat({
        film,
        commentsModel: this._commentsModel,
      });

      appendChild(this._siteMain, this._filmDetailsPopupComponent);
      this._mode = Mode.POPUP;

      this.renderCommentsBoard(film);

      this._filmDetailsPopupComponent.setClickHandler(() => {
        this._onCloseFilmDetailsPopup(film);
        this._updateFilm();
      });

      document.addEventListener(`keydown`, (evt) => {
        if (evt.key === Keys.ESC_KEY) {
          this._onCloseFilmDetailsPopup(film);
          this._updateFilm();
        }
      });

      this._filmDetailsPopupComponent.setWatchlistButtonClickHandler(() => {
        film = this._onModelDataChange(film, Object.assign({}, film, {
          addToWatchList: !film.addToWatchList,
        }));
        filmsToUpdate[filmsToUpdate.length - 1].film = film;
      });

      this._filmDetailsPopupComponent.setWatchedButtonClickHandler(() => {
        film = this._onModelDataChange(film, Object.assign({}, film, {
          alreadyWatched: !film.alreadyWatched,
        }));
        filmsToUpdate[filmsToUpdate.length - 1].film = film;
      });

      this._filmDetailsPopupComponent.setFavoriteButtonClickHandler(() => {
        film = this._onModelDataChange(film, Object.assign({}, film, {
          addToFavorites: !film.addToFavorites,
        }));
        filmsToUpdate[filmsToUpdate.length - 1].film = film;
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

  _updateFilm() {
    filmsToUpdate.forEach((it) => {
      this._onDataChange(this, it.film, Object.assign({}, it.film, {
        comments: it.commentsModel.getComments(it.film),
      }));
    });
    filmsToUpdate = [];
  }

  _destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsPopupComponent);
  }

  _setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._onCloseFilmDetailsPopup();
    }
  }

  renderCommentsBoard(film) {
    const commentsSection = this._siteMain.querySelector(`.form-details__bottom-container`);
    this._commentBoardComponent = new CommentsBoardComponent(this._commentsModel, film.emoji);
    render(commentsSection, this._commentBoardComponent, RenderPosition.BEFOREEND);
    this._commentBoardComponent.renderAllComments();
    this._commentBoardComponent.addNewCommentHandler();
  }
}

export default MovieController;
