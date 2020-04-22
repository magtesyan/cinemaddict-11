import FilmsComponent from "../components/films.js";
import ExtraBlockComponent from "../components/extra-block.js";
import SortComponent, {SortType} from "../components/sort.js";
import FilmCardComponent from "../components/film-card.js";
import MoreButtonComponent from "../components/more-button.js";
import FilmDetailsPopupComponent from "../components/film-details-popup.js";
import {render, RenderPosition, appendChild, removeChild, remove} from "../utils/render.js";
import {ESC_KEY, FILM_CARD_COUNT, SHOWING_FILMS_COUNT_ON_START, SHOWING_FILM_COUNT_BY_BUTTON} from "../const.js";

class PageController {
  constructor(containerClass) {
    this._containerClass = containerClass;
    this._sortComponent = new SortComponent();
    this._moreButtonComponent = new MoreButtonComponent();
    this._siteMain = document.querySelector(`.main`);
    this._moreButton = this._moreButtonComponent;
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

        this._renderFilmCards(siteFilmsSection, filmCards, prevFilmsCount, showingFilmsCount);

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
    this._renderFilmCards(siteFilmsListSection, films, minFilmsNum, maxFilmsNum);
    if (!title) {
      this._renderShowMoreButton(siteFilmsSection, films);
    }

    const siteFilmsListContainer = siteFilmsListSection.querySelector(`.films-list__container`);
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      const sortedFilms = this._getSortedFilms(films, sortType, 0, films.length);
      siteFilmsListContainer.innerHTML = ``;
      remove(this._moreButton);
      this._renderFilmCards(siteFilmsListSection, sortedFilms, 0, SHOWING_FILMS_COUNT_ON_START);
      this._renderShowMoreButton(siteFilmsSection, sortedFilms);
    });
  }

  _renderFilmCards(section, films, startNum, endNum) {
    const onPosterClick = (film) => {
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

    const siteFilmsListContainer = section.querySelector(`.films-list__container`);

    films.slice(startNum, endNum).forEach((film) => {
      const filmCardComponent = new FilmCardComponent(film);
      render(siteFilmsListContainer, filmCardComponent, RenderPosition.BEFOREEND);

      filmCardComponent.setClickHandler(() => {
        onPosterClick(film);
      });
    });
  }
}

export default PageController;
