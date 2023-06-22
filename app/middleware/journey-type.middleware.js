const { claimTypesFullName } = require('../config/claim-types');
const logger = require('../logger/logger');

const log = logger('middleware:journey-type');

const injectJourneyTypeHelpers = (req, res) => {
  const { journeyType } = { ...req.casa.journeyContext?.getDataForPage('__journey_type__') };

  res.locals.isOnEaJourney = journeyType === claimTypesFullName.EA;
  res.locals.isOnSwJourney = journeyType === claimTypesFullName.SW;
  res.locals.isOnTtwJourney = journeyType === claimTypesFullName.TW;
};

const injectClaimTypes = (res) => {
  res.locals.ea = claimTypesFullName.EA;
  res.locals.sw = claimTypesFullName.SW;
  res.locals.ttw = claimTypesFullName.TW;
};

module.exports = (
  app,
) => {
  app.use(async (req, res, next) => {
    log.debug('middleware: journey-type.middleware');

    injectClaimTypes(res);
    injectJourneyTypeHelpers(req, res);

    next();
  });
};
