const { ACCOUNT_ROOT_URL } = require('../config/uri');
const { endSessionWhilePreservingAccountData } = require('../lib/utils/session-helper');
const {
  claimTypesShortName,
} = require('../config/claim-types');

module.exports = (casaApp) => {
  const submittedClaim = (req, res) => {
    res.locals.BUTTON_TEXT = res.locals.t('common:returnToAccountHome');

    let filledIn;
    let filledInAndValid;

    if (req.casa.journeyContext.getDataForPage('__previous_claim__') !== undefined) {
      filledIn = req.casa.journeyContext.getDataForPage(
        'check-your-answers',
      );
      filledInAndValid = req.casa.journeyContext.getValidationErrorsForPage(
        'check-your-answers',
      );
    } else {
      filledIn = req.casa.journeyContext.getDataForPage(
        'amend-confirmer-details',
      );
      filledInAndValid = req.casa.journeyContext.getValidationErrorsForPage(
        'amend-confirmer-details',
      );
    }

    if (
      Object.keys(filledInAndValid).length === 0
      && (filledIn && Object.keys(filledIn).length > 0)) {
      const { awardType } = req.session.claimHistory;

      if (req.casa.journeyContext.getDataForPage('transactionDetails') !== undefined) {
        const { claimType, claimNumber } = req.casa.journeyContext.getDataForPage('transactionDetails');
        res.locals.transactionId = claimTypesShortName[claimType] + claimNumber.toString()
          .padStart(8, '0');
      } else {
        res.locals.transactionId = claimTypesShortName[awardType] + req.session.claimId.toString()
          .padStart(8, '0');
      }

      endSessionWhilePreservingAccountData(
        casaApp,
        req,
        res,
        'pages/common/amendWorkplaceContact/submitted-amended-claim.njk',
      );
    } else {
      res.redirect(`${ACCOUNT_ROOT_URL}/home`);
    }
  };

  casaApp.router.get('/claim-amended', casaApp.csrfMiddleware, submittedClaim);

  return submittedClaim;
};
