 
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const {
  ACCOUNT_ROOT_URL,
  PAYMENTS_ROOT_URL
} = require('../../../config/uri');
const { claimTypesFullName } = require('../../../config/claim-types');
const fieldValidators = require('../../field-validators/pre/multiple-payments-claims-history');

module.exports = () => ({
  view: 'pages/account/multiple-payments-claims-history.njk',
  fieldValidators,
  hooks: {
    prerender: async (req, res, next) => {
      const userGrants = req.casa.journeyContext.getDataForPage(
        '__hidden_account__',
      ).account.elements;

      const numberOfGrantTypes = userGrants.length;
      const { listOfRejectedClaims } = req.session;

      function getRejectedClaimByType(type, rejectedClaims) {
        return Array.isArray(rejectedClaims)
          ? rejectedClaims.find((ob) => ob.claimType === type) : 0;
      }

      if (listOfRejectedClaims) {
        const sw = getRejectedClaimByType(claimTypesFullName.SW, listOfRejectedClaims);
        const tw = getRejectedClaimByType(claimTypesFullName.TW, listOfRejectedClaims);
        const tiw = getRejectedClaimByType(claimTypesFullName.TIW, listOfRejectedClaims);
        res.locals.numberOfRejectedClaimsSW = sw?.count ?? 0;
        res.locals.numberOfRejectedClaimsTW = tw?.count ?? 0;
        res.locals.numberOfRejectedClaimsTIW = tiw?.count ?? 0;
      }

      function getAllClaimTypes(claims) {
        const claimTypes = [];
        for (let index = 0; index < claims.length; index++) {
          claimTypes.push(claims[index].claimType);
        }
        return claimTypes;
      }
      const listOfClaimTypes = getAllClaimTypes(userGrants);
      const uniqueClaimTypes = [...new Set(listOfClaimTypes)];

      if (uniqueClaimTypes.length === 0) {
        return res.redirect(`${ACCOUNT_ROOT_URL}/no-award-claims`);
      }

      if (numberOfGrantTypes === 1 || uniqueClaimTypes.length === 1) {
        req.session.claimHistory = { awardType: userGrants[0].claimType };
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        return req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`${PAYMENTS_ROOT_URL}/your-claims-payments`);
        });
      }

      function userEligible(claimType) {
        return Object.values(userGrants)
          .some((grant) => grant.claimType === claimType);
      }

      res.locals.eligibleForAtv = userEligible(claimTypesFullName.AV);
      res.locals.eligibleForEa = userEligible(claimTypesFullName.EA);
      res.locals.eligibleForSw = userEligible(claimTypesFullName.SW);
      res.locals.eligibleForTtw = userEligible(claimTypesFullName.TW);
      res.locals.eligibleForTiw = userEligible(claimTypesFullName.TIW);
      return next();
    },
    postvalidate: (req, res, next) => {
      const pageDetails = req.casa.journeyContext.getDataForPage(
        'select-payments-to-view',
      );
      const { selectClaimType } = pageDetails
      req.session.claimHistory = { awardType: selectClaimType };
      JourneyContext.putContext(req.session, req.casa.journeyContext);

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        return next();
      });
    },
  },
});
