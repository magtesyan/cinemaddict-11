import {getRandomArrayItem} from "../utils/common.js";
import {getRandomDate} from "../utils/common.js";

const texts = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`
];

const authors = [
  `Vadim Makeev`,
  `Alexander Sushko`,
  `Oleg Akinin`,
  `Andrei Fidelman`,
  `Mikael Magtesyan`
];

const emojies = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

const generateComment = () => {
  const date = getRandomDate(2018, 2020);

  return {
    id: String(new Date() + Math.random()),
    text: getRandomArrayItem(texts),
    emoji: getRandomArrayItem(emojies) + `.png`,
    author: getRandomArrayItem(authors),
    date
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComments, emojies};
