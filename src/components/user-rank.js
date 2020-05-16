import AbstractComponent from "./abstract-component.js";

const createUserRankTemplate = (films) => {
  const UserLevels = {
    0: ``,
    10: `Novice`,
    20: `Fan`,
    21: `Movie Buff`,
  };

  let userLevel = `Movie Buff`;
  const watchedFilmsCount = films.filter((film) => film.alreadyWatched === true).length;

  for (let i = 0; i < Object.keys(UserLevels).length; i++) {
    if (watchedFilmsCount <= parseInt(Object.keys(UserLevels)[i], 10)) {
      userLevel = Object.values(UserLevels)[i];
      break;
    }
  }

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userLevel}</p>
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
