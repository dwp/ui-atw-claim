const axios = require('axios');
const {
  ACCOUNT_CONTEXT_PATH,
} = require('../../config/uri');
const { claimSubmission } = require('../../config/config-mapping');
const logger = require('../../logger/logger');

const log = logger('app:routes.account.home');

module.exports = (casaApp) => {
  const getPage = async (req, res) => {
    const { account } = req.casa.journeyContext.getDataForPage('__hidden_account__');
    log.debug(account);
    res.locals.fullName = `${account.claimant.forename} ${account.claimant.surname}`;

    let listOfRejectedClaims = 0;

    try {
      const result = await axios({
        method: 'post',
        url: '/count-rejected-claims-by-claim-type',
        baseURL: claimSubmission.url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: { nino: account.nino },
      });

      if (result.status === 200) {
        listOfRejectedClaims = result.data;
      } else {
        log.error(`Unexpected status code ${result.status}`);
      }
    } catch (e) {
      if (e.response?.status === 404) {
        log.debug('No rejected claims found');
      } else {
        log.error('Error getting rejected claims count for account', e);
      }
    }

    function totalAmountOfRejectedClaims(claimsArray) {
      let sum = 0;
      for (let index = 0; index < claimsArray.length; index++) {
        sum += claimsArray[index].count;
      }
      return sum;
    }

    res.locals.numberOfRejectedClaims = totalAmountOfRejectedClaims(listOfRejectedClaims);
    req.session.listOfRejectedClaims = listOfRejectedClaims;
    res.locals.email = account.claimant.email;
    res.render('pages/account/home.njk');
  };

  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/home`, casaApp.csrfMiddleware, getPage);

  return {
    getPage,
  };
};
