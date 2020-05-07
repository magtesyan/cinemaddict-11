import AbstractSmartComponent from "./abstract-smart-component.js";
import moment from "moment";

const createCommentMarkup = (comment) => {
  const {emoji, text, author, date} = comment;
  const commentPastDate = moment(date).fromNow();

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}" width="55" height="55" alt="emoji-${emoji.split(`.`).shift()}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentPastDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

class Comment extends AbstractSmartComponent {
  constructor(comment) {
    super();
    this._comment = comment;
  }

  getTemplate() {
    return createCommentMarkup(this._comment);
  }

  recoveryListeners() {
    return;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, handler);
  }
}

export default Comment;
