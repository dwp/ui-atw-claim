const fieldValidators = require('../../field-validators/equipment-or-adaptation/equipment-or-adaptation-claim');
const { claimTypesFullName } = require('../../../config/claim-types');
const {
  ACCOUNT_ROOT_URL,
} = require('../../../config/uri');

module.exports = () => ({
  view: 'pages/equipment-or-adaptation/equipment-or-adaptation-claim.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.hideBackButton = true;
      req.casa.journeyContext.setDataForPage('__journey_type__', { journeyType: claimTypesFullName.EA });
      next();
    },
    postvalidate: (req, res, next) => {
      if(req.body.claimingEquipment === 'no') {
        return res.redirect(`${ACCOUNT_ROOT_URL}/multiple-claims-exit`);
      }

      next();
    },
  },
});
