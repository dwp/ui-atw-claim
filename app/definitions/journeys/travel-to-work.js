/* eslint-disable no-underscore-dangle */
const {
  isYes,
  isNo,
  isEqualTo,
  isGreaterThan,
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
    'grant-only-for-travel-to-work-costs',
    (r, c) => !isYes('claimingTravelToWork', 'work-travel-claim')(r, c),
  );

  plan.setRoute('your-work-travel-grant', 'what-you-will-need-to-submit-a-claim');
  plan.setRoute(
    'what-you-will-need-to-submit-a-claim',
    'how-did-you-travel-for-work',
    isEqualTo('journeyType', claimTypesFullName.TW, '__journey_type__'),
  );
  plan.setRoute(
    'how-did-you-travel-for-work',
    'month-claiming-travel-for-work',
    isEqualTo('howDidYouTravelForWork', 'taxi', 'how-did-you-travel-for-work'),
  );
  plan.setRoute(
    'how-did-you-travel-for-work',
    'journey-or-mileage',
    isEqualTo('howDidYouTravelForWork', 'lift', 'how-did-you-travel-for-work'),
  );
  plan.setRoute('journey-or-mileage', 'month-claiming-travel-for-work');

  plan.addSequence(
    'month-claiming-travel-for-work',
    'days-you-travelled-for-work',
    'journey-summary',
  );

  plan.setRoute(
    'journey-summary',
    'month-claiming-travel-for-work',
    (r, c) => isYes('anotherMonth', 'journey-summary')(r, c)
      && (c.data['remove-month-of-travel']?.removeId === undefined),
  );

  plan.setRoute(
    'journey-summary',
    'cost-of-taxi-journeys',
    (r, c) => isNo('anotherMonth', 'journey-summary')(r, c)
      && (c.data['remove-month-of-travel']?.removeId === undefined)
      && isEqualTo('howDidYouTravelForWork', 'taxi', 'how-did-you-travel-for-work')(r, c),
  );
  plan.setRoute(
    'journey-summary',
    'total-amount-to-be-paid-towards-lift-costs',
    (r, c) => isNo('anotherMonth', 'journey-summary')(r, c)
      && (c.data['remove-month-of-travel']?.removeId === undefined)
      && isEqualTo('howDidYouTravelForWork', 'lift', 'how-did-you-travel-for-work')(r, c),
  );

  plan.setRoute(
    'total-amount-to-be-paid-towards-lift-costs',
    'getting-digital-receipts-or-invoices',
    isEqualTo('howDidYouTravelForWork', 'taxi', 'how-did-you-travel-for-work'),
  );

  plan.setRoute(
    'total-amount-to-be-paid-towards-lift-costs',
    'about-needs-to-be-paid',
    (r, c) => (c.data.__hidden_account__.account.payees.length === 0
      && isEqualTo('howDidYouTravelForWork', 'lift', 'how-did-you-travel-for-work')(r, c)),
  );

  plan.setRoute(
    'total-amount-to-be-paid-towards-lift-costs',
    'about-the-person-or-company-being-paid',
    (r, c) => (c.data.__hidden_account__.account.payees.length > 0
      && isEqualTo('howDidYouTravelForWork', 'lift', 'how-did-you-travel-for-work')(r, c)),
  );

  plan.setRoute(
    'journey-summary',
    'remove-month-of-travel',
    (r, c) => (c.data['remove-month-of-travel']?.removeId !== undefined),
  );
  plan.setRoute('remove-month-of-travel', 'journey-summary');

  plan.setRoute(
    'cost-of-taxi-journeys',
    'total-amount-to-be-paid-towards-work-travel-costs',
    isGreaterThan('nonAtwCost', 0, '__grant_being_claimed__'),
  );
  plan.setRoute(
    'total-amount-to-be-paid-towards-work-travel-costs',
    'getting-digital-receipts-or-invoices',
  );

  plan.setRoute(
    'cost-of-taxi-journeys',
    'getting-digital-receipts-or-invoices',
    (r, c) => !isGreaterThan('nonAtwCost', 0, '__grant_being_claimed__')(r, c),
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
    'details-of-someone-who-can-confirm-costs',
    isEqualTo('employmentStatus', 'employed', 'employment-status'),
  );

  plan.addSequence(
    'details-of-someone-who-can-confirm-costs',
    'confirm-workplace-contact-details',
  );

  plan.setRoute(
    'confirm-workplace-contact-details',
    'check-your-answers',
    isEqualTo('reviewed', 'true', 'confirm-workplace-contact-details'),
  );

  plan.addOrigin(TRAVEL_TO_WORK_CONTEXT_PATH.replace('/', ''), 'work-travel-claim');
};

module.exports = travelToWork;
