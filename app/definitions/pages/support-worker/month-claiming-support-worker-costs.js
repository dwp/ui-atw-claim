const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/support-worker/month-claiming-support-worker-costs');
const { findIndexOfGivenMonth } = require('../../../utils/claim-util');
const { SUPPORT_WORKER_ROOT_URL } = require('../../../config/uri');
const removeAllSpaces = require('../../../utils/remove-all-spaces');

const getIndexOfMonthEnteredByUser = (req) => {
  const allData = req.casa.journeyContext.getDataForPage('__hidden_support_page__');
  const { dateOfSupport } = req.body;

  return findIndexOfGivenMonth(allData, dateOfSupport);
};

module.exports = () => ({
  view: 'pages/support-worker/month-claiming-support-worker-costs.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const allData = req.casa.journeyContext.getDataForPage('__hidden_support_page__');

      if (req.casa.journeyContext.getDataForPage('support-claim-summary')?.anotherMonth === 'yes') {
        res.locals.casa.journeyPreviousUrl = `${SUPPORT_WORKER_ROOT_URL}/support-claim-summary`;
      }

      if (req.query.changeMonthYear) {
        const dataToReloadForChange = allData[req.query.changeMonthYear];

        req.casa.journeyContext.setDataForPage('month-claiming-support-worker-costs', {
          monthIndex: req.query.changeMonthYear,
          dateOfSupport: dataToReloadForChange.monthYear,
        });
        req.casa.journeyContext.setDataForPage('days-you-had-support', {
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
        res.locals.monthIndex = req.casa.journeyContext.getDataForPage('month-claiming-support-worker-costs')?.monthIndex ?? '0';
      }
      next();
    },
    preredirect: (req, res, next) => {
      const indexOfAlreadyExistingMonth = getIndexOfMonthEnteredByUser(req);
      if (indexOfAlreadyExistingMonth) {
        res.redirect(`days-you-had-support?changeMonthYear=${indexOfAlreadyExistingMonth}`);
      } else if (req.inEditMode) {
        // Clear the previous page data for this screen to ensure the journey continues
        req.casa.journeyContext.setDataForPage('days-you-had-support', undefined);

        // Clear the yes that triggered the add another journey, so when you
        // return it does not sentd them back to the month page
        req.casa.journeyContext.setDataForPage('support-claim-summary', undefined);
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect(`days-you-had-support?edit=&editorigin=${req.editOriginUrl}`);
        });
      } else {
        next();
      }
    },
    pregather: (req, res, next) => {
      req.body.dateOfSupport.mm = removeAllSpaces(req.body.dateOfSupport.mm);
      req.body.dateOfSupport.yyyy = removeAllSpaces(req.body.dateOfSupport.yyyy);
      next();
    },
  },
});
