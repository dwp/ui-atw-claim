/* eslint-disable no-param-reassign */
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const {
  GRANT_ROOT_URL,
  ACCOUNT_ROOT_URL,
} = require('../../../config/uri');
const { claimTypesFullName } = require('../../../config/claim-types');
const fieldValidators = require('../../field-validators/pre/multiple-grants-summary');
const filterGrantsForActiveOnly = require('../../../lib/utils/filter-claims');

module.exports = () => ({
  view: 'pages/account/multiple-grants-summary.njk',
  fieldValidators,
  hooks: {
    prerender: async (req, res, next) => {
      const grantAwards = req.casa.journeyContext.getDataForPage('__hidden_account__').account.elements;
      const uniqueGrants = filterGrantsForActiveOnly(grantAwards);

      function getAllClaimTypes(claims) {
        const claimTypes = [];
        for (let index = 0; index < claims.length; index++) {
          claimTypes.push(claims[index].claimType);
        }
        return claimTypes;
      }
      const listOfClaimTypes = getAllClaimTypes(uniqueGrants);
      const uniqueClaimTypes = [...new Set(listOfClaimTypes)];

      if (uniqueGrants.length === 1 || uniqueClaimTypes.length === 1) {
        req.session.grantSummary = { awardType: uniqueGrants[0].claimType };
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        return req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`${GRANT_ROOT_URL}/grant-summary`);
        });
      }

      function userEligible(claimType) {
        return Object.values(uniqueGrants)
          .some((grant) => grant.claimType === claimType);
      }

      res.locals.eligibleForEa = userEligible(claimTypesFullName.EA);
      res.locals.eligibleForSw = userEligible(claimTypesFullName.SW);
      res.locals.eligibleForTtw = userEligible(claimTypesFullName.TW);
      res.locals.grants = uniqueGrants;

      return next();
    },
    postvalidate: (req, res, next) => {
      const { selectClaimType } = req.casa.journeyContext.getDataForPage(
        'multiple-grant-select',
      );
      req.session.grantSummary = { awardType: selectClaimType };
      JourneyContext.putContext(req.session, req.casa.journeyContext);

      if (selectClaimType === 'other') {
        return req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`${ACCOUNT_ROOT_URL}/contact-access-to-work`);
        });
      }
      req.session.save((err) => {
        if (err) {
          throw err;
        }
        return next();
      });
    },
  },
});
