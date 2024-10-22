const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require(
  '../../field-validators/travel-to-work/month-claiming-travel-for-work',
);
const { findIndexOfGivenMonth } = require('../../../utils/claim-util');
const { TRAVEL_TO_WORK_ROOT_URL } = require('../../../config/uri');
const { removeAllSpaces, removeLeadingZero } = require('../../../utils/remove-all-spaces');

const getIndexOfMonthEnteredByUser = (req) => {
  const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
  const { dateOfTravel } = req.body;

  return findIndexOfGivenMonth(allData, dateOfTravel);
};

module.exports = () => ({
  view: 'pages/travel-to-work/month-claiming-travel-for-work.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.howDidYouTravelForWork = req.casa.journeyContext.getDataForPage(
        'which-journey-type',
      ).howDidYouTravelForWork;

      if (req.casa.journeyContext.getDataForPage('journey-summary')?.anotherMonth === 'yes') {
        res.locals.casa.journeyPreviousUrl = `${TRAVEL_TO_WORK_ROOT_URL}/journey-summary`;
      }

      const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__')
        ?? Object.create(null);

      if (req.query.changeMonthYear) {
        const dataToReloadForChange = allData[req.query.changeMonthYear];

        req.casa.journeyContext.setDataForPage('travel-month', {
          monthIndex: req.query.changeMonthYear,
          dateOfTravel: dataToReloadForChange.monthYear,
        });
        req.casa.journeyContext.setDataForPage('travel-days', {
          day: dataToReloadForChange.claim,
        });
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
        });
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
        res.locals.monthIndex = req.casa.journeyContext.getDataForPage(
          'travel-month',
        )?.monthIndex ?? '0';
      }
      next();
    },
    pregather: (req, res, next) => {
      req.body.dateOfTravel.mm = removeAllSpaces(req.body.dateOfTravel.mm);
      req.body.dateOfTravel.yyyy = removeAllSpaces(req.body.dateOfTravel.yyyy);
      req.body.dateOfTravel.mm = removeLeadingZero(req.body.dateOfTravel.mm);
      req.body.dateOfTravel.yyyy = removeLeadingZero(req.body.dateOfTravel.yyyy);
      next();
    },
    // eslint-disable-next-line consistent-return
    preredirect: (req, res, next) => {
      const indexOfAlreadyExistingMonth = getIndexOfMonthEnteredByUser(req);
      if (indexOfAlreadyExistingMonth) {
        res.redirect(`travel-days?changeMonthYear=${indexOfAlreadyExistingMonth}`);
      } else if (req.inEditMode) {
        // Clear the previous page data for this screen to ensure the journey continues
        req.casa.journeyContext.setDataForPage('travel-days', undefined);

        // Clear the yes that triggered the add another journey, so when you
        // return it does not send them back to the month page
        req.casa.journeyContext.setDataForPage('journey-summary', undefined);
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect(`travel-days?edit=&editorigin=${req.editOriginUrl}`);
        });
      } else {
        next();
      }
    },
  },
});
