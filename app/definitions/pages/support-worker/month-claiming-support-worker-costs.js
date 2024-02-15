const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/support-worker/month-claiming-support-worker-costs');
const { findIndexOfGivenMonth } = require('../../../utils/claim-util');
const { SUPPORT_WORKER_ROOT_URL } = require('../../../config/uri');
const { removeAllSpaces, removeLeadingZero } = require('../../../utils/remove-all-spaces');

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

      if (req.casa.journeyContext.getDataForPage('support-claim-summary')?.anotherMonth === 'yes') {
        res.locals.hideBackButton = true;
        res.locals.casa.journeyPreviousUrl = `${SUPPORT_WORKER_ROOT_URL}/support-claim-summary`;
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
        res.locals.monthIndex = req.casa.journeyContext.getDataForPage('support-month')?.monthIndex ?? '0';
      }
      next();
    },
    preredirect: (req, res, next) => {
      const indexOfAlreadyExistingMonth = getIndexOfMonthEnteredByUser(req);
      if (indexOfAlreadyExistingMonth) {
        const allData = req.casa.journeyContext.getDataForPage('__hidden_support_page__');
        const dataToReloadForChange = allData[indexOfAlreadyExistingMonth];

        req.casa.journeyContext.setDataForPage('support-month', {
          monthIndex: indexOfAlreadyExistingMonth,
          dateOfSupport: dataToReloadForChange.monthYear,
        });

        JourneyContext.putContext(req.session, req.casa.journeyContext);
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`support-days?changeMonthYear=${indexOfAlreadyExistingMonth}`);
        });
      } else if (req.inEditMode) {
        // Clear the previous page data for this screen to ensure the journey continues
        req.casa.journeyContext.setDataForPage('support-days', undefined);

        // Clear the yes that triggered the add another journey, so when you
        // return it does not send them back to the month page
        req.casa.journeyContext.setDataForPage('support-claim-summary', undefined);
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect(`support-days?edit=&editorigin=${req.editOriginUrl}`);
        });
      } else {
        next();
      }
    },
    pregather: (req, res, next) => {
      req.body.dateOfSupport.mm = removeAllSpaces(req.body.dateOfSupport.mm);
      req.body.dateOfSupport.yyyy = removeAllSpaces(req.body.dateOfSupport.yyyy);
      req.body.dateOfSupport.mm = removeLeadingZero(req.body.dateOfSupport.mm);
      req.body.dateOfSupport.yyyy = removeLeadingZero(req.body.dateOfSupport.yyyy);
      next();
    },
    postvalidate: (req, res, next) => {
      // Submit clicked
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
  }
});
