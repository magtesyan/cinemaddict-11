import {createElement} from "../util.js";

const createFilmsTemplate = (films) => {
  const TitleText = {
    NO_MOVIES: `There are no movies in our database`,
    THERE_ARE_MOVIES: `All movies. Upcoming`
  };

  const filmsListTitle = films.length ? TitleText.THERE_ARE_MOVIES : TitleText.NO_MOVIES;
  const filmsListTitleClass = films.length ? `visually-hidden` : ``;
  const filmsListContainerMarkup = films.length ? `<div class="films-list__container"></div>` : ``;

  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title ${filmsListTitleClass}">${filmsListTitle}</h2>
        ${filmsListContainerMarkup}
      </section>
    </section>`
  );
};

class Films {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createFilmsTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Films;
