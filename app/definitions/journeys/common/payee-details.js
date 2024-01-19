/* eslint-disable no-underscore-dangle */
const {
  wasSkipped,
  isEqualTo,
} = require('../../../helpers/journey-helpers');
const { claimTypesFullName } = require('../../../config/claim-types');

const payeeDetails = (plan) => {
  plan.setRoute(
    'person-company-being-paid',
    'person-company-being-paid-details',
    isEqualTo('payee', 'new', 'person-company-being-paid'),
  );

  plan.setRoute('person-company-being-paid-details', 'person-company-being-paid-postcode');

  plan.setRoute(
    'person-company-being-paid',
    'confirmer-details',
    (r, c) => !isEqualTo('payee', 'new', 'person-company-being-paid')(r, c)
      && c.data.__journey_type__.journeyType === claimTypesFullName.SW,
  );
  plan.setRoute(
    'person-company-being-paid',
    'employment-status',
    (r, c) => !isEqualTo('payee', 'new', 'person-company-being-paid')(r, c)
      && c.data.__journey_type__.journeyType === claimTypesFullName.TW,
  );
  plan.setRoute(
    'person-company-being-paid-postcode',
    'person-company-being-paid-address',
  );

  plan.setRoute(
    'person-company-being-paid-address',
    'enter-person-company-being-paid-address',
    wasSkipped('person-company-being-paid-address'),
  );

  plan.setRoute(
    'person-company-being-paid-address',
    'person-company-being-paid-payment-details',
    (r, c) => !wasSkipped('person-company-being-paid-address')(r, c),
  );
  plan.setRoute(
    'enter-person-company-being-paid-address',
    'person-company-being-paid-payment-details',
  );

  // Equipment or Adaptations OR Adaptation to Vehicle
  plan.setRoute(
    'person-company-being-paid-payment-details',
    'check-your-answers',
    (r, c) => c.data.__journey_type__.journeyType === claimTypesFullName.EA || c.data.__journey_type__.journeyType === claimTypesFullName.AV,
  );

  // Support Worker
  plan.setRoute(
    'person-company-being-paid-payment-details',
    'confirmer-details',
    (r, c) => c.data.__journey_type__.journeyType === claimTypesFullName.SW,
  );

  // Travel to work
  plan.setRoute(
    'person-company-being-paid-payment-details',
    'employment-status',
    (r, c) => c.data.__journey_type__.journeyType === claimTypesFullName.TW,
  );
};

module.exports = (plan) => payeeDetails(plan);
