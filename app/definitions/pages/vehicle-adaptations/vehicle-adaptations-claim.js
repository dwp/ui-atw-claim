const fieldValidators = require('../../field-validators/vehicle-adaptations/vehicle-adaptations-claim');
const { claimTypesFullName } = require('../../../config/claim-types');

module.exports = () => ({
  view: 'pages/vehicle-adaptations/vehicle-adaptations-claim.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.hideBackButton = true;
      req.casa.journeyContext.setDataForPage('__journey_type__', { journeyType: claimTypesFullName.AV });
      next();
    },
  },
});