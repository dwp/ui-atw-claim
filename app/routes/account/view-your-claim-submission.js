const axios = require('axios');
const {
  ACCOUNT_CONTEXT_PATH,
} = require('../../config/uri');
const {
  claimSubmission,
  mountURL,
} = require('../../config/config-mapping');
const logger = require('../../logger/logger');

const log = logger('app:routes.account.view-your-claim-submission');

const {
  claimTypesShortName,
} = require('../../config/claim-types');

module.exports = (casaApp) => {
  const viewClaimSubmission = async (req, res) => {
    const { awardType } = req.session.claimHistory;
    const { nino } = req.casa.journeyContext.getDataForPage('__hidden_account__').account;
    res.locals.awardType = awardType;
    res.locals.claimId = req.query.id;
    try {
      const result = await axios({
        method: 'post',
        url: 'claim-for-reference-and-nino',
        baseURL: claimSubmission.url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          claimReference: claimTypesShortName[awardType] + req.query.id,
          nino,
        },
      });

      if (result.status === 200) {
        if (result.data.claimStatus !== 'AWAITING_DRS_UPLOAD' && result.data.claimStatus
          !== 'AWAITING_AGENT_APPROVAL' && result.data.claimStatus
          !== 'UPLOADED_TO_DOCUMENT_BATCH') {
          throw new Error(
            `Invalid claim status ${result.data.claimStatus} on view-your-claim-submission`,
          );
        }
        res.locals.claimData = result.data;

        return res.render('pages/account/view-your-claim-submission.njk');
      }

      throw new Error('Unexpected status from API');
    } catch (error) {
      log.error(
        `Error getting claims submission data for nino and ${awardType} with error ${error}`,
        error,
      );
      if(mountURL.includes('/claim')){
        return res.redirect(`${mountURL}problem-with-service`);
      }
    }
  };

  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/view-your-claim-submission`, casaApp.csrfMiddleware, viewClaimSubmission);

  return { viewClaimSubmission };
};
