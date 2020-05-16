import FilmsComponent from "../components/films.js";
import ExtraBlockComponent from "../components/extra-block.js";
import SortComponent, {SortType} from "../components/sort.js";
import MoreButtonComponent from "../components/more-button.js";
import MovieController from "./movie.js";
import UserRankComponent from "../components/user-rank.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {SHOWING_FILMS_COUNT_ON_START, SHOWING_FILM_COUNT_BY_BUTTON, EXTRA_FILM_CARD_COUNT} from "../const.js";

const EXTRA_BLOCK_TITLE = [`Top rated`, `Most commented`];

class PageController {
  constructor(containerClass, moviesModel, api) {
    this._showedMovieControllers = [];
    this._extraBlockComponents = [];
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._containerClass = containerClass;
    this._moviesModel = moviesModel;
    this._api = api;
    this._sortComponent = new SortComponent();
    this._moreButtonComponent = new MoreButtonComponent();
    this._filmsComponent = null;
    this._userRankComponent = null;
    this._siteMain = document.querySelector(`.main`);
    this._moreButton = this._moreButtonComponent;
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
    this._sortType = SortType.DEFAULT;
  }

  _getSortedFilms(films, sortType, from, to) {
    let sortedFilms = [];
    const showingFilms = films.slice();

    switch (sortType) {
      case SortType.DATE:
        sortedFilms = showingFilms.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case SortType.RATING:
        sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
        break;
      case SortType.DEFAULT:
        sortedFilms = showingFilms;
        break;
    }

    return sortedFilms.slice(from, to);
  }

  _renderShowMoreButton(siteFilmsSection, filmCards) {
    if (filmCards.length !== 0) {
      this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
      render(siteFilmsSection.querySelector(`.films-list`), this._moreButton, RenderPosition.BEFOREEND);

      this._moreButton.setClickHandler(() => {
        this._onShowMoreButtonClick(siteFilmsSection);
      });
    }
  }

  _onShowMoreButtonClick(siteFilmsSection) {
    const prevFilmsCount = this._showingFilmsCount;
    const filmCards = this._moviesModel.getMovies();
    this._showingFilmsCount = prevFilmsCount + SHOWING_FILM_COUNT_BY_BUTTON;

    this._renderFilmCards(siteFilmsSection, filmCards, prevFilmsCount, this._showingFilmsCount, this._onDataChange, this._onViewChange, this._api);

    if (this._showingFilmsCount >= filmCards.length) {
      remove(this._moreButton);
    }
  }

  render(minFilmsNum, maxFilmsNum) {
    const films = this._moviesModel.getMovies();

    this._filmsComponent = new FilmsComponent(films);
    this._renderUserRank(films);
    render(this._siteMain, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._siteMain, this._filmsComponent, RenderPosition.BEFOREEND);

    const siteFilmsSection = this._siteMain.querySelector(`.films`);
    const siteFilmsListSection = this._siteMain.querySelector(this._containerClass);

    this._renderFilmCards(siteFilmsListSection, films, minFilmsNum, maxFilmsNum, this._onDataChange, this._onViewChange, this._api);

    this._renderShowMoreButton(siteFilmsSection, films);
    this._renderExtraBlocks(films, siteFilmsSection);

    const siteFilmsListContainer = siteFilmsListSection.querySelector(`.films-list__container`);
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedFilms = this._getSortedFilms(this._moviesModel.getMovies(), sortType, 0, this._moviesModel.getMovies().length);
      this._sortType = sortType;
      siteFilmsListContainer.innerHTML = ``;
      remove(this._moreButton);
      this._renderFilmCards(siteFilmsListSection, sortedFilms, 0, SHOWING_FILMS_COUNT_ON_START, this._onDataChange, this._onViewChange, this._api);
      this._renderShowMoreButton(siteFilmsSection, sortedFilms);
    });
  }

  _renderExtraBlocks(filmCards, siteFilmsSection) {
    this._containerClass = `.films-list--extra:last-child`;
    EXTRA_BLOCK_TITLE.forEach((element) => {
      const extraFilms = filmCards.slice().sort((prev, next) => {
        return element === `Top rated` ? next.rating - prev.rating : next.comments.length - prev.comments.length;
      }).slice(0, EXTRA_FILM_CARD_COUNT);

      if (extraFilms.length) {
        if ((element === `Top rated` && extraFilms[0].rating !== 0) || (element !== `Top rated` && extraFilms[0].comments !== 0)) {
          const extraBlock = new ExtraBlockComponent(element);
          this._extraBlockComponents.push(extraBlock);
          render(siteFilmsSection, extraBlock, RenderPosition.BEFOREEND);
          const siteFilmsListSection = this._siteMain.querySelector(this._containerClass);
          this._renderFilmCards(siteFilmsListSection, extraFilms, 0, EXTRA_FILM_CARD_COUNT, this._onDataChange, this._onViewChange, this._api);
        }
      }
    });
  }

  _removeFilms() {
    this._showedMovieControllers.forEach((it) => it._destroy());
    this._showedMovieControllers = [];
    this._extraBlockComponents.forEach((it) => remove(it));
    this._extraBlockComponents = [];
  }

  _renderUserRank(films) {
    const siteHeader = document.querySelector(`.header`);
    if (this._userRankComponent) {
      remove(this._userRankComponent);
    }
    this._userRankComponent = new UserRankComponent(films);
    render(siteHeader, this._userRankComponent, RenderPosition.BEFOREEND);
  }

  _updateFilms() {
    this._containerClass = `.films`;
    const siteFilmsListSection = this._siteMain.querySelector(this._containerClass);
    const sortedFilms = this._getSortedFilms(this._moviesModel.getMovies(), this._sortType, 0, this._moviesModel.getMovies().length);

    this._removeFilms();
    this._renderFilmCards(siteFilmsListSection, sortedFilms, 0, SHOWING_FILMS_COUNT_ON_START, this._onDataChange, this._onViewChange, this._api);
    this._renderUserRank(sortedFilms);
    remove(this._moreButton);
    this._renderShowMoreButton(siteFilmsListSection, sortedFilms);
    this._renderExtraBlocks(sortedFilms, siteFilmsListSection);
  }

  _renderFilmCards(section, films, startNum, endNum, onDataChange, onViewChange, api) {
    films.slice(startNum, endNum).forEach((film) => {
      const siteFilmsListContainer = section.querySelector(`.films-list__container`);
      const movieController = new MovieController(siteFilmsListContainer, onDataChange, onViewChange, api);
      movieController.render(film);
      this._showedMovieControllers = this._showedMovieControllers.concat(movieController);
    });
  }

  _onDataChange(movieController, oldData, newData) {
    this._api.updateFilm(oldData.id, newData).
    then(() => {
      this._moviesModel.updateFilm(oldData.id, newData);
      this._showedMovieControllers.forEach((controller) => {
        if (controller._filmCardComponent._filmCard === oldData) {
          controller.render(newData);
        }
      });
      this._updateFilms();
    });
  }

  _onFilterChange() {
    this._sortType = SortType.DEFAULT;
    this._sortComponent.changeActiveFilter(this._sortType);
    this._updateFilms();
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it._setDefaultView());
  }

  hide() {
  }

  show() {
    this._filmsComponent.show();
  }
}

export default PageController;
