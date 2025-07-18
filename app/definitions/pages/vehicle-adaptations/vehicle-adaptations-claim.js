const fieldValidators = require('../../field-validators/vehicle-adaptations/vehicle-adaptations-claim');
const { claimTypesFullName } = require('../../../config/claim-types');
const {
  ACCOUNT_ROOT_URL,
} = require('../../../config/uri');

module.exports = () => ({
  view: 'pages/vehicle-adaptations/vehicle-adaptations-claim.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.hideBackButton = true;
      req.casa.journeyContext.setDataForPage('__journey_type__', { journeyType: claimTypesFullName.AV });
      next();
    },
    postvalidate: (req, res, next) => {
      if(req.body.claimingAdaptationToVehicle === 'no') {
        return res.redirect(`${ACCOUNT_ROOT_URL}/multiple-claims-exit`);
      }

      next();
    },
  },
});