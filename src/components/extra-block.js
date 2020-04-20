import AbstractComponent from "./abstract-component.js";

const createExtraBlockTemplate = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>

      <div class="films-list__container">
      </div>
    </section>`
  );
};

class ExtraBlock extends AbstractComponent {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return createExtraBlockTemplate(this._title);
  }
}

export default ExtraBlock;
