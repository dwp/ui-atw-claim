const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/support-worker/remove-month-of-support');
const logger = require('../../../logger/logger');

const log = logger('support-worker:remove-month-of-support');

module.exports = () => ({
  view: 'pages/support-worker/remove-month-of-support.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const summaryPageData = req.casa.journeyContext.getDataForPage('__hidden_support_page__');
      res.locals.summaryPageData = summaryPageData;
      res.locals.removeId = req.query.remove;
      next();
    },
    postvalidate: (req, res, next) => {
      const pageData = req.casa.journeyContext.getDataForPage('remove-support-month');
      req.casa.journeyContext.setDataForPage('remove-support-month', undefined);
      if (req.inEditMode) {
        // Ensured that the data is set to make it go to the remove page rather than the summary
        req.casa.journeyContext.setDataForPage('support-claim-summary', { anotherMonth: 'no' });
      } else {
        log.debug("Here", req.casa.journeyContext.getDataForPage('support-claim-summary'));
        req.casa.journeyContext.setDataForPage('support-claim-summary', undefined);
      }
      if (pageData.removeMonthOfSupport === 'yes') {
        const summaryPageData = req.casa.journeyContext.getDataForPage('__hidden_support_page__');
        log.debug(`Month to delete ${req.query.remove}`);
        delete summaryPageData[req.query.remove];
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
