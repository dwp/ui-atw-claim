/* eslint-disable global-require */
module.exports = () => {
  const commonPages = {
    'what-you-need-to-make-claim': require('./common/what-you-will-need-to-submit-a-claim')(),
    'receipts-invoices': require('./common/file-upload/getting-digital-receipts-or-invoices')(),
    'upload-receipts-invoices': require('./common/file-upload/upload-receipts-or-invoices')(),
    'remove-receipt-invoice': require('./common/file-upload/remove-receipt-or-invoice')(),
    'receipts-invoices-uploaded': require('./common/file-upload/receipts-or-invoices-uploaded')(),
    'person-company-being-paid-details': require('./common/payee-details/about-needs-to-be-paid')(),
    'person-company-being-paid': require('./common/payee-details/about-the-person-or-company-being-paid')(),
    'select-person-company-being-paid': require('./common/payee-details/select-person-company-being-paid')(),
    'person-company-being-paid-postcode': require('./common/address-lookup/enter-postcode')(
      'pages/common/payee-details/postcode-of-person-or-company-being-paid.njk',
      require('../field-validators/common/payee-details/postcode-of-person-or-company-being-paid'),
      'person-company-being-paid-postcode',
      'person-company-being-paid-address',
      'enter-person-company-being-paid-address',
      true,
    ),
    'person-company-being-paid-address': require('./common/address-lookup/select-address')(
      'pages/common/payee-details/address-of-person-or-company-being-paid.njk',
      require('../field-validators/common/payee-details/address-of-person-or-company-being-paid'),
      'person-company-being-paid-postcode',
      'person-company-being-paid-address',
      'enter-person-company-being-paid-address',
      '__hidden_address__',
      true,
    ),
    'enter-person-company-being-paid-address': require('./common/address-lookup/manual-address-entry')(
      'pages/common/payee-details/enter-address-of-person-or-company-being-paid.njk',
      require('../field-validators/common/payee-details/enter-address-of-person-or-company-being-paid'),
      'enter-person-company-being-paid-address',
      '__hidden_address__',
      true,
    ),
    'person-company-being-paid-payment-details': require('./common/payee-details/bank-details-of-person-or-company-being-paid')(),
  };

  // Equipment or Adaptions
  const equipmentOrAdaptationPages = {
    'specialist-equipment-claim': require('./equipment-or-adaptation/equipment-or-adaptation-claim')(),
    'your-specialist-equipment-grant': require('./equipment-or-adaptation/your-equipment-or-adaptation-grant')(),
    'grant-only-for-specialist-equipment': require('./equipment-or-adaptation/grant-only-for-equipment-or-adaptation-costs')(),
    'your-specialist-equipment': require('./equipment-or-adaptation/your-equipment-or-adaptation')(),
    'specialist-equipment-summary': require('./equipment-or-adaptation/equipment-or-adaptation-summary')(),
    'remove-specialist-equipments': require('./equipment-or-adaptation/remove-specialist-equipments')(),
    'specialist-equipment-cost': require('./equipment-or-adaptation/equipment-or-adaptation-cost')(),
    'total-specialist-equipment-cost': require('./equipment-or-adaptation/total-amount-to-be-paid')(),
  };

  // Support Worker
  const workplaceContactDetailsPage = { 'confirmer-details': require('./common/workplaceContact/details-of-someone-who-can-confirm-costs')() };
  const supportWorker = {
    'support-worker-claim': require('./support-worker/support-worker-claim')(),
    'your-support-worker-grant': require('./support-worker/your-support-worker-grant')(),
    'grant-only-for-support-workers': require('./support-worker/grant-only-for-support-worker-costs')(),
    'support-worker-or-agency-name': require('./support-worker/support-worker-or-agency-name')(),
    'support-month': require('./support-worker/month-claiming-support-worker-costs')(),
    'support-days': require('./support-worker/days-you-had-support')(),
    'support-hours': require('./support-worker/hours-you-had-support')(),
    'support-claim-summary': require('./support-worker/support-claim-summary')(),
    'remove-support-month': require('./support-worker/remove-month-of-support')(),
    'support-cost': require('./support-worker/support-cost')(),
    'total-support-worker-cost': require('./support-worker/amount-to-be-paid-towards-support')(),
    ...workplaceContactDetailsPage,
  };

  supportWorker['check-confirmer-details'] = require('./common/workplaceContact/confirm-workplace-contact-details')(workplaceContactDetailsPage);

  // Travel to Work
  const travelToWork = {
    'work-travel-claim': require('./travel-to-work/work-travel-claim')(),
    'grant-only-for-travel-to-work': require('./travel-to-work/grant-only-for-travel-to-work-costs')(),
    'your-work-travel-grant': require('./travel-to-work/your-work-travel-grant')(),
    'which-journey-type': require('./travel-to-work/how-did-you-travel-for-work')(),
    'claiming-instructions': require('./travel-to-work/claiming-instructions')(),
    'travel-month': require('./travel-to-work/month-claiming-travel-for-work')(),
    'travel-days': require('./travel-to-work/days-you-travelled-for-work')(),
    'journey-summary': require('./travel-to-work/journey-summary')(),
    'remove-travel-month': require('./travel-to-work/remove-month-of-travel')(),
    'taxi-journeys-cost': require('./travel-to-work/cost-of-taxi-journeys')(),
    'journeys-miles': require('./travel-to-work/journey-or-mileage')(),
    'total-amount-to-be-paid-towards-lift-costs': require('./travel-to-work/total-amount-to-be-paid-towards-lift-costs')(),
    'employment-status': require('./travel-to-work/employment-status')(),
    ...workplaceContactDetailsPage,
  };

  // Adaptation to Vehicle
  const adaptationsToVehicle = {
    'vehicle-adaptations-claim': require('./vehicle-adaptations/vehicle-adaptations-claim')(),
    'grant-only-for-vehicle-adaptations': require('./vehicle-adaptations/grant-only-for-adaptation-to-vehicle-costs')(),
    'your-vehicle-adaptations-grant': require('./vehicle-adaptations/your-vehicle-adaptations-grant')(),
    'your-vehicle-adaptations': require('./vehicle-adaptations/your-vehicle-adaptations')(),
    'vehicle-adaptations-summary': require('./vehicle-adaptations/vehicle-adaptations-summary')(),
    'remove-vehicle-adaptations': require('./vehicle-adaptations/remove-vehicle-adaptations')(),
    'vehicle-adaptations-cost': require('./vehicle-adaptations/vehicle-adaptations-cost')(),
    'total-vehicle-adaptations-cost': require('./vehicle-adaptations/total-vehicle-adaptations-cost')(),
  };

  //Travel in Work
  const travelInWork = {
    'during-work-travel-claim': require('./travel-in-work/during-work-travel-claim')(),
    'grant-only-for-travel-during-work-costs': require('./travel-in-work/grant-only-for-travel-during-work-costs')(),
    'your-travel-during-work-grant': require('./travel-in-work/your-travel-during-work-grant')(),
    'travel-claim-month': require('./travel-in-work/travel-claim-month')(),
    'journey-number': require('./travel-in-work/journey-number')(),
    'journey-details': require('./travel-in-work/journey-details')(),
    'taxi-journeys-summary': require('./travel-in-work/taxi-journeys-summary')(),
    'remove-tiw-month': require('./travel-in-work/remove-month-of-tiw')(),
    'total-mileage': require('./travel-in-work/total-mileage')(),
    'employment-status': require('./travel-in-work/employment-status')(),
  }

  const account = {
    'select-support-to-claim': require('./pre/select-support-to-claim')(),
    'your-claims-multiple': require('./pre/multiple-claims-history')(),
    'multiple-grant-select': require('./pre/multiple-grants-summary')(),
  };

  commonPages['check-your-answers'] = require('./common/check-your-answers')(
    { ...equipmentOrAdaptationPages, ...commonPages },
    { ...supportWorker, ...commonPages },
    { ...travelToWork, ...commonPages },
    { ...adaptationsToVehicle, ...commonPages },
    { ...travelInWork, ...commonPages},
  );

  const personalInformation = {
    'personal-details': require('./account/personal/personal-information')(),
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

  commonPages['change-personal-details'] = require('./account/personal/personal-information-change')(personalInformation);

  const amendWorkplaceContact = {
    'amend-check-confirmer-details': require('./common/amendWorkplaceContact/amend-confirm-workplace-contact-details')(),
    'amend-confirmer-details': require('./common/amendWorkplaceContact/amend-details-of-someone-who-can-confirm-costs')(),
  };

  return {
    ...commonPages,
    ...equipmentOrAdaptationPages,
    ...supportWorker,
    ...travelToWork,
    ...adaptationsToVehicle,
    ...travelInWork,
    ...account,
    ...amendWorkplaceContact,
    ...personalInformation,
  };
};
