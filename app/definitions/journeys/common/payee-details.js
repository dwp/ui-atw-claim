/* eslint-disable no-underscore-dangle */
const {
  wasSkipped,
  isEqualTo,
} = require('../../../helpers/journey-helpers');
const { claimTypesFullName } = require('../../../config/claim-types');

const payeeDetails = (plan) => {
  plan.setRoute(
    'about-the-person-or-company-being-paid',
    'about-needs-to-be-paid',
    isEqualTo('payee', 'new', 'about-the-person-or-company-being-paid'),
  );

  plan.setRoute('about-needs-to-be-paid', 'postcode-of-person-or-company-being-paid');

  plan.setRoute(
    'about-the-person-or-company-being-paid',
    'details-of-someone-who-can-confirm-costs',
    (r, c) => !isEqualTo('payee', 'new', 'about-the-person-or-company-being-paid')(r, c)
      && c.data.__journey_type__.journeyType === claimTypesFullName.SW,
  );
  plan.setRoute(
    'about-the-person-or-company-being-paid',
    'employment-status',
    (r, c) => !isEqualTo('payee', 'new', 'about-the-person-or-company-being-paid')(r, c)
      && c.data.__journey_type__.journeyType === claimTypesFullName.TW,
  );
  plan.setRoute(
    'postcode-of-person-or-company-being-paid',
    'address-of-person-or-company-being-paid',
  );

  plan.setRoute(
    'address-of-person-or-company-being-paid',
    'enter-address-of-person-or-company-being-paid',
    wasSkipped('address-of-person-or-company-being-paid'),
  );

  plan.setRoute(
    'address-of-person-or-company-being-paid',
    'bank-details-of-person-or-company-being-paid',
    (r, c) => !wasSkipped('address-of-person-or-company-being-paid')(r, c),
  );
  plan.setRoute(
    'enter-address-of-person-or-company-being-paid',
    'bank-details-of-person-or-company-being-paid',
  );

  // Equipment or Adaptations
  plan.setRoute(
    'bank-details-of-person-or-company-being-paid',
    'check-your-answers',
    (r, c) => c.data.__journey_type__.journeyType === claimTypesFullName.EA,
  );

  // Support Worker
  plan.setRoute(
    'bank-details-of-person-or-company-being-paid',
    'details-of-someone-who-can-confirm-costs',
    (r, c) => c.data.__journey_type__.journeyType === claimTypesFullName.SW,
  );

  // Travel to work
  plan.setRoute(
    'bank-details-of-person-or-company-being-paid',
    'employment-status',
    (r, c) => c.data.__journey_type__.journeyType === claimTypesFullName.TW,
  );
};

module.exports = (plan) => payeeDetails(plan);
