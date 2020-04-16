import {createExtraBlockTemplate} from "./components/extra-block.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {createFilmDetailsPopupTemplate} from "./components/film-details-popup.js";
import {createMenuTemplate} from "./components/menu.js";
import {createMoreButtonTemplate} from "./components/more-button.js";
import {createUserRankTemplate} from "./components/user-rank.js";
import {generateFilms} from "./mock/film-info.js";
import {ESC_KEY} from "./const.js";
import {getRandomIntegerNumber} from "./util.js";

const FILM_CARD_COUNT = 12;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const EXTRA_BLOCK_TITLE = [`Top rated`, `Most commented`];

const filmCards = generateFilms(FILM_CARD_COUNT);

const addListenerOnPoster = (startNum, finishNum) => {
  const posters = document.querySelectorAll(`.film-card__poster`);
  const indexMover = finishNum > posters.length ? finishNum - posters.length : 0;

  const onPosterClick = () => {
    const filmDetailsPopup = document.querySelector(`.film-details`);

    const onCloseFilmDetailsPopup = () => {
      filmDetailsPopup.remove();
      filmDetailsPopup.querySelector(`.film-details__close-btn`).removeEventListener(`click`, onCloseFilmDetailsPopup);
      document.removeEventListener(`keydown`, function (evt) {
        if (evt.key === ESC_KEY) {
          onCloseFilmDetailsPopup();
        }
      });
    };

    document.addEventListener(`keydown`, function (evt) {
      if (evt.key === ESC_KEY) {
        onCloseFilmDetailsPopup();
      }
    });
    filmDetailsPopup.querySelector(`.film-details__close-btn`).addEventListener(`click`, onCloseFilmDetailsPopup);
  };

  for (let i = startNum; i <= finishNum; i++) {
    if (posters[i - indexMover]) {
      posters[i - indexMover].addEventListener(`click`, function () {
        render(siteFooter, createFilmDetailsPopupTemplate(filmCards[i]), `afterend`);
        onPosterClick();
      });
    }
  }
};

const showMore = (siteFilmsListSection, siteFilmsListContainer) => {
  let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
  const loadMoreButton = siteFilmsListSection.querySelector(`.films-list__show-more`);
  addListenerOnPoster(0, SHOWING_FILMS_COUNT_ON_START);

  const onShowMoreBtnClick = () => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount = Math.min(showingFilmsCount + SHOWING_FILM_COUNT_BY_BUTTON, FILM_CARD_COUNT);

    filmCards.slice(prevFilmsCount, showingFilmsCount)
      .forEach((film) => render(siteFilmsListContainer, createFilmCardTemplate(film)));

    addListenerOnPoster(prevFilmsCount, showingFilmsCount);
    if (showingFilmsCount >= FILM_CARD_COUNT) {
      loadMoreButton.remove();
    }
  };

  loadMoreButton.addEventListener(`click`, onShowMoreBtnClick);
};

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmCards = (section, films) => {
  const siteFilmsListSection = document.querySelector(`${section}:last-child`);
  const siteFilmsListContainer = siteFilmsListSection.querySelector(`.films-list__container`);

  films.slice(0, SHOWING_FILMS_COUNT_ON_START).forEach((film) => {
    render(siteFilmsListContainer, createFilmCardTemplate(film));
  });

  if (section === `.films-list`) {
    render(siteFilmsListSection, createMoreButtonTemplate());
    showMore(siteFilmsListSection, siteFilmsListContainer);
  }
};

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);

render(siteHeader, createUserRankTemplate());
render(siteMain, createMenuTemplate(filmCards));
renderFilmCards(`.films-list`, filmCards);

const siteFilmsSection = siteMain.querySelector(`.films`);

EXTRA_BLOCK_TITLE.forEach((element) => {
  const extraFilms = filmCards.slice().sort((prev, next) => {
    return element === `Top rated` ? next.rating - prev.rating : next.comments.length - prev.comments.length;
  }).slice(0, 2);

  if ((element === `Top rated` && extraFilms[0].rating !== 0) || (element !== `Top rated` && extraFilms[0].comments !== 0)) {
    render(siteFilmsSection, createExtraBlockTemplate(element));
    renderFilmCards(`.films-list--extra`, extraFilms);
  }

  if (FILM_CARD_COUNT > 1) {
    filmCards.push(...extraFilms);
  }
});

addListenerOnPoster(filmCards.length - 4, filmCards.length);

const siteFooter = document.querySelector(`.footer`);
const siteFooterStatiscticsSection = siteFooter.querySelector(`.footer__statistics`);
render(siteFooterStatiscticsSection, `${new Intl.NumberFormat(`ru`).format(getRandomIntegerNumber(10000, 500000))} movies inside`);
