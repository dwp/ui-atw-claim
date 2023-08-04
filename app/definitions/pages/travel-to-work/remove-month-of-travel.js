const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/travel-to-work/remove-month-of-travel');
const logger = require('../../../logger/logger');

const log = logger('travel-to-work:remove-month-of-support');

module.exports = () => ({
  view: 'pages/travel-to-work/remove-month-of-travel.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.removeId = req.casa.journeyContext.getDataForPage('remove-travel-month').removeId;
      next();
    },
    postvalidate: (req, res, next) => {
      const pageData = req.casa.journeyContext.getDataForPage('remove-travel-month');
      req.casa.journeyContext.setDataForPage('remove-travel-month', undefined);
      req.casa.journeyContext.setDataForPage('journey-summary', undefined);

      if (pageData.removeMonthOfTravel === 'yes') {
        const summaryPageData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
        log.debug(`Month to delete ${pageData.removeId}`);
        delete summaryPageData[pageData.removeId];
        req.casa.journeyContext.setDataForPage('__hidden_travel_page__', summaryPageData);
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
