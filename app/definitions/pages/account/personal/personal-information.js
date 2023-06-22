const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../../field-validators/common/optional-validator');
const {
  PERSONAL_INFORMATION_URL,
} = require('../../../../config/uri');

module.exports = () => ({
  view: 'pages/account/personal/personal-information.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.BUTTON_TEXT = res.locals.t('personal-information:button');
      const { account } = req.casa.journeyContext.getDataForPage(
        '__hidden_account__',
      );

      res.locals.atwNumber = account.atwNumber;
      const { claimant } = account;

      res.locals.forename = claimant.forename;
      res.locals.surname = claimant.surname;
      res.locals.homeNumber = claimant.homeNumber;
      res.locals.mobileNumber = claimant.mobileNumber;
      res.locals.email = claimant.email;
      res.locals.address = claimant.address;
      next();
    },
    preredirect: (req, res) => {
      const { claimant } = req.casa.journeyContext.getDataForPage('__hidden_account__').account;

      req.casa.journeyContext.setDataForPage('update-name', {
        firstName: claimant.forename,
        lastName: claimant.surname,
      });
      req.casa.journeyContext.clearValidationErrorsForPage('update-name');

      req.casa.journeyContext.setDataForPage(
        'update-your-email-address',
        { emailAddress: claimant.email },
      );
      req.casa.journeyContext.clearValidationErrorsForPage('update-your-email-address');

      req.casa.journeyContext.setDataForPage(
        'telephone-number-change',
        {
          homeNumber: claimant.homeNumber,
          mobileNumber: claimant.mobileNumber,
        },
      );

      req.casa.journeyContext.clearValidationErrorsForPage('telephone-number-change');

      req.casa.journeyContext.setDataForPage(
        'new-phone-number',
        {
          homeNumber: claimant.homeNumber,
        },
      );

      req.casa.journeyContext.clearValidationErrorsForPage('new-phone-number');

      req.casa.journeyContext.setDataForPage(
        'new-mobile-number',
        {
          mobileNumber: claimant.mobileNumber,
        },
      );

      req.casa.journeyContext.clearValidationErrorsForPage('new-mobile-number');

      req.casa.journeyContext.setDataForPage('__hidden_address__', {
        addressDetails: {
          address1: claimant.address.address1,
          address2: claimant.address.address2,
          address3: claimant.address.address3,
          address4: claimant.address.address4,
          postcode: claimant.address.postcode,
        },
      });

      req.casa.journeyContext.clearValidationErrorsForPage('new-postcode');
      req.casa.journeyContext.clearValidationErrorsForPage('new-address-select');
      req.casa.journeyContext.clearValidationErrorsForPage('enter-address');
      req.casa.journeyContext.clearValidationErrorsForPage('remove-home-number');
      req.casa.journeyContext.clearValidationErrorsForPage('remove-mobile-number');

      JourneyContext.putContext(req.session, req.casa.journeyContext);

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        return res.redirect(`${PERSONAL_INFORMATION_URL}/personal-information-change`);
      });
    },
  },
});
