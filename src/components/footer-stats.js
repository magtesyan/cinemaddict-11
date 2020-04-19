import {createElement, getRandomIntegerNumber} from "../util.js";

const createFooterStatsTemplate = (films) => {
  const filmsCount = films.length ? new Intl.NumberFormat(`ru`).format(getRandomIntegerNumber(10000, 500000)) : 0;

  return (
    `${filmsCount} movies inside`
  );
};


class FooterStats {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._films);
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

export default FooterStats;
