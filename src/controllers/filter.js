import {render, RenderPosition, replace} from "../utils/render.js";
import {getFilmsByFilter} from "../utils/filter.js";
import MenuComponent from "../components/menu.js";
import {FilterType} from "../const.js";

class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._activeFilterType = FilterType.ALL;
    this._menuComponent = null;
    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allFilms = this._moviesModel.getMoviesAll();

    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmsByFilter(allFilms, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._menuComponent;
    this._menuComponent = new MenuComponent(filters);
    this._menuComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._menuComponent, oldComponent);
    } else {
      render(container, this._menuComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

  _onDataChange() {
    this.render();
  }
}

export default FilterController;
