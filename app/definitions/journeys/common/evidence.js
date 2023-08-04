/* eslint-disable no-underscore-dangle */
const {
  isYes,
  isNo,
} = require('../../../helpers/journey-helpers');
const { claimTypesFullName } = require('../../../config/claim-types');

const evidenceRoutes = (plan) => {
  plan.setRoute(
    'receipts-invoices',
    'upload-receipts-invoices',
    (r, c) => (c.data.__hidden_uploaded_files__?.files?.length ?? 0) === 0,
  );

  plan.setRoute(
    'receipts-invoices',
    'receipts-invoices-uploaded',
    (r, c) => (c.data.__hidden_uploaded_files__?.files?.length > 0),
  );

  plan.addSequence(
    'upload-receipts-invoices',
    'receipts-invoices-uploaded',
  );

  plan.setRoute(
    'receipts-invoices-uploaded',
    'remove-receipt-invoice',
    (r, c) => (c.data['receipts-invoices-uploaded']?.removeMode === true),
  );

  plan.setRoute(
    'remove-receipt-invoice',
    'receipts-invoices-uploaded',
    (r, c) => (c.data['receipts-invoices-uploaded']?.removeMode !== true),
  );

  plan.setRoute(
    'receipts-invoices-uploaded',
    'upload-receipts-invoices',
    (r, c) => (c.data['receipts-invoices-uploaded'] !== undefined
      && isYes('uploadMore', 'receipts-invoices-uploaded')(r, c)),
  );

  plan.setRoute(
    'receipts-invoices-uploaded',
    'person-company-being-paid-details',
    (r, c) => ((c.data.__journey_type__.journeyType === claimTypesFullName.EA
        || c.data.__hidden_account__.account.payees.length === 0)
      && c.data['receipts-invoices-uploaded'] !== undefined
      && isNo('uploadMore', 'receipts-invoices-uploaded')(r, c)),
  );

  plan.setRoute(
    'receipts-invoices-uploaded',
    'person-company-being-paid',
    (r, c) => (((c.data.__journey_type__.journeyType === claimTypesFullName.SW
          || c.data.__journey_type__.journeyType === claimTypesFullName.TW)
        && c.data.__hidden_account__.account.payees.length > 0)
      && c.data['receipts-invoices-uploaded'] !== undefined
      && isNo('uploadMore', 'receipts-invoices-uploaded')(r, c)),
  );
};

module.exports = (plan) => evidenceRoutes(plan);
