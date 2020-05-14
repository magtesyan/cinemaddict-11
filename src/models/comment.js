class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.text = data[`comment`];
    this.emoji = data[`emotion`] + `.png`;
    this.author = data[`author`];
    this.date = new Date(data[`date`]);
  }

  toRAW() {
    this.emoji = this.emoji.split(`.`)[0];
    return {
      "comment": this.text,
      "date": this.date,
      "emotion": this.emoji
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  static clone(data) {
    return new Comment(data.toRAW());
  }
}

export default Comment;
