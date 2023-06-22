/* eslint-disable no-param-reassign,dot-notation */
const deepcopy = require('deepcopy');
const axios = require('axios');
const logger = require('../../../logger/logger');

const log = logger('app:routes.account.personal.new-personal-declaration');

const {
  claimSubmission,
  mountURL,
} = require('../../../config/config-mapping');
const { PERSONAL_INFORMATION_URL } = require('../../../config/uri');

module.exports = () => {
  const newPersonalDeclarationGet = (req, res, declarationVersion) => {
    const filledIn = req.casa.journeyContext.getDataForPage('personal-information-change');
    const filledInAndValid = req.casa.journeyContext.getValidationErrorsForPage(
      'personal-information-change',
    );

    if (Object.keys(filledInAndValid).length === 0
      && (filledIn && Object.keys(filledIn).length > 0)) {
      res.locals.casa.journeyPreviousUrl = `${PERSONAL_INFORMATION_URL}/personal-information-change`;
      res.locals.BUTTON_TEXT = res.locals.t('new-personal-declaration:continueButton');
      res.locals.noNextButton = true;

      if (declarationVersion === 1.0) {
        return res.render('pages/account/personal/declaration/1.0/new-personal-declaration.njk');
      }
      throw new Error(`Declaration version ${declarationVersion} not supported`);
    }
    log.error('Declaration prerequisites not met');
    return res.redirect(`${mountURL}problem-with-service`);
  };

  const newPersonalDeclarationPost = async (req, res, declarationVersion) => {
    if (declarationVersion === undefined) {
      throw new Error('Declaration version not defined');
    }
    const journeyData = req.casa.journeyContext.data;
    const data = deepcopy(journeyData);

    // Data from session (DiSC Data)
    const { account } = data['__hidden_account__'];

    // Data from journey that users have filled in
    const { addressDetails } = data['__hidden_address__'];
    const {
      firstName,
      lastName,
    } = data['update-name'];

    const {
      emailAddress,
    } = data['update-your-email-address'];

    const {
      homeNumber,
    } = data['new-phone-number'];

    const {
      mobileNumber,
    } = data['new-mobile-number'];

    const request = {
      accessToWorkNumber: account.atwNumber,
      nino: account.nino,
      declarationVersion, // TODO,
      currentContactInformation: {
        forename: account.claimant.forename,
        surname: account.claimant.surname,
        dateOfBirth: account.claimant.dateOfBirth,
        emailAddress: account.claimant.email,
        homeNumber: account.claimant.homeNumber,
        mobileNumber: account.claimant.mobileNumber,
        address: {
          address1: account.claimant.address.address1,
          address2: account.claimant.address.address2,
          address3: account.claimant.address.address3,
          address4: account.claimant.address.address4,
          postcode: account.claimant.address.postcode,
        },
      },
      newContactInformation: {
        forename: firstName,
        surname: lastName,
        dateOfBirth: account.claimant.dateOfBirth,
        emailAddress,
        homeNumber,
        mobileNumber,
        address: {
          address1: addressDetails.address1,
          address2: addressDetails.address2,
          address3: addressDetails.address3,
          address4: addressDetails.address4,
          postcode: addressDetails.postcode,
        },
      },
    };

    log.debug(request);

    try {
      const result = await axios({
        method: 'post',
        url: '/update-contact-information',
        baseURL: claimSubmission.url,
        headers: {
          'Content-Type': 'application/json',
        },
        data: request,
      });

      if (result.status === 201) {
        log.debug(
          'Submitted successfully',
        );
        return res.redirect(
          `${PERSONAL_INFORMATION_URL}/personal-information-submitted`,
        );
      }
      log.error(`Unexpected status: ${result.status}`);
      return res.redirect(`${mountURL}problem-with-service`);
    } catch (error) {
      log.error(`Failed to send update: ${error.message}`);
      return res.redirect(`${mountURL}problem-with-service`);
    }
  };
  return {
    newPersonalDeclarationGet,
    newPersonalDeclarationPost,
  };
};
