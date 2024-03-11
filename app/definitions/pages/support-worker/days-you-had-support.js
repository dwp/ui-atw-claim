const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/support-worker/days-you-had-support');
const logger = require('../../../logger/logger');
const {SUPPORT_WORKER_ROOT_URL} = require("../../../config/uri");

const log = logger('support-worker:days-you-had-support');

function getAllDates(year,  month) {
  let startDate = new Date(year, month -1, 1);
  let endDate = new Date(year, month, 1);

  let dates = [];
  let months = {month: 'long'};
  let day = {day: 'numeric'};
  while (startDate < endDate) {
    const dayOfWeek = startDate.getDay();

    let m = {
      'day': new Date(startDate).toLocaleDateString('en-GB', day).replace(',', ''),
      'weekday' : dayOfWeek,
      'month' : new Date(startDate).toLocaleDateString('en-GB', months).replace(',', '')
    }
    dates.push(m);


    startDate.setDate(startDate.getDate() +1)
  }

  let i = 0
  let weeksList = []
  let currentWeek = { weekNumber: 1, days: [] }

  while (i < dates.length) {
    let currentDay = dates[i]
    currentWeek.days.push(currentDay)
    if (currentDay.weekday == 0) {
      weeksList.push(currentWeek)
      let newWeekNumber = currentWeek.weekNumber + 1
      currentWeek = {weekNumber: newWeekNumber, days: []}
    }
    i++;
  }

  weeksList.push(currentWeek)

  return weeksList ;
}

module.exports = () => ({
  view: 'pages/support-worker/days-you-had-support.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const allData = req.casa.journeyContext.getDataForPage('__hidden_support_page__');

      if (req.casa.journeyContext.getDataForPage('__hidden_support_page__')?.[0] != undefined) {
        res.locals.hideBackButton = true;
        res.locals.casa.journeyPreviousUrl = `${SUPPORT_WORKER_ROOT_URL}/support-claim-summary`;
      }

      // Change from summary not CYA
      if (req.query.changeMonthYear) {
        log.debug(`Change ${req.query.changeMonthYear}`);
        const dataToReloadForChange = allData[req.query.changeMonthYear];
        log.info(dataToReloadForChange.claim);
        req.casa.journeyContext.setDataForPage('support-month', {
          monthIndex: req.query.changeMonthYear,
          dateOfSupport: dataToReloadForChange.monthYear,
        });
        req.casa.journeyContext.setDataForPage('support-days', {
          day: dataToReloadForChange.claim,
        });
        let days = [];
        for (let i=0; i<dataToReloadForChange.claim.length; i++) {
          days.push(dataToReloadForChange.claim[i].dayOfSupport);
        }
        res.locals.days = days;
        res.locals.arrayDates = getAllDates(dataToReloadForChange.monthYear.yyyy, dataToReloadForChange.monthYear.mm)
        res.locals.dateOfSupport = dataToReloadForChange.monthYear;
        res.locals.monthYearOfSupport = req.casa.journeyContext.getDataForPage('support-month').dateOfSupport;
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return next();
        });
      } else {

        //
        const dateOfSupport = req.casa.journeyContext.getDataForPage('support-month').dateOfSupport;
        res.locals.arrayDates = getAllDates(dateOfSupport.yyyy, dateOfSupport.mm)
        res.locals.dateOfSupport = dateOfSupport;

        //

        res.locals.monthYearOfSupport = req.casa.journeyContext.getDataForPage('support-month').dateOfSupport;

        const pageData = req.casa.journeyContext.getDataForPage('support-days');
        if (pageData === undefined) {
          log.debug('Initial population');

          const data = {
            daysOfSupport: [],
          };
          req.casa.journeyContext.setDataForPage('support-days', data);
          JourneyContext.putContext(req.session, req.casa.journeyContext);

          req.session.save((err) => {
            if (err) {
              throw err;
            }
            next();
          });
        } else {
          res.locals.days = pageData.daysOfSupport;
          next();
        }
      }
    },
    preredirect: (req, res, next) => {
      if (req.inEditMode) {
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect(`support-hours?edit=&editorigin=${req.editOriginUrl}`);
        });
      } else {
        next();
      }
    },
    postvalidate: (req, res, next) => {
      // Submit clicked
      const hiddenDays = req.casa.journeyContext.getDataForPage('support-days').daysOfSupport;

      if (hiddenDays.constructor !== 'Array') {
          const convertToArray = {"daysOfSupport" : ([req.casa.journeyContext.getDataForPage('support-days').daysOfSupport].flat()) };
        req.casa.journeyContext.setDataForPage('support-days', convertToArray);
      }

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        return next();
      });
    },
  },
});
