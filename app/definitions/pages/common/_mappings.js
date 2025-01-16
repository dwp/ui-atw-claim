const mappings = {
  'upload-receipts-invoices': {
    showInJson: false,
    outputFieldName: 'evidence',
    showSingleField: 'files',
  },
  __hidden_uploaded_files__: {
    showInJson: true,
    outputFieldName: 'evidence',
    showSingleField: 'files',
  },
  'person-company-being-paid-details': {
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
  __hidden_existing_payee_details__: {
    showInJson: false,
  },
  'person-company-being-paid-postcode': {
    showInJson: false,
  },
  'person-company-being-paid-address': {
    showInJson: false,
  },
  __hidden_address__: {
    showInJson: true,
    outputFieldName: 'address',
    showSingleField: 'addressDetails',
    group: 'payee',
  },
  'person-company-being-paid-payment-details': {
    showInJson: true,
    outputFieldName: 'bankDetails',
    group: 'payee',
  },
  'confirmer-details': {
    showInJson: true,
    addAllPageFieldsToGroup: true,
    group: 'workplaceContact',
  },
  'check-confirmer-details': {
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
