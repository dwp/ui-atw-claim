const fieldValidators = require('../../../field-validators/common/personal/remove-home-number');
const { PERSONAL_INFORMATION_URL } = require('../../../../config/uri');

module.exports = () => ({
  view: 'pages/account/personal/remove-home-number.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.forceShowBackButton = true;
      res.locals.casa.journeyPreviousUrl = `${PERSONAL_INFORMATION_URL}/telephone-number-change`;
      next();
    },
    postvalidate: (req, res, next) => {
      const pageData = req.casa.journeyContext.getDataForPage('remove-home-number');
      if (pageData.removingHomeNumber === 'yes') {
        const summaryPageData = req.casa.journeyContext.getDataForPage('new-phone-number');
        delete summaryPageData.homeNumber;
        req.casa.journeyContext.setDataForPage('new-phone-number', summaryPageData);
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
