import AbstractComponent from "./abstract-component.js";

const SortType = {
  RATING: `rating`,
  DATE: `date`,
  DEFAULT: `default`,
};

const createSortTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by ${SortType.DEFAULT}</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by ${SortType.DATE}</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by ${SortType.RATING}</a></li>
    </ul>`
  );
};

class Sort extends AbstractComponent {
  constructor() {
    super();
    this._currenSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;
      this.changeActiveFilter(this._currenSortType);

      handler(this._currenSortType);
    });
  }

  changeActiveFilter(sortType) {
    this._currenSortType = sortType;
    this._element.querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);
    this._element.querySelector(`[data-sort-type=${this._currenSortType}]`).classList.add(`sort__button--active`);
  }
}

export default Sort;
export {SortType};
