import ExtraBlockComponent from "./components/extra-block.js";
import FilmCardComponent from "./components/film-card.js";
import FilmDetailsPopupComponent from "./components/film-details-popup.js";
import MenuComponent from "./components/menu.js";
import SortComponent from "./components/sort.js";
import FilmsComponent from "./components/films.js";
import MoreButtonComponent from "./components/more-button.js";
import UserRankComponent from "./components/user-rank.js";
import {generateFilms} from "./mock/film-info.js";
import {ESC_KEY} from "./const.js";
import {getRandomIntegerNumber, render, RenderPosition} from "./util.js";

const FILM_CARD_COUNT = 12;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const EXTRA_BLOCK_TITLE = [`Top rated`, `Most commented`];

const renderFilmCards = (section, films, startNum, endNum) => {
  const onPosterClick = (film) => {
    const onCloseFilmDetailsPopup = () => {
      siteMain.removeChild(filmDetailsPopupComponent.getElement());

      filmDetailsCloseBtn.removeEventListener(`click`, onCloseFilmDetailsPopup);
      document.removeEventListener(`keydown`, function (evt) {
        if (evt.key === ESC_KEY) {
          onCloseFilmDetailsPopup();
        }
      });
    };

    const filmDetailsPopupComponent = new FilmDetailsPopupComponent(film);
    siteMain.appendChild(filmDetailsPopupComponent.getElement());

    const filmDetailsCloseBtn = filmDetailsPopupComponent.getElement().querySelector(`.film-details__close-btn`);
    filmDetailsCloseBtn.addEventListener(`click`, onCloseFilmDetailsPopup);

    document.addEventListener(`keydown`, function (evt) {
      if (evt.key === ESC_KEY) {
        onCloseFilmDetailsPopup();
      }
    });
  };

  const siteFilmsListSection = document.querySelector(`${section}:last-child`);
  const siteFilmsListContainer = siteFilmsListSection.querySelector(`.films-list__container`);

  films.slice(startNum, endNum).forEach((film) => {
    const filmCardComponent = new FilmCardComponent(film);
    render(siteFilmsListContainer, filmCardComponent.getElement(), RenderPosition.BEFOREEND);

    const poster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
    poster.addEventListener(`click`, function () {
      onPosterClick(film);
    });
  });
};

const filmCards = generateFilms(FILM_CARD_COUNT);
const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);

render(siteHeader, new UserRankComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMain, new MenuComponent(filmCards).getElement(), RenderPosition.BEFOREEND);
render(siteMain, new SortComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMain, new FilmsComponent().getElement(), RenderPosition.BEFOREEND);
renderFilmCards(`.films`, filmCards, 0, SHOWING_FILMS_COUNT_ON_START);

const siteFilmsSection = siteMain.querySelector(`.films`);

const moreButton = new MoreButtonComponent();
render(siteFilmsSection.querySelector(`.films-list`), moreButton.getElement(), RenderPosition.BEFOREEND);
let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

moreButton.getElement().addEventListener(`click`, () => {
  const prevFilmsCount = showingFilmsCount;
  showingFilmsCount = prevFilmsCount + SHOWING_FILM_COUNT_BY_BUTTON;

  renderFilmCards(`.films`, filmCards, prevFilmsCount, showingFilmsCount);

  if (showingFilmsCount >= FILM_CARD_COUNT) {
    moreButton.getElement().remove();
    moreButton.removeElement();
  }
});

EXTRA_BLOCK_TITLE.forEach((element) => {
  const extraFilms = filmCards.slice().sort((prev, next) => {
    return element === `Top rated` ? next.rating - prev.rating : next.comments.length - prev.comments.length;
  }).slice(0, 2);

  if ((element === `Top rated` && extraFilms[0].rating !== 0) || (element !== `Top rated` && extraFilms[0].comments !== 0)) {
    render(siteFilmsSection, new ExtraBlockComponent(element).getElement(), RenderPosition.BEFOREEND);
    renderFilmCards(`.films-list--extra`, extraFilms);
  }

  // if (FILM_CARD_COUNT > 1) {
  //   filmCards.push(...extraFilms);
  // }
});

const siteFooter = document.querySelector(`.footer`);
const siteFooterStatiscticsSection = siteFooter.querySelector(`.footer__statistics`);
render(siteFooterStatiscticsSection, `${new Intl.NumberFormat(`ru`).format(getRandomIntegerNumber(10000, 500000))} movies inside`);
