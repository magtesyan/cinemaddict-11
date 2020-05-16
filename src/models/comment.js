class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.text = data[`comment`];
    this.emoji = `${data[`emotion`]}.png`;
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

  static parse(data) {
    return new Comment(data);
  }

  static parseReviews(data) {
    return data.map(Comment.parse);
  }

  static clone(data) {
    return new Comment(data.toRAW());
  }
}

export default Comment;
