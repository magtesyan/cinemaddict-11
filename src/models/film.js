class Film {
  constructor(data) {
    this.id = data[`id`];
    this.name = data[`film_info`][`title`];
    this.originalName = data[`film_info`][`alternative_title`];
    this.poster = data[`film_info`][`poster`];
    this.description = data[`film_info`][`description`];
    this.comments = data[`comments`];
    this.duration = data[`film_info`][`runtime`];
    this.genre = data[`film_info`][`genre`];
    this.director = data[`film_info`][`director`];
    this.writer = data[`film_info`][`writers`].join(`, `);
    this.rating = data[`film_info`][`total_rating`];
    this.actor = data[`film_info`][`actors`].join(`, `);
    this.date = new Date(data[`film_info`][`release`][`date`]);
    this.year = this.date.getFullYear();
    this.country = data[`film_info`][`release`][`release_country`];
    this.ageLimit = data[`film_info`][`age_rating`];
    this.addToWatchList = data[`user_details`][`watchlist`];
    this.alreadyWatched = data[`user_details`][`already_watched`];
    this.addToFavorites = data[`user_details`][`favorite`];
    this.watchingDate = data[`user_details`][`watching_date`];
    this.emoji = null;
  }

  toRAW() {
    let comments = [];
    this.comments.forEach((comment) => comments.push(comment.id));
    return {
      "id": this.id,
      "comments": this.comments[0].text ? comments : this.comments,
      "film_info": {
        "title": this.name,
        "alternative_title": this.originalName,
        "total_rating": this.rating,
        "poster": this.poster,
        "age_rating": this.ageLimit,
        "director": this.director,
        "writers": this.writer.split(`, `),
        "actors": this.actor.split(`, `),
        "release": {
          "date": this.date,
          "release_country": this.country
        },
        "runtime": this.duration,
        "genre": this.genre,
        "description": this.description
      },
      "user_details": {
        "watchlist": this.addToWatchList,
        "already_watched": this.alreadyWatched,
        "watching_date": this.watchingDate,
        "favorite": this.addToFavorites,
      }
    };
  }

  static parseMovie(data) {
    return new Film(data);
  }

  static parseMovies(data) {
    return data.map(Film.parseMovie);
  }

  static clone(data) {
    return new Film(data.toRAW());
  }
}

export default Film;
