const axios = require('axios');
const logger = require('../logger/logger');

const log = logger('app:routes.amend-declaration');

const {
  claimSubmission,
  mountURL,
} = require('../config/config-mapping');
const {
  WORKPLACE_CONTACT_URL,
  ACCOUNT_ROOT_URL,
} = require('../config/uri');
const { claimTypesShortName } = require('../config/claim-types');

async function amendClaim(data) {
  return axios({
    method: 'put',
    url: '/update-workplace-contact-details',
    baseURL: claimSubmission.url,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
  });
}

module.exports = () => {
  const declarationGet = (req, res, declarationVersion) => {
    const filledIn = req.casa.journeyContext.getDataForPage(
      'amend-confirmer-details',
    );
    const filledInAndValid = req.casa.journeyContext.getValidationErrorsForPage(
      'amend-confirmer-details',
    );
    if (Object.keys(filledInAndValid).length === 0
      && (filledIn && Object.keys(filledIn).length > 0)) {
      const { journeyType } = req.casa.journeyContext.getDataForPage('__journey_type__');

      res.locals.casa.journeyPreviousUrl = `${WORKPLACE_CONTACT_URL}/amend-check-confirmer-details`;

      res.locals.journeyType = journeyType;
      res.locals.BUTTON_TEXT = res.locals.t('declaration:continueButton');
      res.locals.noNextButton = true;

      if (declarationVersion === 1.0) {
        return res.render('pages/common/declaration/1.0/declaration.njk');
      }
      throw new Error(`Declaration version ${declarationVersion} not supported`);
    }
    return res.redirect(`${ACCOUNT_ROOT_URL}/home`);
  };

  const declarationPut = async (req, res, declarationVersion) => {
    if (declarationVersion === undefined) {
      throw new Error('Declaration version not defined');
    }

    const { awardType } = req.session.claimHistory;
    const workplaceContactDetails = req.casa.journeyContext.getDataForPage('amend-confirmer-details');
    const { nino } = req.casa.journeyContext.getDataForPage('__hidden_account__').account;

    const claim = {
      nino,
      claimReference: claimTypesShortName[awardType] + req.session.claimId,
      workplaceContact:
      {
        fullName: workplaceContactDetails.fullName,
        emailAddress: workplaceContactDetails.emailAddress,
      },
    };

    try {
      const result = await amendClaim(claim);

      if (result.status === 204) {
        return res.redirect(`${mountURL}claim-amended`);
      }
      log.error(`Unexpected return status: ${result.status}`);
      return res.redirect(`${mountURL}problem-with-service`);
    } catch (e) {
      log.error(`Failed to send claim: ${e.message}`);
      return res.redirect(`${mountURL}problem-with-service`);
    }
  };

  return {
    declarationGet,
    declarationPut,
  };
};
