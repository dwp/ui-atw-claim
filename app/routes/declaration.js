/* eslint-disable no-param-reassign,dot-notation */
const deepcopy = require('deepcopy');
const axios = require('axios');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const logger = require('../logger/logger');

const log = logger('app:routes.declaration');

const {
  claimSubmission,
  mountURL,
} = require('../config/config-mapping');
const avMappings = require('../definitions/pages/vehicle-adaptations/_mappings');
const eaMappings = require('../definitions/pages/equipment-or-adaptation/_mappings');
const swMappings = require('../definitions/pages/support-worker/_mappings');
const twMappings = require('../definitions/pages/travel-to-work/_mappings');
const tiwMappings = require('../definitions/pages/travel-in-work/_mappings');
const cleanClaimData = require('../utils/clean-claim-data');
const mapClaimData = require('../utils/map-claim-data');
const {
  claimTypesFullName,

} = require('../config/claim-types');
const {
  ADAPTATION_TO_VEHICLE_ROOT_URL,
  EQUIPMENT_OR_ADAPTATION_ROOT_URL,
  SUPPORT_WORKER_ROOT_URL,
  TRAVEL_TO_WORK_ROOT_URL,
  TRAVEL_IN_WORK_ROOT_URL,
} = require('../config/uri');

module.exports = () => {
  const declarationGet = (req, res, declarationVersion) => {
    const filledIn = req.casa.journeyContext.getDataForPage('check-your-answers');
    const filledInAndValid = req.casa.journeyContext.getValidationErrorsForPage('check-your-answers');

    if (Object.keys(filledInAndValid).length === 0
      && (filledIn && Object.keys(filledIn).length > 0)) {
      const { journeyType } = req.casa.journeyContext.getDataForPage('__journey_type__');
      if (journeyType === claimTypesFullName.AV) {
        res.locals.casa.journeyPreviousUrl = `${ADAPTATION_TO_VEHICLE_ROOT_URL}/check-your-answers`;
      } else if (journeyType === claimTypesFullName.EA) {
        res.locals.casa.journeyPreviousUrl = `${EQUIPMENT_OR_ADAPTATION_ROOT_URL}/check-your-answers`;
      } else if (journeyType === claimTypesFullName.SW) {
        res.locals.casa.journeyPreviousUrl = `${SUPPORT_WORKER_ROOT_URL}/check-your-answers`;
      } else if (journeyType === claimTypesFullName.TW) {
        res.locals.casa.journeyPreviousUrl = `${TRAVEL_TO_WORK_ROOT_URL}/check-your-answers`;
      } else if (journeyType === claimTypesFullName.TIW) {
        res.locals.casa.journeyPreviousUrl = `${TRAVEL_IN_WORK_ROOT_URL}/check-your-answers`;
      } else {
        throw new Error('Unsupported journeyType for back link');
      }
      res.locals.showSectionHeader = true;
      res.locals.journeyType = journeyType;
      if (res.locals.journeyType === claimTypesFullName.TW) {
        res.locals.howDidYouTravelForWork = req.casa.journeyContext.getDataForPage('which-journey-type').howDidYouTravelForWork;
      }
      res.locals.BUTTON_TEXT = res.locals.t('declaration:continueButton');
      res.locals.noNextButton = true;

      if (declarationVersion === 1.0) {
        return res.render('pages/common/declaration/1.0/declaration.njk');
      }
      throw new Error(`Declaration version ${declarationVersion} not supported`);
    }
    log.error('Declaration prerequisites not met');
    return res.redirect(`${mountURL}problem-with-service`);
  };

  const declarationPost = async (req, res, declarationVersion) => {
    if (declarationVersion === undefined) {
      throw new Error('Declaration version not defined');
    }
    const journeyData = req.casa.journeyContext.data;
    const data = deepcopy(journeyData);
    const previousClaim = journeyData['__previous_claim__'];

    const { journeyType } = journeyData['__journey_type__'];
    const { account } = journeyData['__hidden_account__'];
    const { company, nonAtwCost } = journeyData['__grant_being_claimed__'];
    const { nino } = account;
  
    const claim = {
      nino,
      claimType: journeyType,
      declarationVersion,
      journeyContext: req.casa.journeyContext.toObject(),
    };

    Object.entries(data).forEach((entry) => {
      const [key, pageData] = entry;
      const cleaned = cleanClaimData(pageData);
      if (cleaned) {
        let mappings;
        if (journeyType === claimTypesFullName.AV) {
          mappings = avMappings.mappings;
        } else if (journeyType === claimTypesFullName.EA) {
          mappings = eaMappings.mappings;
        } else if (journeyType === claimTypesFullName.SW) {
          mappings = swMappings.mappings;
        } else if (journeyType === claimTypesFullName.TW) {
          mappings = twMappings.mappings;
        } else if (journeyType === claimTypesFullName.TIW) {
          mappings = tiwMappings.mappings;
        } else {
          throw Error('invalid journeyType');
        }
        mapClaimData(claim, key, cleaned, mappings);
      }
    });

    log.debug('Sending claim...');

    // Add session data
    if (journeyType === claimTypesFullName.TIW) {
      const { cost } = journeyData['total-cost'];
      claim.cost = cost;
    }

    claim.atwNumber = account.atwNumber;
    claim.hasContributions = (nonAtwCost ?? 0) > 0;
    claim.claimant = {
      forename: account.claimant.forename,
      surname: account.claimant.surname,
      dateOfBirth: account.claimant.dateOfBirth,
      emailAddress: account.claimant.email,
      homeNumber: account.claimant.homeNumber,
      mobileNumber: account.claimant.mobileNumber,
      company,
      address: account.claimant.address,
    };

    log.debug(claim);

    axios({
      method: 'post',
      url: '/submit',
      baseURL: claimSubmission.url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: claim,
    }).then((response) => {
      log.debug(
        `Claim successfully submitted successfully, claimNumber ${response.data.claimNumber}`,
      );
      log.debug(
        `Claim successfully submitted successfully, claimType ${response.data.claimType}`,
      );

      req.casa.journeyContext.setDataForPage('transactionDetails', {
        claimType: response.data.claimType,
        claimNumber: response.data.claimNumber,
      });
      JourneyContext.putContext(req.session, req.casa.journeyContext);

      req.session.save((err) => {
        if (err) {
          throw err;
        }

        if (previousClaim !== undefined) {
          return res.redirect(`${mountURL}claim-amended`);
        }
        return res.redirect(`${mountURL}claim-submitted`);
      });
    }).catch((error) => {
      log.error(`Failed to send claim: ${error.message}`);
      return res.redirect(`${mountURL}problem-with-service`);
    });
  };

  return {
    declarationGet,
    declarationPost,
  };
};