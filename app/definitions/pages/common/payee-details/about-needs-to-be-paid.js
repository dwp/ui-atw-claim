const { trimWhitespace } = require('@dwp/govuk-casa').gatherModifiers;
const fieldValidators = require('../../../field-validators/common/payee-details/about-needs-to-be-paid');
const { claimTypesFullName, claimTypesShortName } = require('../../../../config/claim-types');
const { removeAllSpaces } = require('../../../../utils/remove-all-spaces');

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
      res.locals.awardType = claimTypesShortName[res.locals.journeyType];

      // Add new Flag for all EA claims as you cannot use existing Payee details for EA claims
      // Or if they do not have any existing Payee details
      if (journeyType === claimTypesFullName.EA || journeyType === claimTypesFullName.AV
        || req.casa.journeyContext.getDataForPage('__hidden_account__').account.payees.length === 0) {
        res.locals.showSpan = true;
        req.casa.journeyContext.setDataForPage('__hidden_new_payee__', { newPayee: true });
      }
      if (journeyType === claimTypesFullName.TW) {
        res.locals.howDidYouTravelForWork = req.casa.journeyContext.getDataForPage('which-journey-type').howDidYouTravelForWork;        
      }
      if (journeyType === claimTypesFullName.TW || journeyType === claimTypesFullName.TIW || journeyType === claimTypesFullName.SW ) {
        const existingPayeeDetails = req.casa.journeyContext.getDataForPage('__hidden_existing_payee_details__');
        if (existingPayeeDetails) {
          res.locals.existingPayeeFullName = existingPayeeDetails.fullName;
          res.locals.existingPayeeEmailAddress = existingPayeeDetails.emailAddress;
        }
      }
      next();
    },
    pregather: (req, res, next) => {
      req.body.emailAddress = removeAllSpaces(req.body.emailAddress);
      next();
    },
  },
});
