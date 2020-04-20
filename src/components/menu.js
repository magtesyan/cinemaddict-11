import {generateFilters} from "../mock/filter.js";
import AbstractComponent from "./abstract-component.js";

const createFiltersMarkup = (filter, isActive) => {
  const {name, count} = filter;
  const countMarkup = count !== `` ? ` <span class="main-navigation__item-count">${count}</span></a>` : ``;
  return (
    `<a href="#${name}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">${name[0].toUpperCase()}${name.slice(1)}${countMarkup}`
  );
};

const createMenuTemplate = (films) => {

  const filters = generateFilters(films);
  const filtersMarkup = filters.map((it, i) => createFiltersMarkup(it, i === 0)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

class Menu extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createMenuTemplate(this._films);
  }
}

export default Menu;
