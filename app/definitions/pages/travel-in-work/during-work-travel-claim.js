const fieldValidators = require('../../field-validators/travel-in-work/during-work-travel-claim');
const { claimTypesFullName } = require('../../../config/claim-types');

module.exports = () => ({
  view: 'pages/travel-in-work/during-work-travel-claim.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      req.casa.journeyContext.setDataForPage('__journey_type__', { journeyType: claimTypesFullName.TIW });
      next();
    },
  },
});
