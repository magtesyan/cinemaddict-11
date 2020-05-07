import AbstractSmartComponent from "./abstract-smart-component.js";
import CommentController from "../controllers/comment.js";
import {emojies} from "../mock/comment.js";
import {Keys} from "../const.js";
import {encode} from "he";

const createEmojiesListMarkup = (selectedEmoji) => {
  let markup = ``;

  emojies.forEach((emoji) => {
    const checked = selectedEmoji === emoji ? `checked` : ``;
    markup += `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${checked}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
    </label>`;
  });

  return markup;
};

const createCommentsTemplate = (comments, emoji, userComment) => {
  const commentsLength = comments ? comments.length : 0;
  const emojiMarkup = createEmojiesListMarkup(emoji);
  const emojiLabelMarkup = emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ``;

  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsLength}</span></h3>

      <ul class="film-details__comments-list">
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label">${emojiLabelMarkup}</div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" value=${userComment}>${userComment}</textarea>
        </label>

        <div class="film-details__emoji-list">
          ${emojiMarkup}
        </div>
      </div>
    </section>`
  );
};

class CommentsBoard extends AbstractSmartComponent {
  constructor(commentsModel, emoji) {
    super();
    this._comments = commentsModel.getComments();
    this._emoji = emoji;
    this._userComment = ``;
    this._commentsModel = commentsModel;
  }

  getTemplate() {
    return createCommentsTemplate(this._comments, this._emoji, this._userComment);
  }

  recoveryListeners() {
    this.addNewCommentHandler();
  }

  renderAllComments() {
    const commentItem = this.getElement().querySelector(`.film-details__comments-list`);
    this._comments = this._commentsModel.getComments();

    this._comments.forEach((comment) => {
      const commentController = new CommentController(commentItem, this._commentsModel, this);
      commentController.render(comment);
    });
  }

  rerender() {
    this._comments = this._commentsModel.getComments();
    super.rerender();
    this.renderAllComments();
  }

  addNewCommentHandler() {
    const element = this.getElement();
    const emoji = element.querySelector(`.film-details__emoji-list`);
    const commentArea = element.querySelector(`.film-details__comment-input`);

    if (emoji) {
      emoji.addEventListener(`change`, (evt) => {
        this._emoji = evt.target.value;
        this.rerender();
      });
    }

    commentArea.addEventListener(`input`, () => {
      this._userComment = encode(commentArea.value);
    });

    element.addEventListener(`keydown`, (evt) => {
      if (evt.key === Keys.ENTER_KEY && (evt.ctrlKey)) {
        if (this._emoji && this._userComment) {
          const newComment = {
            id: String(new Date() + Math.random()),
            text: this._userComment,
            emoji: this._emoji + `.png`,
            author: `random`,
            date: new Date(),
          };

          this._commentsModel.onAddComment(newComment);
          this.rerender();
        }
      }
    });
  }
}

export default CommentsBoard;
