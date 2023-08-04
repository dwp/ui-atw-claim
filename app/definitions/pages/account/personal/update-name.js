const fieldValidators = require('../../../field-validators/common/personal/update-name');
const { PERSONAL_INFORMATION_URL } = require('../../../../config/uri');
const { stashStateForPage } = require('../../../../utils/stash-util');

const removePrePopulatedData = (req) => {
  stashStateForPage(req, 'update-name');
  req.casa.journeyContext.setDataForPage('update-name', undefined);
};

module.exports = () => ({
  view: 'pages/account/personal/update-name.njk',
  reviewBlockView: 'pages/account/personal/review/review.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      removePrePopulatedData(req);
      res.locals.forceShowBackButton = true;
      res.locals.casa.journeyPreviousUrl = `${PERSONAL_INFORMATION_URL}/change-personal-details`;
      next();
    },
  },
});
