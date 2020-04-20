import FilmCardComponent from "../components/film-card.js";
import FilmDetailsPopupComponent from "../components/film-details-popup.js";
import {render, RenderPosition, appendChild, removeChild} from "../utils/render.js";
import {ESC_KEY} from "../const.js";

class PageController {
  constructor(container) {
    this._container = container;
  }

  render(films, minFilmsNum, maxFilmsNum) {
    this._renderFilmCards(this._container, films, minFilmsNum, maxFilmsNum);
  }

  _renderFilmCards(section, films, startNum, endNum) {
    const siteMain = document.querySelector(`.main`);

    const onPosterClick = (film) => {
      const onCloseFilmDetailsPopup = () => {
        removeChild(siteMain, filmDetailsPopupComponent);

        filmDetailsPopupComponent.removeClickHandler(onCloseFilmDetailsPopup);
        document.removeEventListener(`keydown`, function (evt) {
          if (evt.key === ESC_KEY) {
            onCloseFilmDetailsPopup();
          }
        });
      };

      const filmDetailsPopupComponent = new FilmDetailsPopupComponent(film);
      appendChild(siteMain, filmDetailsPopupComponent);

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
