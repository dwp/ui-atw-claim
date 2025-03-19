/* eslint-disable no-underscore-dangle */
const {
  isYes,
  isNo,
  isEqualTo,
} = require('../../helpers/journey-helpers');

const evidenceRoutes = require('./common/evidence');
const payeeDetails = require('./common/payee-details');
const {
  TRAVEL_TO_WORK_CONTEXT_PATH,
} = require('../../config/uri');
const {
  claimTypesFullName,
} = require('../../config/claim-types');

const travelToWork = (plan) => {
  plan.setRoute(
    'work-travel-claim',
    'your-work-travel-grant',
    isYes('claimingTravelToWork', 'work-travel-claim'),
  );
  plan.setRoute(
    'work-travel-claim',
    'grant-only-for-travel-to-work',
    (r, c) => !isYes('claimingTravelToWork', 'work-travel-claim')(r, c),
  );

  plan.setRoute('your-work-travel-grant', 'what-you-need-to-make-claim');
  plan.setRoute(
    'what-you-need-to-make-claim',
    'which-journey-type',
    isEqualTo('journeyType', claimTypesFullName.TW, '__journey_type__'),
  );
  plan.setRoute(
    'which-journey-type',
    'claiming-instructions',
  );
  plan.setRoute(
    'claiming-instructions',
    'travel-month',
    isEqualTo('howDidYouTravelForWork', 'taxi', 'which-journey-type'),
  );
  plan.setRoute(
    'claiming-instructions',
    'journeys-miles',
    isEqualTo('howDidYouTravelForWork', 'lift', 'which-journey-type'),
  );
  plan.setRoute('journeys-miles', 'travel-month');

  plan.addSequence(
    'travel-month',
    'travel-days',
    'journey-summary',
  );

  plan.setRoute(
    'journey-summary',
    'travel-month',
    (r, c) => isYes('anotherMonth', 'journey-summary')(r, c),
  );

  plan.setRoute(
    'journey-summary',
    'taxi-journeys-cost',
    (r, c) => isNo('anotherMonth', 'journey-summary')(r, c)
      && isEqualTo('howDidYouTravelForWork', 'taxi', 'which-journey-type')(r, c),
  );

  plan.setRoute(
    'journey-summary',
    'total-amount-to-be-paid-towards-lift-costs',
    (r, c) => isNo('anotherMonth', 'journey-summary')(r, c)
      && isEqualTo('howDidYouTravelForWork', 'lift', 'which-journey-type')(r, c),
  );

  plan.setRoute(
    'journey-summary',
    'remove-travel-month',
    (r, c) => (c.data['remove-month']?.removeId === true),
  );
  plan.setRoute('remove-travel-month', 'journey-summary');

  plan.setRoute(
    'total-amount-to-be-paid-towards-lift-costs',
    'receipts-invoices',
    isEqualTo('howDidYouTravelForWork', 'taxi', 'which-journey-type'),
  );

  plan.setRoute(
    'total-amount-to-be-paid-towards-lift-costs',
    'person-company-being-paid-details',
    (r, c) => (c.data.__hidden_account__.account.payees.length === 0
      && isEqualTo('howDidYouTravelForWork', 'lift', 'which-journey-type')(r, c)),
  );

  plan.setRoute(
    'total-amount-to-be-paid-towards-lift-costs',
    'person-company-being-paid',
    (r, c) => (c.data.__hidden_account__.account.payees.length > 0
      && isEqualTo('howDidYouTravelForWork', 'lift', 'which-journey-type')(r, c)),
  );

  plan.setRoute(
    'taxi-journeys-cost',
    'receipts-invoices',
  );

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

  plan.addOrigin(TRAVEL_TO_WORK_CONTEXT_PATH.replace('/', ''), 'work-travel-claim');
};

module.exports = travelToWork;
