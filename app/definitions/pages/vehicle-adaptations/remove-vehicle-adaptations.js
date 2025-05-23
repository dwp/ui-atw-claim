const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/vehicle-adaptations/remove-vehicle-adaptation');
const logger = require('../../../logger/logger');

const log = logger('vehicle-adaptations:remove-vehicle-adaptations.njk');

module.exports = () => ({
  view: 'pages/vehicle-adaptations/remove-vehicle-adaptations.njk',
  fieldValidators,
  hooks: {
    postvalidate: (req, res, next) => {
      const pageData = req.casa.journeyContext.getDataForPage('remove-vehicle-adaptations');
      res.locals.summaryPageData = pageData;
      res.locals.removeId = req.query.remove;
      req.casa.journeyContext.setDataForPage('remove-vehicle-adaptations', undefined);
      if (req.inEditMode) {
        // Ensured that the data is set to make it go to the remove page rather than the summary
        req.casa.journeyContext.setDataForPage('vehicle-adaptations-summary', { addAnother: 'no' });
      } else {
        req.casa.journeyContext.setDataForPage('vehicle-adaptations-summary', undefined);
      }
      if (pageData.removeVehicleAdaptation === 'yes') {
        const summaryPageData = req.casa.journeyContext.getDataForPage('__hidden_vehicle_adaptations_page__');
        log.debug(`Vehicle Adaptation to delete ${req.query.remove}`);
        delete summaryPageData[req.query.remove];
        req.casa.journeyContext.setDataForPage('__hidden_vehicle_adaptations_page__', summaryPageData);
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
