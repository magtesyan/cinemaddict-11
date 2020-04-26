import MenuComponent from "./components/menu.js";
import UserRankComponent from "./components/user-rank.js";
import FooterStatsComponent from "./components/footer-stats.js";
import {generateFilms} from "./mock/film-info.js";
import {FILM_CARD_COUNT, SHOWING_FILMS_COUNT_ON_START} from "./const.js";
import {render, RenderPosition} from "./utils/render.js";
import PageController from "./controllers/page.js";

const filmCards = generateFilms(FILM_CARD_COUNT);
const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);

render(siteHeader, new UserRankComponent(), RenderPosition.BEFOREEND);
render(siteMain, new MenuComponent(filmCards), RenderPosition.BEFOREEND);

const pageController = new PageController(`.films-list`);
pageController.render(filmCards, 0, SHOWING_FILMS_COUNT_ON_START);

const siteFooter = document.querySelector(`.footer`);
const siteFooterStatiscticsSection = siteFooter.querySelector(`.footer__statistics`);
render(siteFooterStatiscticsSection, new FooterStatsComponent(filmCards), RenderPosition.BEFOREEND);
