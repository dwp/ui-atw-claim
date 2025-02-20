
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

const {
  GRANT_CONTEXT_PATH,
  GRANT_ROOT_URL,
  ACCOUNT_ROOT_URL
} = require('../../config/uri');
const filterGrantsForActiveOnly = require('../../lib/utils/filter-claims');

function generateJobs(req, res, uniqueGrants, awardType) {
  const jobs = [];
  for (let index = 0; index < uniqueGrants.length; index++) {
    if (uniqueGrants[index].claimType === awardType) {
      jobs.push(uniqueGrants[index].company);
    }
  }
  req.session.grantsToShow = { grants: uniqueGrants };
  JourneyContext.putContext(req.session, req.casa.journeyContext);
  res.locals.jobs = [...new Set(jobs)];
}

function generateBack(res, elements, grants) {
  res.locals.forceShowBackButton = true;
  if (elements.length == grants.length) {
    res.locals.casa.journeyPreviousUrl = `${ACCOUNT_ROOT_URL}/home`;
  } else {
    res.locals.casa.journeyPreviousUrl = `${GRANT_ROOT_URL}/multiple-grant-select`;
  }
}
module.exports = (casaApp) => {
  const getPage = (req, res) => {
    const { awardType } = { ...req.session.grantSummary };
    const elements = req.casa.journeyContext.getDataForPage('__hidden_account__').account.elements;
    const grants = elements.filter((element) => element.claimType == awardType);
    const uniqueGrants = filterGrantsForActiveOnly(grants);

    generateBack(res, elements, grants);

    if (uniqueGrants.length === 0) {
      return res.redirect(`${GRANT_ROOT_URL}/multiple-grant-select`);
    }

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

    generateJobs(req, res, uniqueGrants, awardType);
    return res.render('pages/account/multiple-job-select.njk');
  };

  const postPage = (req, res) => {

    let errors = Object.create(null);
    let formErrorsGovukArray;

    if (Object.keys(req.body).length == 0) {
      const { awardType } = { ...req.session.grantSummary };
      const elements = req.casa.journeyContext.getDataForPage('__hidden_account__').account.elements;
      const grants = elements.filter((element) => element.claimType == awardType);
      const uniqueGrants = filterGrantsForActiveOnly(grants);

      generateBack(res, elements, grants);
      generateJobs(req, res, uniqueGrants, awardType);

      errors.feedback = [
        {
        inline: 'multiple-job-select:errors.required',
        summary: 'multiple-job-select:errors.required'
      }
    ];

      // Put errors into a format suitable for use with the govuk-error-summary macro
      formErrorsGovukArray = Object.keys(errors || Object.create(null)).map(k => ({
        text: req.i18nTranslator.t(errors[k][0].summary),
        href: '#selectJob-hint',
      }));

      res.render('pages/account/multiple-job-select.njk', {
        formErrors: errors.feedback,
        formErrorsGovukArray: formErrorsGovukArray,
      });
    } else {
      req.casa.journeyContext.setDataForPage('multiple-job-select', req.body);

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

      return req.session.save((err) => {
        if (err) {
          throw err;
        }
        return res.redirect(`/claim/grant/grant-summary`);
      });
    }
  }

    casaApp.router.get(`${GRANT_CONTEXT_PATH}/multiple-job-select`, casaApp.csrfMiddleware, getPage);
    casaApp.router.post(`${GRANT_CONTEXT_PATH}/multiple-job-select`, casaApp.csrfMiddleware, postPage);

  return {getPage, postPage};
};