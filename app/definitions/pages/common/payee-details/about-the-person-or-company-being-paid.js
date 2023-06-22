/* eslint-disable no-console */
const fieldValidators = require(
  '../../../field-validators/common/payee-details/about-the-person-or-company-being-paid',
);
const { claimTypesFullName } = require('../../../../config/claim-types');

const checkIfShouldHaveOptionToAddNewPayeeThroughEditMode = (req, res) => {
  const { newPayee: wantsToAddNewPayee } = { ...req.casa.journeyContext.getDataForPage('__hidden_new_payee__') };
  const { account } = { ...req.casa.journeyContext.getDataForPage('__hidden_account__') };
  const hasExistingPayees = account.payees.length !== 0;

  res.locals.shouldHaveOptionToAddNewPayee = hasExistingPayees && !wantsToAddNewPayee;
};

const disableEditMode = (req) => {
  req.inEditMode = false;
};

module.exports = () => ({
  view: 'pages/common/payee-details/about-the-person-or-company-being-paid.njk',
  reviewBlockView: 'pages/common/payee-details/review/existing-payee-details.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.ttw = claimTypesFullName.TW;
      res.locals.journeyType = req.casa.journeyContext.getDataForPage('__journey_type__')?.journeyType;
      if (res.locals.journeyType === claimTypesFullName.TW) {
        res.locals.howDidYouTravelForWork = req.casa.journeyContext.getDataForPage('how-did-you-travel-for-work').howDidYouTravelForWork;
      }
      res.locals.payees = req.casa.journeyContext.getDataForPage('__hidden_account__').account.payees;
      checkIfShouldHaveOptionToAddNewPayeeThroughEditMode(req, res);
      next();
    },
    postvalidate: (req, res, next) => {
      const payeeValue = req.casa.journeyContext.getDataForPage('about-the-person-or-company-being-paid').payee;

      if (payeeValue === 'new') {
        req.casa.journeyContext.setDataForPage('__hidden_new_payee__', {
          newPayee: true,
        });
        req.casa.journeyContext.setDataForPage('__hidden_existing_payee__', undefined);
        disableEditMode(req);
      } else {
        const payeeSelected = req.casa.journeyContext.getDataForPage('__hidden_account__').account.payees.filter(
          (payee) => payee.id === parseInt(payeeValue, 10),
        )[0];

        req.casa.journeyContext.setDataForPage('__hidden_new_payee__', {
          newPayee: false,
        });

        req.casa.journeyContext.setDataForPage('__hidden_existing_payee__', {
          fullName: payeeSelected.name ?? payeeSelected.bankAccountName,
          emailAddress: payeeSelected.email,
        });
        req.casa.journeyContext.setDataForPage('about-needs-to-be-paid', undefined);
        req.casa.journeyContext.setValidationErrorsForPage('about-needs-to-be-paid', undefined);
        req.casa.journeyContext.setDataForPage(
          'postcode-of-person-or-company-being-paid',
          undefined,
        ); req.casa.journeyContext.setValidationErrorsForPage(
          'postcode-of-person-or-company-being-paid',
          undefined,
        );
        req.casa.journeyContext.setDataForPage('__hidden_address__', undefined);
        req.casa.journeyContext.setDataForPage(
          'address-of-person-or-company-being-paid',
          undefined,
        ); req.casa.journeyContext.setValidationErrorsForPage(
          'address-of-person-or-company-being-paid',
          undefined,
        );
        req.casa.journeyContext.setDataForPage(
          'enter-address-of-person-or-company-being-paid',
          undefined,
        );
        req.casa.journeyContext.setValidationErrorsForPage(
          'enter-address-of-person-or-company-being-paid',
          undefined,
        );
        req.casa.journeyContext.setDataForPage(
          'bank-details-of-person-or-company-being-paid',
          undefined,
        );
        req.casa.journeyContext.setValidationErrorsForPage(
          'bank-details-of-person-or-company-being-paid',
          undefined,
        );
      }
      next();
    },
  },
});
