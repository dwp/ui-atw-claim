const { claimTypesFullName } = require('../config/claim-types');
const logger = require('../logger/logger');

const log = logger('middleware:journey-type');

const injectJourneyTypeHelpers = (req, res) => {
  const { journeyType } = { ...req.casa.journeyContext?.getDataForPage('__journey_type__') };

  res.locals.isOnAvJourney = journeyType === claimTypesFullName.AV;
  res.locals.isOnEaJourney = journeyType === claimTypesFullName.EA;
  res.locals.isOnSwJourney = journeyType === claimTypesFullName.SW;
  res.locals.isOnTtwJourney = journeyType === claimTypesFullName.TW;
  res.locals.isOnTiwJourney = journeyType === claimTypesFullName.TIW;
};

const injectClaimTypes = (res) => {
  res.locals.av = claimTypesFullName.AV;
  res.locals.ea = claimTypesFullName.EA;
  res.locals.sw = claimTypesFullName.SW;
  res.locals.ttw = claimTypesFullName.TW;
  res.locals.tiw = claimTypesFullName.TIW;
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
