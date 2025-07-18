const {
  isYes,
  isNo,
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
    'specialist-equipment-claim',
    'your-specialist-equipment-grant',
    isYes('claimingEquipment', 'specialist-equipment-claim'),
  );

  plan.setRoute('your-specialist-equipment-grant', 'what-you-need-to-make-claim');
  plan.setRoute(
    'what-you-need-to-make-claim',
    'your-specialist-equipment',
    isEqualTo('journeyType', claimTypesFullName.EA, '__journey_type__'),
  );

  plan.setRoute('your-specialist-equipment', 'specialist-equipment-summary');
  
  plan.setRoute(
    'specialist-equipment-summary',
    'your-specialist-equipment',
  (r, c) => isYes('addAnother', 'specialist-equipment-summary')(r, c),
  );

  plan.setRoute(
    'specialist-equipment-summary',
    'remove-specialist-equipments',
    (r, c) => (c.data['remove-specialist-equipment']?.removeId === true),
  );
  plan.setRoute('remove-specialist-equipments', 'specialist-equipment-summary');

  plan.setRoute(
    'specialist-equipment-summary',
    'specialist-equipment-cost',
    (r, c) => isNo('addAnother', 'specialist-equipment-summary')(r, c),
  );

  plan.setRoute(
    'specialist-equipment-cost',
    'total-specialist-equipment-cost',
    isGreaterThan('nonAtwCost', 0, '__grant_being_claimed__'),
  );
  plan.setRoute('total-specialist-equipment-cost', 'receipts-invoices');
  plan.setRoute(
    'specialist-equipment-cost',
    'receipts-invoices',
    (r, c) => !isGreaterThan('nonAtwCost', 0, '__grant_being_claimed__')(r, c),
  );

  evidenceRoutes(plan);
  payeeDetails(plan);

  plan.addOrigin(
    EQUIPMENT_OR_ADAPTATION_CONTEXT_PATH.replace('/', ''),
    'specialist-equipment-claim',
  );
};

module.exports = equipmentOrAdaptation;
