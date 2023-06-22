const {
  ACCOUNT_CONTEXT_PATH,
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
    const grantAwards = req.casa.journeyContext.getDataForPage('__hidden_account__').account.elements;
    const activeClaims = filterGrantsForActiveOnly(grantAwards);

    res.locals.grantAwards = activeClaims;

    const employers = [...new Set(activeClaims.map((grant) => grant.company))];

    res.locals.employers = buildEmployersString(employers);
    return res.render('pages/account/about-your-grant.njk');
  };

  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/about-your-grant`, casaApp.csrfMiddleware, getPage);

  return {
    getPage,
  };
};
