import API from "./api.js";
import FilterController from "./controllers/filter.js";
import FooterStatsComponent from "./components/footer-stats.js";
import MoviesModel from "./models/movies.js";
import PageController from "./controllers/page.js";
import UserRankComponent from "./components/user-rank.js";
import {SHOWING_FILMS_COUNT_ON_START} from "./const.js";
import {render, RenderPosition} from "./utils/render.js";

const AUTHORIZATION = `Basic eo0w590ik29777b=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const pageController = new PageController(`.films-list`, moviesModel, api);
const filterController = new FilterController(siteMain, moviesModel, pageController);

const siteFooter = document.querySelector(`.footer`);
const siteFooterStatiscticsSection = siteFooter.querySelector(`.footer__statistics`);

render(siteHeader, new UserRankComponent(), RenderPosition.BEFOREEND);

api.getMovies()
  .then((filmCards) => {
    return filmCards;
  })
  .then((filmCards) => {
    let fetches = [];
    filmCards.map((film) => {
      fetches.push(
          api.getComments(film[`id`])
            .then((comments) => {
              film.comments = comments;
            }));
    });
    Promise.all(fetches).then(() => {
      moviesModel.setMovies(filmCards);
      filterController.render();
      pageController.render(0, SHOWING_FILMS_COUNT_ON_START);
      render(siteFooterStatiscticsSection, new FooterStatsComponent(filmCards), RenderPosition.BEFOREEND);
    });
  });
