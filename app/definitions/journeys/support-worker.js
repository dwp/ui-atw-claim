const {
  isYes,
  isNo,
  isEqualTo,
  isGreaterThan,
} = require('../../helpers/journey-helpers');
const evidenceRoutes = require('./common/evidence');
const payeeDetails = require('./common/payee-details');
const {
  SUPPORT_WORKER_CONTEXT_PATH,
} = require('../../config/uri');
const {
  claimTypesFullName,
} = require('../../config/claim-types');

const supportWorker = (plan) => {
  plan.setRoute(
    'support-worker-claim',
    'your-support-worker-grant',
    isYes('claimingSupportWorker', 'support-worker-claim'),
  );
  plan.setRoute(
    'support-worker-claim',
    'grant-only-for-support-worker-costs',
    (r, c) => !isYes('claimingSupportWorker', 'support-worker-claim')(r, c),
  );
  plan.setRoute('your-support-worker-grant', 'what-you-will-need-to-submit-a-claim');
  plan.setRoute(
    'what-you-will-need-to-submit-a-claim',
    'month-claiming-support-worker-costs',
    isEqualTo('journeyType', claimTypesFullName.SW, '__journey_type__'),
  );
  plan.addSequence(
    'month-claiming-support-worker-costs',
    'days-you-had-support',
    'support-claim-summary',
  );
  plan.setRoute(
    'support-claim-summary',
    'month-claiming-support-worker-costs',
    (r, c) => isYes('anotherMonth', 'support-claim-summary')(r, c)
      && (c.data['remove-month-of-support']?.removeId === undefined),
  );
  plan.setRoute(
    'support-claim-summary',
    'remove-month-of-support',
    (r, c) => (c.data['remove-month-of-support']?.removeId !== undefined),
  );
  plan.setRoute('remove-month-of-support', 'support-claim-summary');

  plan.setRoute(
    'support-claim-summary',
    'support-cost',
    (r, c) => isNo('anotherMonth', 'support-claim-summary')(r, c)
      && (c.data['remove-month-of-support']?.removeId === undefined),
  );

  plan.setRoute(
    'support-cost',
    'amount-to-be-paid-towards-support',
    isGreaterThan('nonAtwCost', 0, '__grant_being_claimed__'),
  );
  plan.setRoute('amount-to-be-paid-towards-support', 'getting-digital-receipts-or-invoices');

  plan.setRoute(
    'support-cost',
    'getting-digital-receipts-or-invoices',
    (r, c) => !isGreaterThan('nonAtwCost', 0, '__grant_being_claimed__')(r, c),
  );

  evidenceRoutes(plan);
  payeeDetails(plan);

  plan.addSequence(
    'details-of-someone-who-can-confirm-costs',
    'confirm-workplace-contact-details',
  );

  plan.setRoute(
    'confirm-workplace-contact-details',
    'check-your-answers',
    isEqualTo('reviewed', 'true', 'confirm-workplace-contact-details'),
  );

  plan.addOrigin(SUPPORT_WORKER_CONTEXT_PATH.replace('/', ''), 'support-worker-claim');
};

module.exports = supportWorker;
