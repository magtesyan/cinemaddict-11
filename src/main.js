import API from "./api/index.js";
import FilterController from "./controllers/filter.js";
import FooterStatsComponent from "./components/footer-stats.js";
import MoviesModel from "./models/movies.js";
import PageController from "./controllers/page.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import UserRankComponent from "./components/user-rank.js";
import {SHOWING_FILMS_COUNT_ON_START} from "./const.js";
import {render, RenderPosition} from "./utils/render.js";

const AUTHORIZATION = `Basic eo0w590ik29777b=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaaddicted-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const moviesModel = new MoviesModel();

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const pageController = new PageController(`.films-list`, moviesModel, apiWithProvider);
const filterController = new FilterController(siteMain, moviesModel, pageController);

const siteFooter = document.querySelector(`.footer`);
const siteFooterStatiscticsSection = siteFooter.querySelector(`.footer__statistics`);

render(siteHeader, new UserRankComponent(), RenderPosition.BEFOREEND);

apiWithProvider.getMovies()
  .then((filmCards) => {
    return filmCards;
  })
  .then((filmCards) => {
    let fetches = [];
    filmCards.map((film) => {
      fetches.push(
          apiWithProvider.getComments(film[`id`])
            .then((comments) => {
              film.comments = comments;
            })
            .catch(() => {
              return;
            }));
    });
    Promise.all(fetches).then(() => {
      moviesModel.setMovies(filmCards);
      filterController.render();
      pageController.render(0, SHOWING_FILMS_COUNT_ON_START);
      render(siteFooterStatiscticsSection, new FooterStatsComponent(filmCards), RenderPosition.BEFOREEND);
    });
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
      // Действие, в случае ошибки при регистрации ServiceWorker
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});
window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
