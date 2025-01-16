/* eslint-disable no-console */
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
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

      const payees = req.casa.journeyContext.getDataForPage('__hidden_account__').account.payees;
      let filteredPayeeDetails;
      filteredPayeeDetails = payees.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.name === value.name && t.emailAddress === value.emailAddress
        ))
      )
      res.locals.payees = filteredPayeeDetails.slice(0, 10);

      checkIfShouldHaveOptionToAddNewPayeeThroughEditMode(req, res);
      next();
    },
    preredirect: (req, res, next) => {
      if (req.inEditMode) {
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect(`select-person-company-being-paid?edit=&editorigin=${req.editOriginUrl}`);
        });
      } else {
        next();
      }
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

        // new hidden page called hidden_existing_payee_details so that data can be retained going forward
        // even when pressing back button on existing bank details pages
        req.casa.journeyContext.setDataForPage('__hidden_existing_payee_details__', {
          id: payeeSelected.id,
          fullName: payeeSelected.name ?? payeeSelected.bankAccountName,
          emailAddress: payeeSelected.emailAddress,
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
        ); 
        req.casa.journeyContext.setValidationErrorsForPage(
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
