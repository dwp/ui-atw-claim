const mappings = {
  'upload-receipts-or-invoices': {
    showInJson: false,
    outputFieldName: 'evidence',
    showSingleField: 'files',
  },
  __hidden_uploaded_files__: {
    showInJson: true,
    outputFieldName: 'evidence',
    showSingleField: 'files',
  },
  'about-needs-to-be-paid': {
    showInJson: true,
    outputFieldName: 'details',
    group: 'payee',
  },
  __hidden_new_payee__: {
    showInJson: true,
    outputFieldName: 'newPayee',
    showSingleField: 'newPayee',
    group: 'payee',
  },
  __hidden_existing_payee__: {
    showInJson: true,
    outputFieldName: 'details',
    group: 'payee',
  },
  'postcode-of-person-or-company-being-paid': {
    showInJson: false,
  },
  'address-of-person-or-company-being-paid': {
    showInJson: false,
  },
  __hidden_address__: {
    showInJson: true,
    outputFieldName: 'address',
    showSingleField: 'addressDetails',
    group: 'payee',
  },
  'bank-details-of-person-or-company-being-paid': {
    showInJson: true,
    outputFieldName: 'bankDetails',
    group: 'payee',
  },
  'details-of-someone-who-can-confirm-costs': {
    showInJson: true,
    addAllPageFieldsToGroup: true,
    group: 'workplaceContact',
  },
  'confirm-workplace-contact-details': {
    showInJson: false,
  },
  __previous_claim__: {
    showInJson: true,
    showSingleField: 'claimId',
    outputFieldName: 'previousClaimId',
  },
};

module.exports = {
  mappings,
};
