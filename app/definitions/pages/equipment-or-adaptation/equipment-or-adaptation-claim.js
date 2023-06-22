const fieldValidators = require('../../field-validators/equipment-or-adaptation/equipment-or-adaptation-claim');
const { claimTypesFullName } = require('../../../config/claim-types');

const logger = require('../../../logger/logger');

const log = logger('middleware:equipment-or-adaptation-claim');

module.exports = () => ({
  view: 'pages/equipment-or-adaptation/equipment-or-adaptation-claim.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      log.debug(req.casa.journeyContext.data);
      log.debug(req.casa.journeyContext.validation);

      res.locals.hideBackButton = true;
      req.casa.journeyContext.setDataForPage('__journey_type__', { journeyType: claimTypesFullName.EA });
      next();
    },
  },
});
