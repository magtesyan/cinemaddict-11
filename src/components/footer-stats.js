import AbstractComponent from "./abstract-component.js";
import {getRandomIntegerNumber} from "../util.js";

const createFooterStatsTemplate = (films) => {
  const filmsCount = films.length ? new Intl.NumberFormat(`ru`).format(getRandomIntegerNumber(10000, 500000)) : 0;

  return (
    `${filmsCount} movies inside`
  );
};


class FooterStats extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._films);
  }
}

export default FooterStats;
