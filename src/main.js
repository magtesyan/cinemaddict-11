import ExtraBlockComponent from "./components/extra-block.js";
import MenuComponent from "./components/menu.js";
import SortComponent from "./components/sort.js";
import FilmsComponent from "./components/films.js";
import MoreButtonComponent from "./components/more-button.js";
import UserRankComponent from "./components/user-rank.js";
import FooterStatsComponent from "./components/footer-stats.js";
import {generateFilms} from "./mock/film-info.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import PageController from "./controllers/page.js";

const FILM_CARD_COUNT = 8;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILM_COUNT_BY_BUTTON = 5;
const EXTRA_BLOCK_TITLE = [`Top rated`, `Most commented`];

const filmCards = generateFilms(FILM_CARD_COUNT);
const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);

render(siteHeader, new UserRankComponent(), RenderPosition.BEFOREEND);
render(siteMain, new MenuComponent(filmCards), RenderPosition.BEFOREEND);
render(siteMain, new SortComponent(), RenderPosition.BEFOREEND);
render(siteMain, new FilmsComponent(filmCards), RenderPosition.BEFOREEND);

const siteFilmsSection = siteMain.querySelector(`.films`);
const pageController = new PageController(siteFilmsSection);
pageController.render(filmCards, 0, SHOWING_FILMS_COUNT_ON_START);

if (filmCards.length !== 0) {
  const moreButton = new MoreButtonComponent();
  render(siteFilmsSection.querySelector(`.films-list`), moreButton, RenderPosition.BEFOREEND);
  let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

  moreButton.setClickHandler(() => {
    const prevFilmsCount = showingFilmsCount;
    showingFilmsCount = prevFilmsCount + SHOWING_FILM_COUNT_BY_BUTTON;

    pageController.render(filmCards, prevFilmsCount, showingFilmsCount);

    if (showingFilmsCount >= FILM_CARD_COUNT) {
      remove(moreButton);
    }
  });
}

EXTRA_BLOCK_TITLE.forEach((element) => {
  const extraFilms = filmCards.slice().sort((prev, next) => {
    return element === `Top rated` ? next.rating - prev.rating : next.comments.length - prev.comments.length;
  }).slice(0, 2);

  if (extraFilms.length) {
    if ((element === `Top rated` && extraFilms[0].rating !== 0) || (element !== `Top rated` && extraFilms[0].comments !== 0)) {
      render(siteFilmsSection, new ExtraBlockComponent(element), RenderPosition.BEFOREEND);
      const pageControllerExtra = new PageController(siteFilmsSection.querySelector(`.films-list--extra:last-child`));
      pageControllerExtra.render(extraFilms);
    }
  }
});

const siteFooter = document.querySelector(`.footer`);
const siteFooterStatiscticsSection = siteFooter.querySelector(`.footer__statistics`);
render(siteFooterStatiscticsSection, new FooterStatsComponent(filmCards), RenderPosition.BEFOREEND);
