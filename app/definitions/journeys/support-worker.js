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
  plan.setRoute('your-support-worker-grant', 'what-you-need-to-make-claim');
  plan.setRoute(
    'what-you-need-to-make-claim',
    'support-worker-or-agency-name',
    isEqualTo('journeyType', claimTypesFullName.SW, '__journey_type__'),
  );
  plan.addSequence(
    'support-worker-or-agency-name',
    'support-month',
    'support-days',
    'support-hours',
    'support-claim-summary',
  );
  plan.setRoute(
    'support-claim-summary',
    'support-month',
    (r, c) => isYes('anotherMonth', 'support-claim-summary')(r, c),
  );
  plan.setRoute(
    'support-claim-summary',
    'remove-support-month',
    (r, c) => (c.data['remove-month']?.removeId === true),
  );
  plan.setRoute('remove-support-month', 'support-claim-summary');

  plan.setRoute(
    'support-claim-summary',
    'support-cost',
    (r, c) => isNo('anotherMonth', 'support-claim-summary')(r, c),
  );

  plan.setRoute(
    'support-cost',
    'total-support-worker-cost',
    isGreaterThan('nonAtwCost', 0, '__grant_being_claimed__'),
  );
  plan.setRoute('total-support-worker-cost', 'receipts-invoices');

  plan.setRoute(
    'support-cost',
    'receipts-invoices',
    (r, c) => !isGreaterThan('nonAtwCost', 0, '__grant_being_claimed__')(r, c),
  );

  evidenceRoutes(plan);
  payeeDetails(plan);

  plan.addSequence(
    'confirmer-details',
    'check-confirmer-details',
  );

  plan.setRoute(
    'check-confirmer-details',
    'check-your-answers',
    isEqualTo('reviewed', 'true', 'check-confirmer-details'),
  );

  plan.addOrigin(SUPPORT_WORKER_CONTEXT_PATH.replace('/', ''), 'support-worker-claim');
};

module.exports = supportWorker;
