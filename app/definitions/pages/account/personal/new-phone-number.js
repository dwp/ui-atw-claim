const fieldValidators = require('../../../field-validators/common/personal/new-phone-number');
const { PERSONAL_INFORMATION_URL } = require('../../../../config/uri');
const { stashStateForPage } = require('../../../../utils/stash-util');

const removePrePopulatedData = (req) => {
  stashStateForPage(req, 'new-phone-number');
  req.casa.journeyContext.setDataForPage('new-phone-number', undefined);
};

module.exports = () => ({
  view: 'pages/account/personal/new-phone-number.njk',
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
