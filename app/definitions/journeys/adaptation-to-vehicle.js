/* eslint-disable no-underscore-dangle */
const {
    isYes,
    isEqualTo, 
    isNo,
    isGreaterThan
} = require('../../helpers/journey-helpers');
const {
  claimTypesFullName,
} = require('../../config/claim-types');
const evidenceRoutes = require('./common/evidence');
const payeeDetails = require('./common/payee-details');
const {
  ADAPTATION_TO_VEHICLE_CONTEXT_PATH,
} = require('../../config/uri');

const adaptationToVehicle = (plan) => {
  plan.setRoute(
    'vehicle-adaptations-claim',
    'your-vehicle-adaptations-grant',
    isYes('claimingAdaptationToVehicle', 'vehicle-adaptations-claim'),
  );
  plan.setRoute(
    'vehicle-adaptations-claim',
    'grant-only-for-vehicle-adaptations',
    (r, c) => !isYes('claimingAdaptationToVehicle', 'vehicle-adaptations-claim')(r, c),
  );

  plan.setRoute('your-vehicle-adaptations-grant', 'what-you-need-to-make-claim');

  plan.setRoute(
    'what-you-need-to-make-claim',
    'your-vehicle-adaptations',
    isEqualTo('journeyType', claimTypesFullName.AV, '__journey_type__'),
  );

  plan.setRoute('your-vehicle-adaptations', 'vehicle-adaptations-summary');

  plan.setRoute(
      'vehicle-adaptations-summary',
      'your-vehicle-adaptations',
    (r, c) => isYes('addAnother', 'vehicle-adaptations-summary')(r, c),
  );

  plan.setRoute(
    'vehicle-adaptations-summary',
    'remove-vehicle-adaptations',
    (r, c) => (c.data['remove-vehicle-adaptation']?.removeId === true),
  );
  plan.setRoute('remove-vehicle-adaptations', 'vehicle-adaptations-summary');

  plan.setRoute(
    'vehicle-adaptations-summary',
    'vehicle-adaptations-cost',
    (r, c) => isNo('addAnother', 'vehicle-adaptations-summary')(r, c),
  );
  plan.setRoute(
    'vehicle-adaptations-cost',
    'total-vehicle-adaptations-cost',
    isGreaterThan('nonAtwCost', 0, '__grant_being_claimed__'),
  );

  plan.setRoute('total-vehicle-adaptations-cost', 'receipts-invoices');

  plan.setRoute(
    'vehicle-adaptations-cost',
    'receipts-invoices',
    (r, c) => !isGreaterThan('nonAtwCost', 0, '__grant_being_claimed__')(r, c),
  );

  evidenceRoutes(plan);
  payeeDetails(plan);

  plan.addOrigin(ADAPTATION_TO_VEHICLE_CONTEXT_PATH.replace('/', ''), 'vehicle-adaptations-claim');
};

module.exports = adaptationToVehicle;
