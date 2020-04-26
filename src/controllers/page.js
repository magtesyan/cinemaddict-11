import FilmsComponent from "../components/films.js";
import ExtraBlockComponent from "../components/extra-block.js";
import SortComponent, {SortType} from "../components/sort.js";
import MoreButtonComponent from "../components/more-button.js";
import MovieController from "./movie.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {FILM_CARD_COUNT, SHOWING_FILMS_COUNT_ON_START, SHOWING_FILM_COUNT_BY_BUTTON, EXTRA_FILM_CARD_COUNT} from "../const.js";

const EXTRA_BLOCK_TITLE = [`Top rated`, `Most commented`];

class PageController {
  constructor(containerClass) {
    this._films = [];
    this._showedMovieControllers = [];
    this._containerClass = containerClass;
    this._sortComponent = new SortComponent();
    this._moreButtonComponent = new MoreButtonComponent();
    this._siteMain = document.querySelector(`.main`);
    this._moreButton = this._moreButtonComponent;
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
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
      render(siteFilmsSection.querySelector(`.films-list`), this._moreButton, RenderPosition.BEFOREEND);
      let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

      this._moreButton.setClickHandler(() => {
        const prevFilmsCount = showingFilmsCount;
        showingFilmsCount = prevFilmsCount + SHOWING_FILM_COUNT_BY_BUTTON;

        this._renderFilmCards(siteFilmsSection, filmCards, prevFilmsCount, showingFilmsCount, this._onDataChange, this._onViewChange);

        if (showingFilmsCount >= FILM_CARD_COUNT) {
          remove(this._moreButton);
        }
      });
    }
  }

  render(films, minFilmsNum, maxFilmsNum) {
    this._films = films;
    render(this._siteMain, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._siteMain, new FilmsComponent(films), RenderPosition.BEFOREEND);

    const siteFilmsSection = this._siteMain.querySelector(`.films`);
    const siteFilmsListSection = this._siteMain.querySelector(this._containerClass);
    this._renderFilmCards(siteFilmsListSection, films, minFilmsNum, maxFilmsNum, this._onDataChange, this._onViewChange);

    this._renderShowMoreButton(siteFilmsSection, films);
    this._renderExtraBlocks(films, siteFilmsSection);

    const siteFilmsListContainer = siteFilmsListSection.querySelector(`.films-list__container`);
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedFilms = this._getSortedFilms(films, sortType, 0, films.length);
      siteFilmsListContainer.innerHTML = ``;
      remove(this._moreButton);
      this._renderFilmCards(siteFilmsListSection, sortedFilms, 0, SHOWING_FILMS_COUNT_ON_START, this._onDataChange, this._onViewChange);
      this._renderShowMoreButton(siteFilmsSection, sortedFilms);
    });
  }

  _renderExtraBlocks(filmCards, siteFilmsSection) {
    EXTRA_BLOCK_TITLE.forEach((element) => {
      const extraFilms = filmCards.slice().sort((prev, next) => {
        return element === `Top rated` ? next.rating - prev.rating : next.comments.length - prev.comments.length;
      }).slice(0, EXTRA_FILM_CARD_COUNT);

      if (extraFilms.length) {
        if ((element === `Top rated` && extraFilms[0].rating !== 0) || (element !== `Top rated` && extraFilms[0].comments !== 0)) {
          this._containerClass = `.films-list--extra:last-child`;
          render(siteFilmsSection, new ExtraBlockComponent(element), RenderPosition.BEFOREEND);
          const siteFilmsListSection = this._siteMain.querySelector(this._containerClass);
          this._renderFilmCards(siteFilmsListSection, extraFilms, 0, EXTRA_FILM_CARD_COUNT, this._onDataChange, this._onViewChange);
        }
      }
    });
  }

  _renderFilmCards(section, films, startNum, endNum, onDataChange, onViewChange) {
    films.slice(startNum, endNum).forEach((film) => {
      const siteFilmsListContainer = section.querySelector(`.films-list__container`);
      const movieController = new MovieController(siteFilmsListContainer, onDataChange, onViewChange);
      movieController.render(film);
      this._showedMovieControllers = this._showedMovieControllers.concat(movieController);
    });
  }

  _onDataChange(movieController, oldData, newData) {
    this._showedMovieControllers.forEach((it) => {
      if (it._filmCardComponent._filmCard === oldData) {
        it.render(newData);
      }
    });
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it._setDefaultView());
  }
}

export default PageController;
