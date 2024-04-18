const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/travel-in-work/travel-claim-month');
const { findIndexOfGivenMonth } = require('../../../utils/claim-util');
const { TRAVEL_IN_WORK_ROOT_URL } = require('../../../config/uri');
const { removeAllSpaces, removeLeadingZero } = require('../../../utils/remove-all-spaces');

const getIndexOfMonthEnteredByUser = (req) => {
  const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
  const { dateOfTravel } = req.body;

  return findIndexOfGivenMonth(allData, dateOfTravel);
};

module.exports = () => ({
  view: 'pages/travel-in-work/travel-claim-month.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');

      if (req.casa.journeyContext.getDataForPage('taxi-journeys-summary')?.anotherMonth === 'yes') {
        res.locals.casa.journeyPreviousUrl = `${TRAVEL_IN_WORK_ROOT_URL}/taxi-journeys-summary`;
      }

      // Only on this page when adding a new month when on
      // edit mode so add a new month for every visit
      if (req.inEditMode) {
        const keysLength = Object.keys(allData).length;
        if (keysLength === 0) {
          res.locals.monthIndex = 0;
        } else {
          res.locals.monthIndex = parseInt(Object.keys(allData)[keysLength - 1], 10) + 1;
        }
      } else {
        res.locals.monthIndex = req.casa.journeyContext.getDataForPage('travel-claim-month')?.monthIndex ?? '0';
      }
      next();
    },
    preredirect: (req, res, next) => {
      const indexOfAlreadyExistingMonth = getIndexOfMonthEnteredByUser(req);
      if (indexOfAlreadyExistingMonth) {
        const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
        const dataToReloadForChange = allData[indexOfAlreadyExistingMonth];

        req.casa.journeyContext.setDataForPage('travel-claim-month', {
          monthIndex: indexOfAlreadyExistingMonth,
          dateOfSupport: dataToReloadForChange.monthYear,
        });

        JourneyContext.putContext(req.session, req.casa.journeyContext);
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`journey-number?changeMonthYear=${indexOfAlreadyExistingMonth}`);
        });
      } else if (req.inEditMode) {
        // Clear the previous page data for this screen to ensure the journey continues
        req.casa.journeyContext.setDataForPage('travel-claim-days', undefined);

        // Clear the yes that triggered the add another journey, so when you
        // return it does not send them back to the month page
        req.casa.journeyContext.setDataForPage('taxi-journeys-summary', undefined);
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect(`journey-number?edit=&editorigin=${req.editOriginUrl}`);
        });
      } else {
        next();
      }
    },
    pregather: (req, res, next) => {
      req.body.dateOfTravel.mm = removeAllSpaces(req.body.dateOfTravel.mm);
      req.body.dateOfTravel.yyyy = removeAllSpaces(req.body.dateOfTravel.yyyy);
      req.body.dateOfTravel.mm = removeLeadingZero(req.body.dateOfTravel.mm);
      req.body.dateOfTravel.yyyy = removeLeadingZero(req.body.dateOfTravel.yyyy);
      next();
    },
    postvalidate: (req, res, next) => {
      // Submit clicked
      if (!req.inEditMode) {
        req.casa.journeyContext.setDataForPage('taxi-journeys-summary', undefined);
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
