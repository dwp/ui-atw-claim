const {
  CLAIM_ROOT_URL,
  ACCOUNT_CONTEXT_PATH,
} = require('../../config/uri');
const { claimTypesFullName } = require('../../config/claim-types');
const multipleClaimsExitManifest = require('../../locales/en/multiple-claims-exit.json');

const claimTypeToHeadingTokenMap = {
  [claimTypesFullName.EA]: multipleClaimsExitManifest.h1_se,
  [claimTypesFullName.SW]: multipleClaimsExitManifest.h1_sw,
  [claimTypesFullName.TW]: multipleClaimsExitManifest.h1_tw,
};

const constructHeadingString = (grants) => {
  const headingTokensFromClaimTypes = Object.values(grants)
    .map((grant) => claimTypeToHeadingTokenMap[grant.claimType]);

  const uniqueHeadingTokens = [...new Set(headingTokensFromClaimTypes)];

  return uniqueHeadingTokens.join(' or ');
};

module.exports = (casaApp) => {
  const getPage = (req, res) => {
    const { elements: grants } = req.casa.journeyContext.getDataForPage('__hidden_account__').account;
    res.locals.casa.journeyPreviousUrl = `${CLAIM_ROOT_URL}/select-support-to-claim`;

    res.locals.headingString = constructHeadingString(grants);

    return res.render('pages/account/multiple-claims-exit.njk');
  };

  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/multiple-claims-exit`, casaApp.csrfMiddleware, getPage);

  return {
    getPage,
  };
};
