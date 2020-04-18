import {generateFilters} from "../mock/filter.js";
import {createElement} from "../util.js";

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

class Menu {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._films);
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

export default Menu;
