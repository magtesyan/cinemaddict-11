import {getRandomIntegerNumber, getRandomArrayItem, getRandomDate, makeSet} from "../utils/common.js";
import {generateComments} from "./comment.js";
import {FILMS_PROD_START_YEAR, FILMS_PROD_END_YEAR} from "../const.js";

const nameItems = {
  "made-for-each-other": `made-for-each-other.png`,
  "popeye-meets-sinbad": `popeye-meets-sinbad.png`,
  "sagebrush-trail": `sagebrush-trail.jpg`,
  "santa-claus-conquers-the-martians": `santa-claus-conquers-the-martians.jpg`,
  "the-dance-of-life": `the-dance-of-life.jpg`,
  "the-great-flamarion": `the-great-flamarion.jpg`,
  "the-man-with-the-golden-arm": `the-man-with-the-golden-arm.jpg`
};

const descriptionSource = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const genres = [
  `comedy`,
  `thriller`,
  `action`,
  `drama`,
  `fiction`
];

const directors = [
  `Alfred Hitchcock`,
  `Martin Scorsese`,
  `Woody Allen`,
  `Clint Eastwood`,
  `Quentin Tarantino`
];

const writers = [
  `Billy Wilder`,
  `Ethan Coen`,
  `Joel Coen`,
  `Robert Towne`,
  `Francis Ford Coppola`,
  `William Goldman`,
  `Charlie Kaufman`,
  `Oliver Stone`
];

const actors = [
  `Jack Nicholson`,
  `Jack Nicholson`,
  `Robert De Niro`,
  `Al Pacino`,
  `Daniel Day-Lewis`,
  `Dustin Hoffman`,
  `Tom Hanks`,
  `Anthony Hopkins`,
  `Paul Newman`,
  `Denzel Washington`
];

const countries = [
  `USA`,
  `France`,
  `Spain`,
  `Italy`,
  `Russia`
];

const ageLimits = [
  `0+`,
  `6+`,
  `12+`,
  `18+`
];

const generateFilm = () => {
  const name = getRandomArrayItem(Object.keys(nameItems));

  let description = ``;
  for (let i = 0; i <= getRandomIntegerNumber(1, 5); i++) {
    description += `${descriptionSource.split(`.`)[getRandomIntegerNumber(0, descriptionSource.split(`.`).length - 2)]}.`;
  }

  let writer = makeSet(writers);
  let actor = makeSet(actors);
  let genre = makeSet(genres);

  const date = getRandomDate(FILMS_PROD_START_YEAR, FILMS_PROD_END_YEAR);

  return {
    id: String(new Date() + Math.random()),
    name,
    originalName: name,
    poster: nameItems[name],
    description,
    comments: Math.random() > 0.2 ? generateComments(getRandomIntegerNumber(1, 5)) : [],
    rating: (Math.random(2) * 10).toFixed(1),
    year: date.getFullYear(),
    duration: getRandomIntegerNumber(40, 200),
    genre,
    director: getRandomArrayItem(directors),
    writer: Array.from(writer).join(`, `),
    actor: Array.from(actor).join(`, `),
    date,
    country: getRandomArrayItem(countries),
    ageLimit: getRandomArrayItem(ageLimits),
    addToWatchList: Math.random() > 0.5 ? true : false,
    alreadyWatched: Math.random() > 0.5 ? true : false,
    addToFavorites: Math.random() > 0.5 ? true : false,
    emoji: null,
    watchingDate: getRandomDate(2020, 2020),
  };
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};

export {generateFilms, genres};
