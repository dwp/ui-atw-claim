const axios = require('axios');
const {
  WORKPLACE_CONTACT_URL,
  ACCOUNT_CONTEXT_PATH,
} = require('../../config/uri');
const {
  claimSubmission,
  mountURL,
} = require('../../config/config-mapping');
const logger = require('../../logger/logger');

const log = logger('app:routes.account.about-your-current-claim');

const {
  claimTypesShortName,
} = require('../../config/claim-types');

module.exports = (casaApp) => {
  const aboutYourCurrentClaim = async (req, res) => {
    const { awardType } = req.session.claimHistory;
    const { nino } = req.casa.journeyContext.getDataForPage('__hidden_account__').account;
    req.session.claimId = req.query.id;
    res.locals.awardType = awardType;
    res.locals.workplaceContactBaseUrl = WORKPLACE_CONTACT_URL;
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
        if (result.data.claimStatus !== 'AWAITING_COUNTER_SIGN') {
          const messageOne = res.locals.t('about-your-current-claim:claimStatusInvalidClaim.p1');
          const messageTwo = res.locals.t('about-your-current-claim:claimStatusInvalidClaim.p2');
          throw new Error(
            messageOne + result.data.claimStatus + messageTwo,
          );
        }

        res.locals.employmentStatus = result.data.workplaceContact.employmentStatus;
        res.locals.claimData = result.data;
        req.casa.journeyContext.setDataForPage('previous-url', req.originalUrl);
        req.casa.journeyContext.setDataForPage('__journey_type__', { journeyType: res.locals.awardType });
        return res.render('pages/account/about-your-current-claim.njk');
      }

      throw new Error(res.locals.t('about-your-current-claim:claimStatusAPIError'));
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

  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/about-your-current-claim`, casaApp.csrfMiddleware, aboutYourCurrentClaim);

  return { aboutYourCurrentClaim };
};

