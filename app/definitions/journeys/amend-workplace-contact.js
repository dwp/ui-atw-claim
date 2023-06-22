const {
  WORKPLACE_CONTACT_CONTEXT_PATH,
} = require('../../config/uri');

const journey = (plan) => {
  plan.setRoute('amend-details-of-someone-who-can-confirm-costs', 'amend-confirm-workplace-contact-details');

  plan.addOrigin(WORKPLACE_CONTACT_CONTEXT_PATH.replace('/', ''), 'amend-details-of-someone-who-can-confirm-costs');
};

module.exports = journey;
