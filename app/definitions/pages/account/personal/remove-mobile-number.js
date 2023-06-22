const fieldValidators = require('../../../field-validators/common/personal/remove-mobile-number');
const { PERSONAL_INFORMATION_URL } = require('../../../../config/uri');

module.exports = () => ({
  view: 'pages/account/personal/remove-mobile-number.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.forceShowBackButton = true;
      res.locals.casa.journeyPreviousUrl = `${PERSONAL_INFORMATION_URL}/telephone-number-change`;
      next();
    },
    postvalidate: (req, res, next) => {
      const pageData = req.casa.journeyContext.getDataForPage('remove-mobile-number');
      if (pageData.removingMobileNumber === 'yes') {
        const summaryPageData = req.casa.journeyContext.getDataForPage('new-mobile-number');
        delete summaryPageData.mobileNumber;
        req.casa.journeyContext.setDataForPage('new-mobile-number', summaryPageData);
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
