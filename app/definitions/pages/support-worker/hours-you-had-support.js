const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/support-worker/hours-you-had-support');
const logger = require('../../../logger/logger');
const { removeAllSpaces, removeLeadingZero } = require('../../../utils/remove-all-spaces');

const log = logger('support-worker:hours-you-had-support');

module.exports = () => ({
  view: 'pages/support-worker/hours-you-had-support.njk',
  fieldValidators,
  reviewBlockView: 'pages/support-worker/review/claim-information.njk',
  hooks: {
    prerender: (req, res, next) => {
      const allData = req.casa.journeyContext.getDataForPage('__hidden_support_page__');

      const monthYear = req.casa.journeyContext.getDataForPage('support-month');
      const daysOfSupport = req.casa.journeyContext.getDataForPage('support-days').daysOfSupport;
      const daysOfSupportArray = [];

      for (let i = 0; i < daysOfSupport.length; i++) {

        const createDate = new Date (monthYear.dateOfSupport.yyyy, monthYear.dateOfSupport.mm -1, daysOfSupport[i]);
        const dayOfWeek = createDate.getDay();

        const dateDisplay = {
          'day': daysOfSupport[i],
          'weekday' : dayOfWeek,
          'month' : monthYear.dateOfSupport.mm
        }

        daysOfSupportArray.push(dateDisplay);

      };

        res.locals.daysOfSupport = daysOfSupportArray;

      // Change from summary not CYA
      if (req.headers.referer.includes("changeMonthYear", 0)) {
        log.debug(`Change ${req.headers.referer.includes("changeMonthYear", 0)}`);
        log.debug(allData);

        const hourOfSupportReloadForChange = allData[monthYear.monthIndex];
        
        req.casa.journeyContext.setDataForPage('support-hours', {
          hoursOfSupport: hourOfSupportReloadForChange.claim,
        });
        let hours = [];
        for (let i=0; i<hourOfSupportReloadForChange.claim.length; i++) {
          hours.push(hourOfSupportReloadForChange.claim[i]);
        }
        res.locals.hours = hours;
        res.locals.monthYearOfSupport = req.casa.journeyContext.getDataForPage('support-month').dateOfSupport;
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return next();
        });
      } else {
        res.locals.monthYearOfSupport = req.casa.journeyContext.getDataForPage('support-month').dateOfSupport;

        req.casa.journeyContext.setDataForPage('support-hours', undefined);
        const pageData = req.casa.journeyContext.getDataForPage('support-hours');

        if (pageData === undefined) {
          log.debug('Initial population');

          req.session.save((err) => {
            if (err) {
              throw err;
            }
            next();
          });
        } else {
          next();
        }
      }
    },
    pregather: (req, res, next) => {
      Object.keys(req.body.hours)
          .forEach((key) => {
            const index = parseInt(key, 10);
            const time = req.body.hours[index];

            time.timeOfSupport.hoursOfSupport = removeAllSpaces(time.timeOfSupport.hoursOfSupport);
            time.timeOfSupport.minutesOfSupport = removeAllSpaces(time.timeOfSupport.minutesOfSupport);
            time.timeOfSupport.hoursOfSupport = removeLeadingZero(time.timeOfSupport.hoursOfSupport);
            time.timeOfSupport.minutesOfSupport = removeLeadingZero(time.timeOfSupport.minutesOfSupport);
          });
      next();
    },
    preredirect: (req, res, next) => {
      if (req.inEditMode) {
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect(`support-claim-summary?edit=&editorigin=${req.editOriginUrl}`);
        });
      } else {
        next();
      }

    },
    postvalidate: (req, res, next) => {
      // Submit clicked
      for (let i = 0; i < req.body.hours.length; i++) {
        const minuteSupportCheck = req.body.hours[i].timeOfSupport.minutesOfSupport;
        const hourSupportCheck = req.body.hours[i].timeOfSupport.hoursOfSupport;
        if (minuteSupportCheck === '') {
          req.body.hours[i].timeOfSupport.minutesOfSupport = '0';
        };
        if (hourSupportCheck === '') {
          req.body.hours[i].timeOfSupport.hoursOfSupport = '0';
        }
      };

      req.casa.journeyContext.setDataForPage('support-hours', req.body);
      const monthYearOfSupport = req.casa.journeyContext.getDataForPage('support-month') ?? Object.create(null);
      const hiddenDays = req.casa.journeyContext.getDataForPage('support-days') ?? Object.create(null);
      const timeOfSupport = req.casa.journeyContext.getDataForPage('support-hours').hours;
      const hiddenPage = req.casa.journeyContext.getDataForPage('__hidden_support_page__') ?? Object.create(null);

      Object.keys(timeOfSupport)
          .forEach((key) => {
            const index = parseInt(key, 10);
            const time = timeOfSupport[index];

            time['dayOfSupport'] = hiddenDays.daysOfSupport[index];

          });

      hiddenPage[monthYearOfSupport.monthIndex] = {
        monthYear: monthYearOfSupport.dateOfSupport,
        claim: timeOfSupport,
      };
      req.casa.journeyContext.setDataForPage('__hidden_support_page__', hiddenPage);

      if (!req.inEditMode) {
        req.casa.journeyContext.setDataForPage('support-claim-summary', undefined);
      }
      JourneyContext.putContext(req.session, req.casa.journeyContext);

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        return next();
      });
    },
  },
});
