/* eslint-disable no-underscore-dangle */
const {
  isYes,
  isNo,
  isEqualTo,
} = require('../../helpers/journey-helpers');
const payeeDetails = require('./common/payee-details');

const {
  TRAVEL_IN_WORK_CONTEXT_PATH,
} = require('../../config/uri');
const {
  claimTypesFullName,
} = require('../../config/claim-types');

const evidenceRoutes = require('./common/evidence');

const travelInWork = (plan) => {
  plan.setRoute(
    'during-work-travel-claim',
    'your-travel-during-work-grant',
    isYes('claimingTravelInWork', 'during-work-travel-claim'),
  );

  plan.setRoute('your-travel-during-work-grant', 'what-you-need-to-make-claim');

  plan.setRoute(
    'what-you-need-to-make-claim',
    'travel-claim-month',
    isEqualTo('journeyType', claimTypesFullName.TIW, '__journey_type__'),
  );

  // plan.setRoute('travel-claim-month', 'receipts-invoices');
  plan.addSequence(
    'travel-claim-month',
    'journey-number',
    'journey-details',
    'taxi-journeys-summary'
  );

  plan.setRoute(
    'taxi-journeys-summary',
    'travel-claim-month',
    (r, c) => isYes('anotherMonth', 'taxi-journeys-summary')(r, c),
  );

  plan.setRoute(
    'taxi-journeys-summary',
    'remove-tiw-month',
    (r, c) => (c.data['remove-month']?.removeId === true),
  );
  plan.setRoute('remove-tiw-month', 'taxi-journeys-summary');

  plan.setRoute(
    'taxi-journeys-summary',
    'total-mileage',
    (r, c) => isNo('anotherMonth', 'taxi-journeys-summary')(r, c),
  );

  plan.setRoute('total-mileage', 'receipts-invoices');
 
  evidenceRoutes(plan);
  payeeDetails(plan);

  plan.setRoute(
    'employment-status',
    'check-your-answers',
    isEqualTo('employmentStatus', 'selfEmployed', 'employment-status'),
  );

  plan.setRoute(
    'employment-status',
    'confirmer-details',
    isEqualTo('employmentStatus', 'employed', 'employment-status'),
  );

  plan.addSequence(
    'confirmer-details',
    'check-confirmer-details',
  );

  plan.setRoute(
    'check-confirmer-details',
    'check-your-answers',
    isEqualTo('reviewed', 'true', 'check-confirmer-details'),
  );

  evidenceRoutes(plan);

  plan.addOrigin(TRAVEL_IN_WORK_CONTEXT_PATH.replace('/', ''), 'during-work-travel-claim');
};

module.exports = travelInWork;
