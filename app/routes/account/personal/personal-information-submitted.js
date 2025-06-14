const {
  ACCOUNT_ROOT_URL,
  PERSONAL_INFORMATION_CONTEXT_PATH,
} = require('../../../config/uri');
const { endSessionWhilePreservingAccountData } = require('../../../lib/utils/session-helper');

module.exports = (casaApp) => {
  const personalInformationSubmitted = (req, res) => {
    // redo the gate keeping once Plan is done
    res.locals.BUTTON_TEXT = res.locals.t('common:returnToPersonalInformationHome');

    const filledIn = req.casa.journeyContext.getDataForPage(
      'change-personal-details',
    );

    const filledInAndValid = req.casa.journeyContext.getValidationErrorsForPage(
      'change-personal-details',
    );

    if (Object.keys(filledInAndValid).length === 0
      && (filledIn && Object.keys(filledIn).length > 0)) {
      endSessionWhilePreservingAccountData(
        casaApp,
        req,
        res,
        'pages/account/personal/personal-information-submitted.njk',
      );
    } else if (res.locals.currentUrl && res.locals.currentUrl.includes('lang=')) {
      return res.render('pages/account/personal/personal-information-submitted.njk');
    } else {
      res.redirect(`${ACCOUNT_ROOT_URL}/home`);
    }
  };

  casaApp.router.get(
    `${PERSONAL_INFORMATION_CONTEXT_PATH}/personal-details-submitted`,
    casaApp.csrfMiddleware,
    personalInformationSubmitted,
  );

  return personalInformationSubmitted;
};
