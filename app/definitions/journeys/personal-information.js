/* eslint-disable no-underscore-dangle */
const {
  wasSkipped,
} = require('../../helpers/journey-helpers');
const {
  PERSONAL_INFORMATION_CONTEXT_PATH,
} = require('../../config/uri');

const journey = (plan) => {
  plan.addSequence(
    'personal-information',
    'update-name',
    'update-your-email-address',
    'telephone-number-change',
    'new-phone-number',
    'new-mobile-number',
    'remove-home-number',
    'remove-mobile-number',
    'new-postcode',
  );

  plan.setRoute(
    'new-postcode',
    'new-address-select',
  );

  plan.setRoute(
    'new-address-select',
    'enter-address',
    wasSkipped('new-address-select'),
  );

  plan.setRoute(
    'new-address-select',
    'personal-information-change',
    (r, c) => !wasSkipped('new-address-select')(r, c),
  );

  plan.setRoute('enter-address', 'personal-information-change');

  plan.addSequence('personal-information-change', 'new-personal-declaration');

  plan.addOrigin(PERSONAL_INFORMATION_CONTEXT_PATH.replace('/', ''), 'personal-information');
};

module.exports = journey;
