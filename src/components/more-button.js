import AbstractComponent from "./abstract-component.js";

const createMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

class MoreButton extends AbstractComponent {
  getTemplate() {
    return createMoreButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}

export default MoreButton;
