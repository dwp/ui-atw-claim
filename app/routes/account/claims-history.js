const {
  ACCOUNT_CONTEXT_PATH,
} = require('../../config/uri');
const {
  mountURL,
} = require('../../config/config-mapping');
const logger = require('../../logger/logger');

const log = logger('app:routes.account.claim-history');
const { claimTypesFullName } = require('../../config/claim-types');
const submittedClaimsFetcher = require('../../middleware/fetchers/submitted-claims-fetcher');

module.exports = (casaApp) => {
  const noClaimsToShow = (res) => res.locals.sentForPayment.length === 0
    && res.locals.confirmedClaims.length === 0 && res.locals.sentToWorkPlace.length === 0
    && res.locals.rejectedClaims.length === 0 && res.locals.sentToDwp.length === 0;

  const claimsHistory = async (req, res) => {
    const { awardType } = { ...req.session.claimHistory };
    const { nino } = req.casa.journeyContext.getDataForPage('__hidden_account__').account;

    res.locals.sentForPayment = req.casa.journeyContext.getDataForPage('__hidden_account__')
      .account
      .sentForPayment
      .filter(
        (claim) => claim.claimType === awardType,
      );

    res.locals.awardType = awardType;
    res.locals.sentToWorkPlace = [];
    res.locals.sentToDwp = [];
    res.locals.confirmedClaims = [];
    res.locals.rejectedClaims = [];

    res.locals.isMultiAward = req.casa.journeyContext.getDataForPage(
      '__hidden_account__',
    ).account.elements.length > 1;

    try {
      const submittedClaims = await submittedClaimsFetcher.getSubmittedClaims(nino, awardType);

      if (!submittedClaims) {
        log.info('Claims not found');
        res.locals.noClaims = noClaimsToShow(res);
        return res.render('pages/account/claims-history.njk');
      }

      let listOfClaims = submittedClaims;
      const filterDownListOfClaims = (filterFunction) => {
        const [matching, notMatching] = listOfClaims
          .reduce(([pass, fail], element) => (filterFunction(element)
            ? [[...pass, element], fail] : [pass, [...fail, element]]), [[], []]);

        listOfClaims = notMatching;
        return matching;
      };

      const claimsSentToWorkplace = filterDownListOfClaims((element) => element.claimStatus === 'AWAITING_COUNTER_SIGN');

      const sentToDwp = filterDownListOfClaims(
        (element) => (element.claimType === claimTypesFullName.EA || element.claimType === claimTypesFullName.AV
          || (element.claimType === claimTypesFullName.TW && element.workplaceContact.employmentStatus === 'selfEmployed')
          || (element.claimType === claimTypesFullName.TIW && element.workplaceContact.employmentStatus === 'selfEmployed'))
          && (element.claimStatus === 'AWAITING_DRS_UPLOAD' || element.claimStatus
            === 'UPLOADED_TO_DOCUMENT_BATCH' || element.claimStatus === 'AWAITING_AGENT_APPROVAL'),
      );

      const confirmedClaims = filterDownListOfClaims(
        (claim) => claim.claimStatus === 'AWAITING_DRS_UPLOAD' || claim.claimStatus
          === 'UPLOADED_TO_DOCUMENT_BATCH' || claim.claimStatus === 'AWAITING_AGENT_APPROVAL',
      );

      const rejectedClaims = filterDownListOfClaims(
        (claim) => claim.claimStatus === 'COUNTER_SIGN_REJECTED',
      );

      res.locals.sentToWorkPlace = claimsSentToWorkplace;
      res.locals.sentToDwp = sentToDwp;
      res.locals.confirmedClaims = confirmedClaims;
      res.locals.rejectedClaims = rejectedClaims;

      res.locals.noClaims = noClaimsToShow(res);
      return res.render('pages/account/claims-history.njk');
    } catch (e) {
        log.error('Error in submitted claims fetcher');
        log.error(e);
        if(mountURL.includes('/claim')){
          return res.redirect(`${mountURL}problem-with-service`);
        }
    }
  };

  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/your-claims`, casaApp.csrfMiddleware, claimsHistory);

  return { claimsHistory };
};
