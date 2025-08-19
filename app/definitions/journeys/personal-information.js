 
const {
  wasSkipped,
} = require('../../helpers/journey-helpers');
const {
  PERSONAL_INFORMATION_CONTEXT_PATH,
} = require('../../config/uri');

const journey = (plan) => {
  plan.addSequence(
    'personal-details',
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
    'change-personal-details',
    (r, c) => !wasSkipped('new-address-select')(r, c),
  );

  plan.setRoute('enter-address', 'change-personal-details');

  plan.addSequence('change-personal-details', 'new-personal-declaration');

  plan.addOrigin(PERSONAL_INFORMATION_CONTEXT_PATH.replace('/', ''), 'personal-details');
};

module.exports = journey;
