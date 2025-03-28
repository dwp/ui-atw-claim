/* eslint-disable no-param-reassign */
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const {
  ACCOUNT_ROOT_URL,
  EQUIPMENT_OR_ADAPTATION_ROOT_URL,
  SUPPORT_WORKER_ROOT_URL,
  TRAVEL_TO_WORK_ROOT_URL,
  CLAIM_ROOT_URL,
  ADAPTATION_TO_VEHICLE_ROOT_URL,
  TRAVEL_IN_WORK_ROOT_URL,
} = require('../../../config/uri');
const {
  claimTypesFullName,
} = require('../../../config/claim-types');
const fieldValidators = require('../../field-validators/pre/select-support-to-claim');
const logger = require('../../../logger/logger');
const filterGrantsForActiveOnly = require('../../../lib/utils/filter-claims');

const log = logger('middleware:select-support-to-claim');

function getFirstPageOfJourney(res, grantType) {
  const message = res.locals.t('select-support-to-claim:unsupportedGrantType');
  switch (grantType) {
    case claimTypesFullName.EA:
      return `${EQUIPMENT_OR_ADAPTATION_ROOT_URL}/specialist-equipment-claim`;
    case claimTypesFullName.SW:
      return `${SUPPORT_WORKER_ROOT_URL}/support-worker-claim`;
    case claimTypesFullName.TW:
      return `${TRAVEL_TO_WORK_ROOT_URL}/work-travel-claim`;
    case claimTypesFullName.AV:
      return `${ADAPTATION_TO_VEHICLE_ROOT_URL}/vehicle-adaptations-claim`;
    case claimTypesFullName.TIW:
      return `${TRAVEL_IN_WORK_ROOT_URL}/during-work-travel-claim`;
    default:
      throw Error(message + grantType);
  }
}

function redirectToGrantPage(req, res, grantType) {
  log.debug(
    `Redirecting to grant page for grant type ${grantType} - populating data for page and clearing validation errors`);
  const message = res.locals.t('select-support-to-claim:unsupportedGrantType');
  switch (grantType) {
    case claimTypesFullName.EA:
      req.casa.journeyContext.setDataForPage('specialist-equipment-claim', {
        claimingEquipment: 'yes',
      });
      req.casa.journeyContext.clearValidationErrorsForPage('specialist-equipment-claim');

      return `${EQUIPMENT_OR_ADAPTATION_ROOT_URL}/your-specialist-equipment-grant`;
    case claimTypesFullName.SW:
      req.casa.journeyContext.setDataForPage('support-worker-claim', {
        claimingSupportWorker: 'yes',
      });
      req.casa.journeyContext.clearValidationErrorsForPage('support-worker-claim');
      return `${SUPPORT_WORKER_ROOT_URL}/your-support-worker-grant`;
    case claimTypesFullName.TW:
      req.casa.journeyContext.setDataForPage('work-travel-claim', {
        claimingTravelToWork: 'yes',
      });
      req.casa.journeyContext.clearValidationErrorsForPage('work-travel-claim');
      return `${TRAVEL_TO_WORK_ROOT_URL}/your-work-travel-grant`;
    case claimTypesFullName.AV:
      req.casa.journeyContext.setDataForPage('vehicle-adaptations-claim', {
        claimingAdaptationToVehicle: 'yes',
      });
      req.casa.journeyContext.clearValidationErrorsForPage('vehicle-adaptations-claim')
        return `${ADAPTATION_TO_VEHICLE_ROOT_URL}/your-vehicle-adaptations-grant`;
    case claimTypesFullName.TIW:
      req.casa.journeyContext.setDataForPage('during-work-travel-claim', {
        claimingTravelInWork: 'yes',
      });
      req.casa.journeyContext.clearValidationErrorsForPage('during-work-travel-claim');
        return `${TRAVEL_IN_WORK_ROOT_URL}/your-travel-during-work-grant`;
    default:
      throw Error(message + grantType);
  }
}

  module.exports = () => ({
    view: 'pages/account/select-support-to-claim.njk',
    fieldValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.claimBaseUrl = CLAIM_ROOT_URL;

        const allOfClaimant = req.casa.journeyContext.getDataForPage(
          '__hidden_account__',
        ).account;

        const activeClaims = filterGrantsForActiveOnly(allOfClaimant.elements);
        const numberOfGrantTypes = activeClaims.length;
        const claimant = [];
        let shouldRedirect = false;

        claimant.push(allOfClaimant);

        if (allOfClaimant.elements.length === 0 || activeClaims.length === 0) {
          return res.redirect(`${ACCOUNT_ROOT_URL}/no-awards`);
        }

        const requiredClaimFields = [
          'company',
          'claimType',
          'nonAtwCost'
        ]

        const requiredClaimantNino = [
          'nino',
          'atwNumber'
        ];

        const requiredClaimantFields = [
          'forename',
          'surname'
        ];

        // checking for company, claimtype, nonatwcost
        allOfClaimant.elements.forEach(claim => {
          const missingFieldsClaim = requiredClaimFields.filter(field => !(field in claim) || claim[field] === null || claim[field] === undefined || claim[field].toString().trim() === '');

          if(missingFieldsClaim.length > 0) {
            shouldRedirect = true;
          }
        });

        // checking for nino, forename, surname
        claimant.forEach(claim => {  
          let missingFieldsClaimant = requiredClaimantNino.filter(field => !(field in claim) || claim[field] === null || claim[field] === undefined || claim[field].toString().trim() === '');

          claim = claim.claimant;

          missingFieldsClaimant += requiredClaimantFields.filter(field => !(field in claim) || claim[field] === null || claim[field] === undefined || claim[field].toString().trim() === '');

          if(missingFieldsClaimant.length > 0) {
            shouldRedirect = true;
          }
        });

        if(shouldRedirect == true) {
          return res.redirect(`${ACCOUNT_ROOT_URL}/no-awards`);
        }

        if (numberOfGrantTypes === 1) {
          const firstGrant = allOfClaimant.elements.find((grant) => grant.id === activeClaims[0].id);
          req.casa.journeyContext.setDataForPage('__grant_being_claimed__', firstGrant);
          JourneyContext.putContext(req.session, req.casa.journeyContext);

          req.session.save((err) => {
            if (err) {
              throw err;
            }
            return res.redirect(getFirstPageOfJourney(res, firstGrant.claimType));
          });
        } else {
          res.locals.grants = activeClaims;
          res.locals.hideBackButton = true;
          next();
        }
      },
      postvalidate: (req, res) => {
        const selectedRadioValue = req.casa.journeyContext.getDataForPage(
          'select-support-to-claim',
        ).selectSupportToClaim;

        const userGrants = req.casa.journeyContext.getDataForPage(
          '__hidden_account__',
        ).account.elements;
        const numberOfGrantTypes = userGrants.length;

        if (selectedRadioValue === 'other') {
          res.redirect(`${ACCOUNT_ROOT_URL}/multiple-claims-exit`);
        } else {
          const grantBeingClaimed = userGrants.find(
            (grant) => grant.id === parseInt(selectedRadioValue, 10),
          );

          req.casa.journeyContext.setDataForPage('__grant_being_claimed__', grantBeingClaimed);

          const selectedGrantType = grantBeingClaimed.claimType;

          if (numberOfGrantTypes > 1 && selectedGrantType !== 'other') {
            req.session.skipClaimPage = true;
            const redirectUrl = redirectToGrantPage(req, res, selectedGrantType);

            JourneyContext.putContext(req.session, req.casa.journeyContext);

            req.session.save((err) => {
              if (err) {
                throw err;
              }
              res.redirect(redirectUrl);
            });
          } else {
            JourneyContext.putContext(req.session, req.casa.journeyContext);
            req.session.save((err) => {
              if (err) {
                throw err;
              }
              res.redirect(getFirstPageOfJourney(res, selectedGrantType));
            });
          }
        }
      },
    },
  });
