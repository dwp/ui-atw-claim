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
        res.locals.howDidYouTravelForWork = req.casa.journeyContext.getDataForPage('which-journey-type').howDidYouTravelForWork;
      }
      res.locals.payees = req.casa.journeyContext.getDataForPage('__hidden_account__').account.payees;
      checkIfShouldHaveOptionToAddNewPayeeThroughEditMode(req, res);
      next();
    },
    postvalidate: (req, res, next) => {
      const payeeValue = req.casa.journeyContext.getDataForPage('person-company-being-paid').payee;

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
        req.casa.journeyContext.setDataForPage('person-company-being-paid-details', undefined);
        req.casa.journeyContext.setValidationErrorsForPage('person-company-being-paid-details', undefined);
        req.casa.journeyContext.setDataForPage(
          'person-company-being-paid-postcode',
          undefined,
        ); req.casa.journeyContext.setValidationErrorsForPage(
          'person-company-being-paid-postcode',
          undefined,
        );
        req.casa.journeyContext.setDataForPage('__hidden_address__', undefined);
        req.casa.journeyContext.setDataForPage(
          'person-company-being-paid-address',
          undefined,
        ); req.casa.journeyContext.setValidationErrorsForPage(
          'person-company-being-paid-address',
          undefined,
        );
        req.casa.journeyContext.setDataForPage(
          'enter-person-company-being-paid-address',
          undefined,
        );
        req.casa.journeyContext.setValidationErrorsForPage(
          'enter-person-company-being-paid-address',
          undefined,
        );
        req.casa.journeyContext.setDataForPage(
          'person-company-being-paid-payment-details',
          undefined,
        );
        req.casa.journeyContext.setValidationErrorsForPage(
          'person-company-being-paid-payment-details',
          undefined,
        );
      }
      next();
    },
  },
});
