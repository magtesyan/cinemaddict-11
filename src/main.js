import {createExtraBlockTemplate} from "./components/extra-block.js";
import {createFilmCardTemplate} from "./components/film-card.js";
import {createFilmDetailsPopupTemplate} from "./components/film-details-popup.js";
import {createMenuTemplate} from "./components/menu.js";
import {createMoreButtonTemplate} from "./components/more-button.js";
import {createUserRankTemplate} from "./components/user-rank.js";

const FILM_CARD_COUNT = 5;
const EXTRA_FILM_CARD_COUNT = 2;
const EXTRA_BLOCK_TITLE = [`Top rated`, `Most commented`];

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const renderFilmCards = (section, count) => {
  const siteFilmsListSection = document.querySelector(`${section}:last-child`);
  const siteFilmsListContainer = siteFilmsListSection.querySelector(`.films-list__container`);

  for (let i = 0; i < count; i++) {
    render(siteFilmsListContainer, createFilmCardTemplate());
  }

  if (section === `.films-list`) {
    render(siteFilmsListSection, createMoreButtonTemplate());
  }
};

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);

render(siteHeader, createUserRankTemplate());
render(siteMain, createMenuTemplate());

renderFilmCards(`.films-list`, FILM_CARD_COUNT);

const siteFilmsSection = siteMain.querySelector(`.films`);

EXTRA_BLOCK_TITLE.forEach((element) => {
  render(siteFilmsSection, createExtraBlockTemplate(element));
  renderFilmCards(`.films-list--extra`, EXTRA_FILM_CARD_COUNT);
});

const siteFooter = document.querySelector(`.footer`);
render(siteFooter, createFilmDetailsPopupTemplate(), `afterend`);
document.querySelector(`.film-details`).classList.add(`visually-hidden`);
