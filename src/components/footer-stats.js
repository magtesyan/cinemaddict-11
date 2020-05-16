import AbstractComponent from "./abstract-component.js";

const createFooterStatsTemplate = (films) => {
  const filmsCount = films.length ? films.length : 0;

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
