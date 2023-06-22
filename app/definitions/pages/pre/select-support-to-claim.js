/* eslint-disable no-param-reassign */
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const {
  ACCOUNT_ROOT_URL,
  EQUIPMENT_OR_ADAPTATION_ROOT_URL,
  SUPPORT_WORKER_ROOT_URL,
  TRAVEL_TO_WORK_ROOT_URL,
  CLAIM_ROOT_URL,
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
      return `${EQUIPMENT_OR_ADAPTATION_ROOT_URL}/equipment-or-adaptation-claim`;
    case claimTypesFullName.SW:
      return `${SUPPORT_WORKER_ROOT_URL}/support-worker-claim`;
    case claimTypesFullName.TW:
      return `${TRAVEL_TO_WORK_ROOT_URL}/work-travel-claim`;
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
      req.casa.journeyContext.setDataForPage('equipment-or-adaptation-claim', {
        claimingEquipment: 'yes',
      });
      req.casa.journeyContext.clearValidationErrorsForPage('equipment-or-adaptation-claim');

      return `${EQUIPMENT_OR_ADAPTATION_ROOT_URL}/your-equipment-or-adaptation-grant`;
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

        const allGrants = req.casa.journeyContext.getDataForPage(
          '__hidden_account__',
        ).account.elements;

        const activeClaims = filterGrantsForActiveOnly(allGrants);
        const numberOfGrantTypes = activeClaims.length;

        if (numberOfGrantTypes === 1) {
          const firstGrant = allGrants.find((grant) => grant.id === activeClaims[0].id);
          req.casa.journeyContext.setDataForPage('__grant_being_claimed__', firstGrant);
          JourneyContext.putContext(req.session, req.casa.journeyContext);

          req.session.save((err) => {
            if (err) {
              throw err;
            }
            res.redirect(getFirstPageOfJourney(res, firstGrant.claimType));
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
