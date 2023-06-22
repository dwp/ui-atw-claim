const fieldValidators = require('../../../field-validators/common/personal/new-mobile-number');
const { PERSONAL_INFORMATION_URL } = require('../../../../config/uri');
const { stashStateForPage } = require('../../../../utils/stash-util');

const removePrePopulatedData = (req) => {
  stashStateForPage(req, 'new-mobile-number');
  req.casa.journeyContext.setDataForPage('new-mobile-number', undefined);
};

module.exports = () => ({
  view: 'pages/account/personal/new-mobile-number.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      removePrePopulatedData(req);
      res.locals.forceShowBackButton = true;
      res.locals.casa.journeyPreviousUrl = `${PERSONAL_INFORMATION_URL}/telephone-number-change`;
      next();
    },
  },
});
