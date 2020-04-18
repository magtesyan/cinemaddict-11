import {createElement} from "../util.js";

const createMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

class MoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMoreButtonTemplate();
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

export default MoreButton;
