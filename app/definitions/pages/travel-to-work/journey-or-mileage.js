const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/travel-to-work/journey-or-mileage');
const logger = require('../../../logger/logger');

const log = logger('travel-to-work:journey-or-mileage');

module.exports = () => ({
  view: 'pages/travel-to-work/journey-or-mileage.njk',
  fieldValidators,
  hooks: {
    postvalidate: async (req, res, next) => {
      // Clear answers if change from journeys to miles or visa versa
      const newAnswer = req.casa.journeyContext.getDataForPage(
        'journeys-miles',
      ).journeysOrMileage;
      const oldAnswer = req.casa.journeyContext.getDataForPage(
        '__hidden_journey_or_mileage__',
      )?.journeysOrMileage;

      if (newAnswer !== oldAnswer) {
        log.debug(`Clear answers for travel pages. Old: ${oldAnswer} New: ${newAnswer}`);

        req.casa.journeyContext.setValidationErrorsForPage('travel-month');
        req.casa.journeyContext.setValidationErrorsForPage('travel-days');

        req.casa.journeyContext.setDataForPage('travel-month', undefined);
        req.casa.journeyContext.setDataForPage('travel-days', undefined);
        req.casa.journeyContext.setDataForPage('__hidden_travel_page__', undefined);
        req.casa.journeyContext.setDataForPage(
          '__hidden_journey_or_mileage__',
          { journeysOrMileage: newAnswer },
        );
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
