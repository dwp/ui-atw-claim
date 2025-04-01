/* eslint-disable no-console */
const fieldValidators = require(
  '../../../field-validators/common/payee-details/select-person-company-being-paid',
);
const { claimTypesFullName } = require('../../../../config/claim-types');
const { 
  TRAVEL_TO_WORK_ROOT_URL, 
  SUPPORT_WORKER_ROOT_URL, 
  TRAVEL_IN_WORK_ROOT_URL 
} = require('../../../../config/uri');
const checkIfShouldHaveOptionToAddNewAccountDetailsThroughEditMode = (req, res) => {
  const { newPayee: wantsToAddNewPayee } = { ...req.casa.journeyContext.getDataForPage('__hidden_new_payee__') };
  const { account } = { ...req.casa.journeyContext.getDataForPage('__hidden_account__') };
  const hasExistingAccountDetails = account.payees.length !== 0;

  res.locals.shouldHaveOptionToAddNewPayee = hasExistingAccountDetails && wantsToAddNewPayee;

};

const disableEditMode = (req) => {
  req.inEditMode = false;
};
module.exports = () => ({
  view: 'pages/common/payee-details/select-person-company-being-paid.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
    res.locals.ttw = claimTypesFullName.TW;
    res.locals.journeyType = req.casa.journeyContext.getDataForPage('__journey_type__')?.journeyType;
    if (res.locals.journeyType === claimTypesFullName.TW) {
      res.locals.howDidYouTravelForWork = req.casa.journeyContext.getDataForPage('which-journey-type').howDidYouTravelForWork;
    }
    const payees = req.casa.journeyContext.getDataForPage('__hidden_account__').account.payees;
    const payeeDetails = req.casa.journeyContext.getDataForPage('__hidden_existing_payee_details__');
    res.locals.payeeDetails = payeeDetails;

    // need to use name and email to pull out account details for chosen payee
    // using substring to cut account number to only last 4 digits
    let payeeAccountDetails = [];
    let count = 0;
    for (let i = 0; i < payees.length && count < 10; i++) {
      if ((payeeDetails.fullName === payees[i].name || payeeDetails.fullName === payees[i].bankAccountName) 
            && payeeDetails.emailAddress === payees[i].emailAddress) {
        let payeeLastPaid = req.casa.journeyContext.getDataForPage('__hidden_account__').account.sentForPayment.filter(
          (payee) => payee.payeeId === parseInt(payees[i].id, 10),
        )[0];


        if (payeeLastPaid) {
        const formattedDate = new Date(payeeLastPaid.sentForPaymentOn).toLocaleDateString('en-GB');
        const accountDetails = {
          "id": payees[i].id,
          "bankAccountName": payees[i].bankAccountName,
          "accountNumber": payees[i].accountNumber.substring(4, 8),
          "lastPaid": formattedDate
      
        }
        payeeAccountDetails.push(accountDetails);
        count++;
        } else {
        const accountDetails = {
          "id": payees[i].id,
          "bankAccountName": payees[i].bankAccountName,
          "accountNumber": payees[i].accountNumber.substring(4, 8),
        }
        payeeAccountDetails.push(accountDetails);
        count++;
        }
      }
    }
    res.locals.payeeAccountDetails = payeeAccountDetails;

     checkIfShouldHaveOptionToAddNewAccountDetailsThroughEditMode(req, res);
     next();
    },
    preredirect: (req, res, next) => {
      if (req.inEditMode) {
        let redirect;
        const { journeyType } = req.casa.journeyContext.getDataForPage('__journey_type__');
          if (journeyType === claimTypesFullName.SW) {
            redirect = `${SUPPORT_WORKER_ROOT_URL}/check-your-answers`;
          } else if (journeyType === claimTypesFullName.TW) {
            redirect = `${TRAVEL_TO_WORK_ROOT_URL}/check-your-answers`;
          } else if (journeyType === claimTypesFullName.TIW) {
            redirect = `${TRAVEL_IN_WORK_ROOT_URL}/check-your-answers`;
          } else {
            throw new Error('Unsupported journeyType for back link');
          } 
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect(redirect);
        });
      } else {
        next();
      }
    },
    postvalidate: (req, res, next) => {
      const bankDetailsValue = req.casa.journeyContext.getDataForPage('select-person-company-being-paid').bankDetails;
      const payeeValue = req.casa.journeyContext.getDataForPage('person-company-being-paid').payee;

      if (bankDetailsValue === 'new') {
        req.casa.journeyContext.setDataForPage('__hidden_new_payee__', {
          newPayee: true,
        });
        req.casa.journeyContext.setDataForPage('__hidden_existing_payee__', undefined);
        disableEditMode(req);
      } else {
        const payeeSelected = req.casa.journeyContext.getDataForPage('__hidden_account__').account.payees.filter(
          (payee) => payee.id === parseInt(payeeValue, 10),
        )[0];

        const bankDetailsSelected = req.casa.journeyContext.getDataForPage('__hidden_account__').account.payees.filter(
          (bankDetails) => bankDetails.id === parseInt(bankDetailsValue, 10),
        )[0];

        req.casa.journeyContext.setDataForPage('__hidden_new_payee__', {
          newPayee: false,
        });

        req.casa.journeyContext.setDataForPage('__hidden_existing_payee__', {
          fullName: payeeSelected.name ?? bankDetailsSelected.bankAccountName,
          emailAddress: payeeSelected.emailAddress,
        });

        req.casa.journeyContext.setDataForPage('__hidden_existing_payee_details__', {
          id: payeeSelected.id,
          bankAccountName: bankDetailsSelected.bankAccountName,
          fullName: payeeSelected.name ?? bankDetailsSelected.bankAccountName,
          emailAddress: payeeSelected.emailAddress,
          accountNumber: bankDetailsSelected.accountNumber,
          accountNumberEndingIn: bankDetailsSelected.accountNumber.substring(4, 8),
          rollNumber: bankDetailsSelected.rollNumber,
        })

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
        req.casa.journeyContext.setDataForPage('person-company-being-paid-payment-details', {
          accountNumber: bankDetailsSelected.accountNumber,
        });
        req.casa.journeyContext.setValidationErrorsForPage(
          'person-company-being-paid-payment-details',
          undefined,
        );
      }
      next();
    },
  },
});
