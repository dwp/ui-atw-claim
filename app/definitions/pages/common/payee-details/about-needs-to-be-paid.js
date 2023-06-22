const { trimWhitespace } = require('@dwp/govuk-casa').gatherModifiers;
const fieldValidators = require('../../../field-validators/common/payee-details/about-needs-to-be-paid');
const { claimTypesFullName } = require('../../../../config/claim-types');
const removeAllSpaces = require('../../../../utils/remove-all-spaces');

module.exports = () => ({
  view: 'pages/common/payee-details/about-needs-to-be-paid.njk',
  fieldGatherModifiers: {
    fullName: trimWhitespace,
  },
  reviewBlockView: 'pages/common/payee-details/review/payee-details.njk',
  fieldValidators,
  hooks: {
    prerender(req, res, next) {
      const { journeyType } = req.casa.journeyContext.getDataForPage('__journey_type__');
      res.locals.journeyType = journeyType;

      // Add new Flag for all EA claims as you cannot use existing Payee details for EA claims
      // Or if they do not have any existing Payee details
      if (journeyType === claimTypesFullName.EA
        || req.casa.journeyContext.getDataForPage('__hidden_account__').account.payees.length === 0) {
        res.locals.showSpan = true;
        req.casa.journeyContext.setDataForPage('__hidden_new_payee__', { newPayee: true });
      }
      if (journeyType === claimTypesFullName.TW) {
        res.locals.howDidYouTravelForWork = req.casa.journeyContext.getDataForPage('how-did-you-travel-for-work').howDidYouTravelForWork;
      }

      next();
    },
    pregather: (req, res, next) => {
      req.body.emailAddress = removeAllSpaces(req.body.emailAddress);
      next();
    },
  },
});
