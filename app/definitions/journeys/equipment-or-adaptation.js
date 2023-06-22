const {
  isYes,
  isEqualTo,
  isGreaterThan,
} = require('../../helpers/journey-helpers');
const evidenceRoutes = require('./common/evidence');
const payeeDetails = require('./common/payee-details');
const {
  EQUIPMENT_OR_ADAPTATION_CONTEXT_PATH,
} = require('../../config/uri');
const {
  claimTypesFullName,
} = require('../../config/claim-types');

const equipmentOrAdaptation = (plan) => {
  plan.setRoute(
    'equipment-or-adaptation-claim',
    'your-equipment-or-adaptation-grant',
    isYes('claimingEquipment', 'equipment-or-adaptation-claim'),
  );
  plan.setRoute(
    'equipment-or-adaptation-claim',
    'grant-only-for-equipment-or-adaptation-costs',
    (r, c) => !isYes('claimingEquipment', 'equipment-or-adaptation-claim')(r, c),
  );

  plan.setRoute('your-equipment-or-adaptation-grant', 'what-you-will-need-to-submit-a-claim');
  plan.setRoute(
    'what-you-will-need-to-submit-a-claim',
    'your-equipment-or-adaptation',
    isEqualTo('journeyType', claimTypesFullName.EA, '__journey_type__'),
  );
  plan.setRoute('your-equipment-or-adaptation', 'equipment-or-adaptation-summary');
  plan.setRoute('equipment-or-adaptation-summary', 'equipment-or-adaptation-cost');
  plan.setRoute(
    'equipment-or-adaptation-cost',
    'total-amount-to-be-paid',
    isGreaterThan('nonAtwCost', 0, '__grant_being_claimed__'),
  );
  plan.setRoute('total-amount-to-be-paid', 'getting-digital-receipts-or-invoices');
  plan.setRoute(
    'equipment-or-adaptation-cost',
    'getting-digital-receipts-or-invoices',
    (r, c) => !isGreaterThan('nonAtwCost', 0, '__grant_being_claimed__')(r, c),
  );

  evidenceRoutes(plan);
  payeeDetails(plan);

  plan.addOrigin(
    EQUIPMENT_OR_ADAPTATION_CONTEXT_PATH.replace('/', ''),
    'equipment-or-adaptation-claim',
  );
};

module.exports = equipmentOrAdaptation;
