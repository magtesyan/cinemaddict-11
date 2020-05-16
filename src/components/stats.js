import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {formatFilmDuration} from "../utils/render.js";
import {getMaxValueKeyFromObject} from "../utils/common.js";
import {getUserLevel} from "../utils/filter.js";

const createUserRankBlock = (films) => {
  const userRank = getUserLevel(films);

  return userRank !== `` ? (
    `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>`
  ) : ``;
};

const createPeriodsMarkup = (period, isActive) => {
  const periodInTags = period.toLowerCase().replace(` `, `-`);
  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${periodInTags}" value="${periodInTags}" ${isActive ? `checked` : ``}>
    <label for="statistic-${periodInTags}" class="statistic__filters-label">${period}</label>`
  );
};

const createStatisticsTemplate = (films, topGenre, Periods) => {
  const periodsMarkup = Object.keys(Periods).map((it) => createPeriodsMarkup(it, Periods[it])).join(`\n`);
  const filmsCount = films ? films.length : 0;

  const totalDuration = films ? formatFilmDuration(films.reduce((a, b) => {
    return a + b.duration;
  }, 0)) : 0;

  const userRankBlock = createUserRankBlock(films);

  return (
    `<section class="statistic">
    <p class="statistic__rank">
      ${userRankBlock}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
      ${periodsMarkup}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${filmsCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDuration}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

const renderCharts = (statisticCtx, sortedGenres) => {

  const sortedKeys = Object.keys(sortedGenres).sort((a, b) => sortedGenres[b] - sortedGenres[a]);
  const sortedValues = Object.values(sortedGenres).sort((a, b) => b - a);
  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * 5;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: sortedKeys,
      datasets: [{
        data: sortedValues,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

class Statistics extends AbstractSmartComponent {
  constructor(films, periods) {
    super();
    this._films = films;
    this.sortedGenres = null;
    this.topGenre = null;
    this._Periods = periods;

    this._renderCharts(this._films);
  }

  getTemplate() {
    return createStatisticsTemplate(this._films, this.topGenre, this._Periods);
  }

  _renderCharts(films) {
    this.sortedGenres = this._shareGenresByQuantity(films);
    this.topGenre = getMaxValueKeyFromObject(this.sortedGenres) ? getMaxValueKeyFromObject(this.sortedGenres) : ``;
    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);
    renderCharts(statisticCtx, this.sortedGenres);
  }

  _shareGenresByQuantity(films) {
    let sortedGenres = {};
    if (films) {
      films.forEach((film) => {
        film.genre.forEach((genre) => {
          sortedGenres[genre] = sortedGenres[genre] ? sortedGenres[genre] + 1 : 1;
        });
      });
    }
    return sortedGenres;
  }

  setPeriodChangeHandler(handler) {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, handler);
  }
}

export default Statistics;
