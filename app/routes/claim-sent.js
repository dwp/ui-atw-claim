const formatClaimType = require('../utils/format-claim-type');
const { ACCOUNT_ROOT_URL, PUBLIC_URL } = require('../config/uri');
const { endSessionWhilePreservingAccountData } = require('../lib/utils/session-helper');
const { claimTypesFullName } = require('../config/claim-types');

module.exports = (casaApp) => {
  const submittedClaim = (req, res) => {
    res.locals.publicBaseUrl = PUBLIC_URL;

    // redo the gate keeping once Plan is done
    const journeyType = req.casa.journeyContext?.getDataForPage('__journey_type__')?.journeyType;
    let filledIn = {};
    let filledInAndValid = {};
    let nextPageViewFile;
    res.locals.BUTTON_TEXT = res.locals.t('common:returnToAccountHome');
    if (journeyType === claimTypesFullName.EA) {
      filledIn = req.casa.journeyContext.getDataForPage(
        'bank-details-of-person-or-company-being-paid',
      );
      filledInAndValid = req.casa.journeyContext.getValidationErrorsForPage(
        'bank-details-of-person-or-company-being-paid',
      );
      nextPageViewFile = 'pages/equipment-or-adaptation/submitted-equipment-or-adaptations.njk';
    } else if (journeyType === claimTypesFullName.SW) {
      filledIn = req.casa.journeyContext.getDataForPage('confirm-workplace-contact-details');
      filledInAndValid = req.casa.journeyContext.getValidationErrorsForPage(
        'confirm-workplace-contact-details',
      );
      nextPageViewFile = 'pages/support-worker/submitted-support-worker.njk';
    } else if (journeyType === claimTypesFullName.TW) {
      res.locals.employmentStatus = req.casa.journeyContext.getDataForPage(
        'employment-status',
      ).employmentStatus;

      if (res.locals.employmentStatus === 'employed') {
        filledIn = req.casa.journeyContext.getDataForPage('confirm-workplace-contact-details');
        filledInAndValid = req.casa.journeyContext.getValidationErrorsForPage(
          'confirm-workplace-contact-details',
        );
      } else {
        filledIn = req.casa.journeyContext.getDataForPage('employment-status');
        filledInAndValid = req.casa.journeyContext.getValidationErrorsForPage('employment-status');
      }
      nextPageViewFile = 'pages/travel-to-work/submitted-travel-to-work.njk';
    }

    if (
      Object.keys(filledInAndValid).length === 0
      && (filledIn && Object.keys(filledIn).length > 0)) {
      const transactionDetails = req.casa.journeyContext.getDataForPage('transactionDetails');

      res.locals.transactionId = formatClaimType(transactionDetails.claimType)
        + transactionDetails.claimNumber.toString()
          .padStart(8, '0');

      endSessionWhilePreservingAccountData(casaApp, req, res, nextPageViewFile);
    } else {
      res.redirect(`${ACCOUNT_ROOT_URL}/home`);
    }
  };

  casaApp.router.get('/claim-sent', casaApp.csrfMiddleware, submittedClaim);

  return submittedClaim;
};
