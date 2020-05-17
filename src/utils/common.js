const SHAKE_ANIMATION_TIMEOUT = 600;

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

const getMaxValueKeyFromObject = (obj) => {
  const maxValue = Math.max(...Object.values(obj));
  const topKeys = Object.keys(obj).filter((it) => obj[it] === maxValue);
  const topKey = topKeys[0];
  return topKey;
};

const shake = (element) => {
  element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

  setTimeout(() => {
    element.style.animation = ``;
  }, SHAKE_ANIMATION_TIMEOUT);
};

const isOnline = () => {
  return window.navigator.onLine;
};

export {getRandomIntegerNumber, getMaxValueKeyFromObject, shake, isOnline};
