import MenuComponent from "./components/menu.js";
import UserRankComponent from "./components/user-rank.js";
import FooterStatsComponent from "./components/footer-stats.js";
import {generateFilms} from "./mock/film-info.js";
import {FILM_CARD_COUNT, SHOWING_FILMS_COUNT_ON_START, EXTRA_FILM_CARD_COUNT} from "./const.js";
import {render, RenderPosition} from "./utils/render.js";
import PageController from "./controllers/page.js";

const EXTRA_BLOCK_TITLE = [`Top rated`, `Most commented`];

const filmCards = generateFilms(FILM_CARD_COUNT);
const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);

render(siteHeader, new UserRankComponent(), RenderPosition.BEFOREEND);
render(siteMain, new MenuComponent(filmCards), RenderPosition.BEFOREEND);

const pageController = new PageController(`.films-list`);
pageController.render(filmCards, 0, SHOWING_FILMS_COUNT_ON_START);

EXTRA_BLOCK_TITLE.forEach((element) => {
  const extraFilms = filmCards.slice().sort((prev, next) => {
    return element === `Top rated` ? next.rating - prev.rating : next.comments.length - prev.comments.length;
  }).slice(0, EXTRA_FILM_CARD_COUNT);

  if (extraFilms.length) {
    if ((element === `Top rated` && extraFilms[0].rating !== 0) || (element !== `Top rated` && extraFilms[0].comments !== 0)) {
      const pageControllerExtra = new PageController(`.films-list--extra:last-child`);
      pageControllerExtra.render(extraFilms, 0, EXTRA_FILM_CARD_COUNT, element);
    }
  }
});

const siteFooter = document.querySelector(`.footer`);
const siteFooterStatiscticsSection = siteFooter.querySelector(`.footer__statistics`);
render(siteFooterStatiscticsSection, new FooterStatsComponent(filmCards), RenderPosition.BEFOREEND);
