const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/travel-in-work/remove-month-of-tiw');
const logger = require('../../../logger/logger');

const log = logger('travel-in-work:remove-month-of-tiw');

module.exports = () => ({
  view: 'pages/travel-in-work/remove-month-of-tiw.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const summaryPageData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
      res.locals.summaryPageData = summaryPageData;
      res.locals.removeId = req.query.remove;
      next();
    },
    postvalidate: (req, res, next) => {
      const pageData = req.casa.journeyContext.getDataForPage('remove-tiw-month');
      req.casa.journeyContext.setDataForPage('remove-tiw-month', undefined);
      if (req.inEditMode) {
        // Ensured that the data is set to make it go to the remove page rather than the summary
        req.casa.journeyContext.setDataForPage('taxi-journeys-summary', { anotherMonth: 'no' });
      } else {
        log.debug("Here", req.casa.journeyContext.getDataForPage('taxi-journeys-summary'));
        req.casa.journeyContext.setDataForPage('taxi-journeys-summary', undefined);
      }
      if (pageData.removeMonthOfTravel === 'yes') {
        const summaryPageData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
        log.debug(`Month to delete ${req.query.remove}`);
        delete summaryPageData[req.query.remove];
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
