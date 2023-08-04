const { trimWhitespace } = require('@dwp/govuk-casa').gatherModifiers;
const fieldValidators = require('../../../field-validators/common/personal/update-your-email-address');
const { PERSONAL_INFORMATION_URL } = require('../../../../config/uri');
const { stashStateForPage } = require('../../../../utils/stash-util');
const removeAllSpaces = require('../../../../utils/remove-all-spaces');

const removePrePopulatedData = (req) => {
  stashStateForPage(req, 'update-your-email-address');
  req.casa.journeyContext.setDataForPage('update-your-email-address', undefined);
};

module.exports = () => ({
  view: 'pages/account/personal/update-your-email-address.njk',
  fieldGatherModifiers: {
    emailAddress: trimWhitespace,
  },
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      removePrePopulatedData(req);
      res.locals.forceShowBackButton = true;
      res.locals.casa.journeyPreviousUrl = `${PERSONAL_INFORMATION_URL}/change-personal-details`;
      next();
    },
    pregather: (req, res, next) => {
      req.body.emailAddress = removeAllSpaces(req.body.emailAddress);
      next();
    },
  },
});
