class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.text = data[`comment`];
    this.emoji = data[`emotion`] + `.png`;
    this.author = data[`author`];
    this.date = new Date(data[`date`]);
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}

export default Comment;
