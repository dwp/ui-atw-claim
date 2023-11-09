const {
  GRANT_CONTEXT_PATH,
  GRANT_ROOT_URL
} = require('../../config/uri');
const filterGrantsForActiveOnly = require('../../lib/utils/filter-claims');

const buildEmployersString = (employers) => {
  if (employers.length > 1) {
    const lastEmployer = employers.pop();
    return `${employers.join(', ')} and ${lastEmployer}`;
  }
  return employers.toString();
};

module.exports = (casaApp) => {
  const getPage = (req, res) => {

    const { job } = { ...req.session.selectedJob };
    const { grants } = { ...req.session.grantsToShow };

    let activeClaims;

    if (grants === undefined) {
      activeClaims = filterGrantsForActiveOnly(
        req.casa.journeyContext.getDataForPage('__hidden_account__').account.elements);
    } else {
      if (grants.length == 1) {
        activeClaims = filterGrantsForActiveOnly(grants);
        res.locals.casa.journeyPreviousUrl = `${GRANT_ROOT_URL}/multiple-grant-select`;
      } else {
        activeClaims = filterGrantsForActiveOnly(grants.filter((grant) => grant.company == job));
        res.locals.casa.journeyPreviousUrl = `${GRANT_ROOT_URL}/multiple-job-select`;
      }
    }

    res.locals.grantAwards = activeClaims;


    const employers = [...new Set(activeClaims.map((grant) => grant.company))];

    res.locals.employers = buildEmployersString(employers);
    return res.render('pages/account/about-your-grant.njk');
  };

  casaApp.router.get(`${GRANT_CONTEXT_PATH}/grant-summary`, casaApp.csrfMiddleware, getPage);

  return {
    getPage,
  };
};
