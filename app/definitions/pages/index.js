/* eslint-disable global-require */
module.exports = () => {
  const commonPages = {
    'what-you-will-need-to-submit-a-claim': require('./common/what-you-will-need-to-submit-a-claim')(),
    'getting-digital-receipts-or-invoices': require('./common/file-upload/getting-digital-receipts-or-invoices')(),
    'upload-receipts-or-invoices': require('./common/file-upload/upload-receipts-or-invoices')(),
    'remove-receipt-or-invoice': require('./common/file-upload/remove-receipt-or-invoice')(),
    'receipts-or-invoices-uploaded': require('./common/file-upload/receipts-or-invoices-uploaded')(),
    'about-needs-to-be-paid': require('./common/payee-details/about-needs-to-be-paid')(),
    'about-the-person-or-company-being-paid': require('./common/payee-details/about-the-person-or-company-being-paid')(),
    'postcode-of-person-or-company-being-paid': require('./common/address-lookup/enter-postcode')(
      'pages/common/payee-details/postcode-of-person-or-company-being-paid.njk',
      require('../field-validators/common/payee-details/postcode-of-person-or-company-being-paid'),
      'postcode-of-person-or-company-being-paid',
      'address-of-person-or-company-being-paid',
      'enter-address-of-person-or-company-being-paid',
      true,
    ),
    'address-of-person-or-company-being-paid': require('./common/address-lookup/select-address')(
      'pages/common/payee-details/address-of-person-or-company-being-paid.njk',
      require('../field-validators/common/payee-details/address-of-person-or-company-being-paid'),
      'postcode-of-person-or-company-being-paid',
      'address-of-person-or-company-being-paid',
      'enter-address-of-person-or-company-being-paid',
      '__hidden_address__',
      true,
    ),
    'enter-address-of-person-or-company-being-paid': require('./common/address-lookup/manual-address-entry')(
      'pages/common/payee-details/enter-address-of-person-or-company-being-paid.njk',
      require('../field-validators/common/payee-details/enter-address-of-person-or-company-being-paid'),
      'enter-address-of-person-or-company-being-paid',
      '__hidden_address__',
      true,
    ),
    'bank-details-of-person-or-company-being-paid': require('./common/payee-details/bank-details-of-person-or-company-being-paid')(),
  };

  // Equipment or Adaptions
  const equipmentOrAdaptationPages = {
    'equipment-or-adaptation-claim': require('./equipment-or-adaptation/equipment-or-adaptation-claim')(),
    'your-equipment-or-adaptation-grant': require('./equipment-or-adaptation/your-equipment-or-adaptation-grant')(),
    'grant-only-for-equipment-or-adaptation-costs': require('./equipment-or-adaptation/grant-only-for-equipment-or-adaptation-costs')(),
    'your-equipment-or-adaptation': require('./equipment-or-adaptation/your-equipment-or-adaptation')(),
    'equipment-or-adaptation-summary': require('./equipment-or-adaptation/equipment-or-adaptation-summary')(),
    'equipment-or-adaptation-cost': require('./equipment-or-adaptation/equipment-or-adaptation-cost')(),
    'total-amount-to-be-paid': require('./equipment-or-adaptation/total-amount-to-be-paid')(),
  };

  // Support Worker
  const workplaceContactDetailsPage = { 'details-of-someone-who-can-confirm-costs': require('./common/workplaceContact/details-of-someone-who-can-confirm-costs')() };
  const supportWorker = {
    'support-worker-claim': require('./support-worker/support-worker-claim')(),
    'your-support-worker-grant': require('./support-worker/your-support-worker-grant')(),
    'grant-only-for-support-worker-costs': require('./support-worker/grant-only-for-support-worker-costs')(),
    'month-claiming-support-worker-costs': require('./support-worker/month-claiming-support-worker-costs')(),
    'days-you-had-support': require('./support-worker/days-you-had-support')(),
    'support-claim-summary': require('./support-worker/support-claim-summary')(),
    'remove-month-of-support': require('./support-worker/remove-month-of-support')(),
    'support-cost': require('./support-worker/support-cost')(),
    'amount-to-be-paid-towards-support': require('./support-worker/amount-to-be-paid-towards-support')(),
    ...workplaceContactDetailsPage,
  };

  supportWorker['confirm-workplace-contact-details'] = require('./common/workplaceContact/confirm-workplace-contact-details')(workplaceContactDetailsPage);

  const travelToWork = {
    'work-travel-claim': require('./travel-to-work/work-travel-claim')(),
    'grant-only-for-travel-to-work-costs': require('./travel-to-work/grant-only-for-travel-to-work-costs')(),
    'your-work-travel-grant': require('./travel-to-work/your-work-travel-grant')(),
    'how-did-you-travel-for-work': require('./travel-to-work/how-did-you-travel-for-work')(),
    'month-claiming-travel-for-work': require('./travel-to-work/month-claiming-travel-for-work')(),
    'days-you-travelled-for-work': require('./travel-to-work/days-you-travelled-for-work')(),
    'journey-summary': require('./travel-to-work/journey-summary')(),
    'remove-month-of-travel': require('./travel-to-work/remove-month-of-travel')(),
    'cost-of-taxi-journeys': require('./travel-to-work/cost-of-taxi-journeys')(),
    'total-amount-to-be-paid-towards-work-travel-costs': require('./travel-to-work/total-amount-to-be-paid-towards-work-travel-costs')(),
    'journey-or-mileage': require('./travel-to-work/journey-or-mileage')(),
    'total-amount-to-be-paid-towards-lift-costs': require('./travel-to-work/total-amount-to-be-paid-towards-lift-costs')(),
    'employment-status': require('./travel-to-work/employment-status')(),
    ...workplaceContactDetailsPage,
  };

  const account = {
    'select-support-to-claim': require('./pre/select-support-to-claim')(),
    'multiple-claims-history': require('./pre/multiple-claims-history')(),
  };

  commonPages['check-your-answers'] = require('./common/check-your-answers')(
    { ...equipmentOrAdaptationPages, ...commonPages },
    { ...supportWorker, ...commonPages },
    { ...travelToWork, ...commonPages },
  );

  const personalInformation = {
    'personal-information': require('./account/personal/personal-information')(),
    'update-name': require('./account/personal/update-name')(),
    'update-your-email-address': require('./account/personal/update-your-email-address')(),
    'telephone-number-change': require('./account/personal/telephone-number-change')(),
    'new-phone-number': require('./account/personal/new-phone-number')(),
    'new-mobile-number': require('./account/personal/new-mobile-number')(),
    'remove-home-number': require('./account/personal/remove-home-number')(),
    'remove-mobile-number': require('./account/personal/remove-mobile-number')(),
    'new-postcode': require('./common/address-lookup/enter-postcode')(
      'pages/account/personal/new-postcode.njk',
      require('../field-validators/common/payee-details/postcode-of-person-or-company-being-paid'),
      'new-postcode',
      'new-address-select',
      'enter-address',
      false,
    ),
    'new-address-select': require('./common/address-lookup/select-address')(
      'pages/account/personal/new-address-select.njk',
      require('../field-validators/common/payee-details/address-of-person-or-company-being-paid'),
      'new-postcode',
      'new-address-select',
      'enter-address',
      '__hidden_address__',
      false,
    ),
    'enter-address': require('./common/address-lookup/manual-address-entry')(
      'pages/account/personal/enter-address.njk',
      require('../field-validators/common/payee-details/enter-address-of-person-or-company-being-paid'),
      'enter-address',
      '__hidden_address__',
      false,
    ),
  };

  commonPages['personal-information-change'] = require('./account/personal/personal-information-change')(personalInformation);

  const amendWorkplaceContact = {
    'amend-confirm-workplace-contact-details': require('./common/amendWorkplaceContact/amend-confirm-workplace-contact-details')(),
    'amend-details-of-someone-who-can-confirm-costs': require('./common/amendWorkplaceContact/amend-details-of-someone-who-can-confirm-costs')(),
  };

  return {
    ...commonPages,
    ...equipmentOrAdaptationPages,
    ...supportWorker,
    ...travelToWork,
    ...account,
    ...amendWorkplaceContact,
    ...personalInformation,
  };
};
