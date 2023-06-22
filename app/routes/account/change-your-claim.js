const axios = require('axios');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const {
  ACCOUNT_ROOT_URL,
  WORKPLACE_CONTACT_URL,
  ACCOUNT_CONTEXT_PATH,
  SUPPORT_WORKER_ROOT_URL,
  TRAVEL_TO_WORK_ROOT_URL,
} = require('../../config/uri');
const {
  claimSubmission,
  mountURL,
} = require('../../config/config-mapping');
const logger = require('../../logger/logger');

const log = logger('app:routes.account.change-your-claim');

const {
  claimTypesFullName,
  claimTypesShortName,
} = require('../../config/claim-types');

module.exports = (casaApp) => {
  const changeYourClaimGet = async (req, res) => {
    const { awardType } = req.session.claimHistory;
    const { nino } = req.casa.journeyContext.getDataForPage('__hidden_account__').account;
    req.session.claimId = req.query.id;
    res.locals.awardType = awardType;
    res.locals.casa.journeyPreviousUrl = `${ACCOUNT_ROOT_URL}/claims-history`;
    res.locals.workplaceContactBaseUrl = WORKPLACE_CONTACT_URL;

    try {
      if (awardType === claimTypesFullName.SW) {
        res.locals.typeOfClaimString = res.locals.t('change-your-claim:sw');
      } else if (awardType === claimTypesFullName.TW) {
        res.locals.typeOfClaimString = res.locals.t('change-your-claim:tw');
      } else {
        throw new Error(`Invalid award type ${awardType} on about-your-current-claim`);
      }

      const claimReference = claimTypesShortName[awardType] + req.query.id.toString()
        .padStart(8, '0');

      const result = await axios({
        method: 'post',
        url: 'claim-for-reference-and-nino',
        baseURL: claimSubmission.url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          claimReference,
          nino,
        },
      });

      if (result.status === 200) {
        if (result.data.claimStatus !== 'COUNTER_SIGN_REJECTED') {
          throw new Error(
            `Invalid claim status ${result.data.claimStatus} on about-your-current-claim`,
          );
        }

        req.casa.journeyContext.setDataForPage('__claim_to_correct__', result.data);

        res.locals.employmentStatus = result.data.workplaceContact.employmentStatus;
        const claimData = result.data;

        res.locals.dateOfClaim = claimData.createdDate;
        res.locals.claimReferenceNumber = claimReference;
        res.locals.changesYouNeedToMake = claimData.workplaceContact.reason;
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.render('pages/account/change-your-claim.njk');
        });
      } else {
        log.error(
          `Error getting claim data for claim reference ${claimReference} and nino ${nino}`,
        );
        res.redirect(`${mountURL}problem-with-service`);
      }
    } catch (error) {
      log.error(
        `Error getting claims submission data for nino and ${awardType} with error ${error}`,
        error,
      );
      res.redirect(`${mountURL}problem-with-service`);
    }
  };

  const changeYourClaimPost = (req, res) => {
    const {
      id,
      journeyContext,
    } = req.casa.journeyContext.getDataForPage('__claim_to_correct__');

    const { data } = journeyContext;
    const { awardType } = req.session.claimHistory;

    // eslint-disable-next-line no-underscore-dangle
    data.__previous_claim__ = {
      claimId: id,
      claimType: awardType,
    };

    const jc = new JourneyContext(
      data,
      journeyContext.validation,
      journeyContext.nav,
      journeyContext.identity,
    );

    JourneyContext.removeContexts(req.session);
    JourneyContext.putContext(req.session, jc);

    req.session.save((err) => {
      if (err) {
        throw err;
      }

      if (awardType === claimTypesFullName.SW) {
        return res.redirect(`${SUPPORT_WORKER_ROOT_URL}/check-your-answers`);
      }
      if (awardType === claimTypesFullName.TW) {
        return res.redirect(`${TRAVEL_TO_WORK_ROOT_URL}/check-your-answers`);
      }
      return res.redirect(`${mountURL}problem-with-service`);
    });
  };

  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/change-your-claim`, casaApp.csrfMiddleware, changeYourClaimGet);
  casaApp.router.post(`${ACCOUNT_CONTEXT_PATH}/change-your-claim`, casaApp.csrfMiddleware, changeYourClaimPost);

  return {
    changeYourClaimGet,
    changeYourClaimPost,
  };
};
