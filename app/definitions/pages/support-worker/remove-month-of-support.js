const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/support-worker/remove-month-of-support');
const logger = require('../../../logger/logger');

const log = logger('support-worker:remove-month-of-support');

module.exports = () => ({
  view: 'pages/support-worker/remove-month-of-support.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.removeId = req.casa.journeyContext.getDataForPage('remove-support-month').removeId;
      next();
    },
    postvalidate: (req, res, next) => {
      const pageData = req.casa.journeyContext.getDataForPage('remove-support-month');
      req.casa.journeyContext.setDataForPage('remove-support-month', undefined);
      if (req.inEditMode) {
        // Ensured that the data is set to make it go to the remove page rather than the summary
        req.casa.journeyContext.setDataForPage('support-claim-summary', { anotherMonth: 'no' });
      } else {
        req.casa.journeyContext.setDataForPage('support-claim-summary', undefined);
      }
      if (pageData.removeMonthOfSupport === 'yes') {
        const summaryPageData = req.casa.journeyContext.getDataForPage('__hidden_support_page__');
        log.debug(`Month to delete ${pageData.removeId}`);
        delete summaryPageData[pageData.removeId];
        req.casa.journeyContext.setDataForPage('__hidden_support_page__', summaryPageData);
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
