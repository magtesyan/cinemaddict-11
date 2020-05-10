import FilterController from "./controllers/filter.js";
import UserRankComponent from "./components/user-rank.js";
import FooterStatsComponent from "./components/footer-stats.js";
import MoviesModel from "./models/movies.js";
import {generateFilms} from "./mock/film-info.js";
import {FILM_CARD_COUNT, SHOWING_FILMS_COUNT_ON_START} from "./const.js";
import {render, RenderPosition} from "./utils/render.js";
import PageController from "./controllers/page.js";

const filmCards = generateFilms(FILM_CARD_COUNT);
const moviesModel = new MoviesModel();
moviesModel.setMovies(filmCards);
const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);

render(siteHeader, new UserRankComponent(), RenderPosition.BEFOREEND);
const pageController = new PageController(`.films-list`, moviesModel);
const filterController = new FilterController(siteMain, moviesModel, pageController);
filterController.render();

pageController.render(0, SHOWING_FILMS_COUNT_ON_START);

const siteFooter = document.querySelector(`.footer`);
const siteFooterStatiscticsSection = siteFooter.querySelector(`.footer__statistics`);
render(siteFooterStatiscticsSection, new FooterStatsComponent(filmCards), RenderPosition.BEFOREEND);
