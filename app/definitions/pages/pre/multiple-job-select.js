/* eslint-disable no-param-reassign */
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const {
  GRANT_ROOT_URL,
  ACCOUNT_ROOT_URL,
} = require('../../../config/uri');

const fieldValidators = require('../../field-validators/pre/multiple-job-select');
const filterGrantsForActiveOnly = require('../../../lib/utils/filter-claims');

module.exports = () => ({
  view: 'pages/account/multiple-job-select.njk',
  fieldValidators,
  hooks: {
    prerender: async (req, res, next) => {
      const { awardType } = { ...req.session.grantSummary };

      const elements = req.casa.journeyContext.getDataForPage('__hidden_account__').account.elements;
      const grants = elements.filter((element) => element.claimType == awardType);
      const uniqueGrants = filterGrantsForActiveOnly(grants);

      if (uniqueGrants.length === 1) {
        req.session.grantsToShow = { grants: uniqueGrants };
        JourneyContext.putContext(req.session, req.casa.journeyContext);
        return req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`${GRANT_ROOT_URL}/grant-summary`);
        });
      }
      
      const jobs = [];
      for (let index = 0; index < uniqueGrants.length; index++) {
        if (uniqueGrants[index].claimType === awardType) {
          jobs.push(uniqueGrants[index].company);
        }
      }
      
      req.session.grantsToShow = { grants: uniqueGrants };
      JourneyContext.putContext(req.session, req.casa.journeyContext);
      res.locals.jobs = [...new Set(jobs)];;

      return next();
    },
    postvalidate: (req, res, next) => {
      const { selectJob } = req.casa.journeyContext.getDataForPage(
        'multiple-job-select',
      );
      req.session.selectedJob = { job: selectJob };
      JourneyContext.putContext(req.session, req.casa.journeyContext);

      if (selectJob === 'other') {
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
