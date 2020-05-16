import AbstractComponent from "./abstract-component.js";
import {userLevel} from "../utils/filter.js";

const createUserRankTemplate = (films) => {
  const userRank = userLevel(films);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

class UserRank extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createUserRankTemplate(this._films);
  }
}

export default UserRank;
