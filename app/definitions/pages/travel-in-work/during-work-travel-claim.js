const fieldValidators = require('../../field-validators/travel-in-work/during-work-travel-claim');
const { claimTypesFullName } = require('../../../config/claim-types');
const {
  ACCOUNT_ROOT_URL,
} = require('../../../config/uri');

module.exports = () => ({
  view: 'pages/travel-in-work/during-work-travel-claim.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      req.casa.journeyContext.setDataForPage('__journey_type__', { journeyType: claimTypesFullName.TIW });
      next();
    },
    postvalidate: (req, res, next) => {
      if(req.body.claimingTravelInWork === 'no') {
        return res.redirect(`${ACCOUNT_ROOT_URL}/multiple-claims-exit`);
      }

      next();
    },
  },
});
