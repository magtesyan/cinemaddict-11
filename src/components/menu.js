import AbstractComponent from "./abstract-component.js";
import {FilterType} from "../const.js";

const createFiltersMarkup = (filter, isActive) => {
  const {name, count} = filter;
  const countMarkup = (count !== `` && name !== FilterType.ALL) ? ` <span class="main-navigation__item-count">${count}</span></a>` : ``;

  return (
    `<a href="#${name}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">${name[0].toUpperCase()}${name.slice(1)}${countMarkup}`
  );
};

const createMenuTemplate = (filters) => {
  const filtersMarkup = filters.map((it) => createFiltersMarkup(it, it.checked)).join(`\n`);

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
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {

      const filterElement = evt.target.tagName === `SPAN` ? evt.target.parentNode.textContent : evt.target.textContent;
      const filterName = filterElement.replace(/\s+\d+/g, ``).toLowerCase().trim();
      handler(filterName);
    });
  }
}

export default Menu;
