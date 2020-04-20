import {MONTHS, DAYS_IN_MONTH, MONTHS_IN_YEAR, FILMS_PROD_START_YEAR, FILMS_PROD_END_YEAR} from "../const.js";

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

const getRandomDate = () => {
  const targetDate = new Date();
  targetDate.setDate(getRandomIntegerNumber(1, DAYS_IN_MONTH));
  targetDate.setMonth(getRandomIntegerNumber(1, MONTHS_IN_YEAR));
  targetDate.setYear(getRandomIntegerNumber(FILMS_PROD_START_YEAR, FILMS_PROD_END_YEAR));

  return targetDate;
};

const formatDate = (date) => {
  let formattedDate = date.toUTCString().slice(4, 16);
  const month = formattedDate.slice(4, 7);
  return formattedDate.replace(month, MONTHS[month]);
};

const makeSet = (array) => {
  let newSet = new Set();
  for (let i = 0; i <= getRandomIntegerNumber(1, 3); i++) {
    newSet.add(getRandomArrayItem(array));
  }
  return newSet;
};

export {getRandomIntegerNumber, getRandomArrayItem, getRandomDate, formatDate, makeSet};
