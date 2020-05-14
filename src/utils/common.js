import {MONTHS, DAYS_IN_MONTH, MONTHS_IN_YEAR} from "../const.js";

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

const getRandomDate = (startYear, endYear) => {
  const targetDate = new Date();
  targetDate.setDate(getRandomIntegerNumber(1, DAYS_IN_MONTH));
  targetDate.setMonth(getRandomIntegerNumber(1, MONTHS_IN_YEAR));
  targetDate.setYear(getRandomIntegerNumber(startYear, endYear));

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

const getMaxValueKeyFromObject = (obj) => {
  const maxValue = Math.max(...Object.values(obj));
  const topKeys = Object.keys(obj).filter((it) => obj[it] === maxValue);
  const topKey = topKeys[0];
  return topKey;
};

const shake = (element) => {
  const SHAKE_ANIMATION_TIMEOUT = 600;

  element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

  setTimeout(() => {
    element.style.animation = ``;
  }, SHAKE_ANIMATION_TIMEOUT);
};

export {getRandomIntegerNumber, getRandomArrayItem, getRandomDate, formatDate, makeSet, getMaxValueKeyFromObject, shake};
