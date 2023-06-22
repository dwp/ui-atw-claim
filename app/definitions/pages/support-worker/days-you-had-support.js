const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/support-worker/days-you-had-support');
const logger = require('../../../logger/logger');
const { claimTypesShortName } = require('../../../config/claim-types');
const { rollUpEnteredDaysForAClaim } = require('../../../utils/claim-util');
const removeAllSpaces = require('../../../utils/remove-all-spaces');

const log = logger('support-worker:days-you-had-support');

module.exports = () => ({
  view: 'pages/support-worker/days-you-had-support.njk',
  fieldValidators,
  reviewBlockView: 'pages/support-worker/review/claim-information.njk',
  fieldGatherModifiers: {
    day: (days) => days.fieldValue.map((day) => ({
      dayOfSupport: day.dayOfSupport.trim(),
      timeOfSupport: {
        hoursOfSupport: day.timeOfSupport.hoursOfSupport.trim(),
        minutesOfSupport: day.timeOfSupport.minutesOfSupport.trim(),
      },
      nameOfSupport: day.nameOfSupport?.trim(),
    })),
  },
  hooks: {
    prerender: (req, res, next) => {
      // Change from summary not CYA
      if (req.query.changeMonthYear) {
        log.debug(`Change ${req.query.changeMonthYear}`);
        const allData = req.casa.journeyContext.getDataForPage('__hidden_support_page__');
        const dataToReloadForChange = allData[req.query.changeMonthYear];

        req.casa.journeyContext.setDataForPage('month-claiming-support-worker-costs', {
          monthIndex: req.query.changeMonthYear,
          dateOfSupport: dataToReloadForChange.monthYear,
        });
        req.casa.journeyContext.setDataForPage('days-you-had-support', {
          day: dataToReloadForChange.claim,
        });
        res.locals.monthYearOfSupport = req.casa.journeyContext.getDataForPage('month-claiming-support-worker-costs').dateOfSupport;
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return next();
        });
      } else {
        res.locals.monthYearOfSupport = req.casa.journeyContext.getDataForPage('month-claiming-support-worker-costs').dateOfSupport;

        const pageData = req.casa.journeyContext.getDataForPage('days-you-had-support');

        if (pageData === undefined) {
          log.debug('Initial population');

          const data = {
            day: [{
              dayOfSupport: '',
              timeOfSupport: {
                hoursOfSupport: '',
                minutesOfSupport: '',
              },
            }],
          };
          req.casa.journeyContext.setDataForPage('days-you-had-support', data);
          JourneyContext.putContext(req.session, req.casa.journeyContext);

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
      Object.keys(req.body.day)
        .forEach((key) => {
          const index = parseInt(key, 10);
          const day = req.body.day[index];

          day.dayOfSupport = removeAllSpaces(day.dayOfSupport);
          day.timeOfSupport.hoursOfSupport = removeAllSpaces(day.timeOfSupport.hoursOfSupport);
          day.timeOfSupport.minutesOfSupport = removeAllSpaces(day.timeOfSupport.minutesOfSupport);
        });
      next();
    },
    prevalidate: (req, res, next) => {
      let editUrl = '';
      if (req.inEditMode) {
        editUrl = `?edit=&editorigin=${req.editOriginUrl}`;
      }

      if (req.body.remove !== undefined) {
        log.debug('Remove button clicked');
        const pageData = req.casa.journeyContext.getDataForPage('days-you-had-support');

        pageData.day.splice(req.body.remove, 1);

        req.casa.journeyContext.setDataForPage('days-you-had-support', pageData);
        const goToItemIndex = req.body.remove !== '0' ? req.body.remove - 1 : 0;
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`days-you-had-support${editUrl}#f-day[${goToItemIndex}][dayOfSupport]`);
        });
      } else if (req.body.add !== undefined) {
        log.debug('Add');
        const pageData = req.casa.journeyContext.getDataForPage('days-you-had-support');
        log.debug(pageData);
        log.debug(pageData.day);
        pageData.day = [...pageData.day, {
          dayOfSupport: '',
          timeOfSupport: {
            hoursOfSupport: '',
            minutesOfSupport: '',
          },
        }];

        req.casa.journeyContext.setDataForPage('days-you-had-support', pageData);
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`days-you-had-support${editUrl}#f-day[${pageData.day.length - 1}][dayOfSupport]`);
        });
      } else {
        log.debug('Submit action');
        next();
      }
    },
    postvalidate: (req, res, next) => {
      // Submit clicked
      const monthYearOfSupport = req.casa.journeyContext.getDataForPage('month-claiming-support-worker-costs');
      const data = rollUpEnteredDaysForAClaim(req, claimTypesShortName.SUPPORT_WORKER);
      const hiddenPage = req.casa.journeyContext.getDataForPage('__hidden_support_page__') ?? Object.create(null);

      hiddenPage[monthYearOfSupport.monthIndex] = {
        monthYear: monthYearOfSupport.dateOfSupport,
        claim: data.day,
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
