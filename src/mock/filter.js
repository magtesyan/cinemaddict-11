const generateFilters = (films) => {
  const filterNames = {
    "all movies": ``,
    "watchlist": films.reduce((acc, cur) => acc + cur.addToWatchList, 0),
    "history": films.reduce((acc, cur) => acc + cur.alreadyWatched, 0),
    "favorites": films.reduce((acc, cur) => acc + cur.addToFavorites, 0)
  };

  return Object.keys(filterNames).map((it) => {
    return {
      name: it,
      count: filterNames[it],
    };
  });
};


export {generateFilters};
