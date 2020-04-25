import FilmsComponent from "../components/films.js";
import ExtraBlockComponent from "../components/extra-block.js";
import SortComponent, {SortType} from "../components/sort.js";
import MoreButtonComponent from "../components/more-button.js";
import MovieController from "./movie.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {FILM_CARD_COUNT, SHOWING_FILMS_COUNT_ON_START, SHOWING_FILM_COUNT_BY_BUTTON} from "../const.js";

class PageController {
  constructor(containerClass) {
    this._films = [];
    this._containerClass = containerClass;
    this._sortComponent = new SortComponent();
    this._moreButtonComponent = new MoreButtonComponent();
    this._siteMain = document.querySelector(`.main`);
    this._moreButton = this._moreButtonComponent;
    this._onDataChange = this._onDataChange.bind(this);
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

        this._renderFilmCards(siteFilmsSection, filmCards, prevFilmsCount, showingFilmsCount, this._onDataChange);

        if (showingFilmsCount >= FILM_CARD_COUNT) {
          remove(this._moreButton);
        }
      });
    }
  }

  render(films, minFilmsNum, maxFilmsNum, title = null) {
    if (!title) {
      render(this._siteMain, this._sortComponent, RenderPosition.BEFOREEND);
      render(this._siteMain, new FilmsComponent(films), RenderPosition.BEFOREEND);
    }

    const siteFilmsSection = this._siteMain.querySelector(`.films`);
    if (title) {
      render(siteFilmsSection, new ExtraBlockComponent(title), RenderPosition.BEFOREEND);
    }
    const siteFilmsListSection = this._siteMain.querySelector(this._containerClass);
    this._renderFilmCards(siteFilmsListSection, films, minFilmsNum, maxFilmsNum, this._onDataChange);
    if (!title) {
      this._renderShowMoreButton(siteFilmsSection, films);
    }

    const siteFilmsListContainer = siteFilmsListSection.querySelector(`.films-list__container`);
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedFilms = this._getSortedFilms(films, sortType, 0, films.length);
      siteFilmsListContainer.innerHTML = ``;
      remove(this._moreButton);
      this._renderFilmCards(siteFilmsListSection, sortedFilms, 0, SHOWING_FILMS_COUNT_ON_START, this._onDataChange);
      this._renderShowMoreButton(siteFilmsSection, sortedFilms);
    });
  }

  _renderFilmCards(section, films, startNum, endNum, onDataChange) {
    this._films = films;
    films.slice(startNum, endNum).forEach((film) => {
      const siteFilmsListContainer = section.querySelector(`.films-list__container`);
      const movieController = new MovieController(siteFilmsListContainer, onDataChange);
      movieController.render(film);
    });
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._films.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._films = [].concat(this._films.slice(0, index), newData, this._films.slice(index + 1));
    movieController.render(this._films[index]);
  }
}

export default PageController;
