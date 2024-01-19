const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/travel-to-work/days-you-travelled-for-work');
const logger = require('../../../logger/logger');
const { claimTypesShortName } = require('../../../config/claim-types');
const { rollUpEnteredDaysForAClaim } = require('../../../utils/claim-util');
const { removeAllSpaces } = require('../../../utils/remove-all-spaces');

const log = logger('travel-to-work:days-you-travelled-for-work');

module.exports = () => ({
  view: 'pages/travel-to-work/days-you-travelled-for-work.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      // Returns undefined for taxi route. If lift return miles or journey
      // as this only defined on that journey
      res.locals.journeysOrMileage = req.casa.journeyContext
        .getDataForPage('journeys-miles')?.journeysOrMileage;

      // Change from summary not CYA
      if (req.query.changeMonthYear) {
        log.debug(`Change ${req.query.changeMonthYear}`);
        const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
        const dataToReloadForChange = allData[req.query.changeMonthYear];

        req.casa.journeyContext.setDataForPage('travel-month', {
          monthIndex: req.query.changeMonthYear,
          dateOfTravel: dataToReloadForChange.monthYear,
        });
        req.casa.journeyContext.setDataForPage('travel-days', {
          day: dataToReloadForChange.claim,
        });
        res.locals.monthYearOfTravel = req.casa.journeyContext.getDataForPage('travel-month').dateOfTravel;
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return next();
        });
      } else {
        res.locals.monthYearOfTravel = req.casa.journeyContext.getDataForPage('travel-month').dateOfTravel;

        const pageData = req.casa.journeyContext.getDataForPage('travel-days');

        if (pageData === undefined) {
          log.debug('Initial population');

          const data = {
            day: [{
              dayOfTravel: '',
              totalTravel: '',
            }],
          };

          req.casa.journeyContext.setDataForPage('travel-days', data);
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
          const item = req.body.day[index];
          item.dayOfTravel = removeAllSpaces((item.dayOfTravel));
          item.totalTravel = removeAllSpaces((item.totalTravel));
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
        const pageData = req.casa.journeyContext.getDataForPage('travel-days');

        pageData.day.splice(req.body.remove, 1);

        req.casa.journeyContext.setDataForPage('travel-days', pageData);
        const goToItemIndex = req.body.remove !== '0' ? req.body.remove - 1 : 0;
        JourneyContext.putContext(req.session, req.casa.journeyContext);
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`travel-days${editUrl}#f-day[${goToItemIndex}][dayOfTravel]`);
        });
      } else if (req.body.add !== undefined) {
        log.debug('Add');
        const pageData = req.casa.journeyContext.getDataForPage('travel-days');
        log.debug(pageData);
        log.debug(pageData.day);
        pageData.day = [...pageData.day, {
          dayOfTravel: '',
          totalTravel: '',
        }];

        req.casa.journeyContext.setDataForPage('travel-days', pageData);
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`travel-days${editUrl}#f-day[${pageData.day.length - 1}][dayOfTravel]`);
        });
      } else {
        log.debug('Submit action');
        next();
      }
    },
    postvalidate: (req, res, next) => {
      // Submit clicked
      const monthYearOfTravel = req.casa.journeyContext.getDataForPage('travel-month');
      const data = rollUpEnteredDaysForAClaim(req, claimTypesShortName.TRAVEL_TO_WORK);
      const hiddenPage = req.casa.journeyContext.getDataForPage('__hidden_travel_page__') ?? Object.create(null);

      hiddenPage[monthYearOfTravel.monthIndex] = {
        monthYear: monthYearOfTravel.dateOfTravel,
        claim: data.day,
      };

      req.casa.journeyContext.setDataForPage('__hidden_travel_page__', hiddenPage);

      if (!req.inEditMode) {
        req.casa.journeyContext.setDataForPage('journey-summary', undefined);
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
