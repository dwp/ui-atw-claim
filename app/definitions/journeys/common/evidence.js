/* eslint-disable no-underscore-dangle */
const {
  isYes,
  isNo,
} = require('../../../helpers/journey-helpers');
const { claimTypesFullName } = require('../../../config/claim-types');

const evidenceRoutes = (plan) => {
  plan.setRoute(
    'getting-digital-receipts-or-invoices',
    'upload-receipts-or-invoices',
    (r, c) => (c.data.__hidden_uploaded_files__?.files?.length ?? 0) === 0,
  );

  plan.setRoute(
    'getting-digital-receipts-or-invoices',
    'receipts-or-invoices-uploaded',
    (r, c) => (c.data.__hidden_uploaded_files__?.files?.length > 0),
  );

  plan.addSequence(
    'upload-receipts-or-invoices',
    'receipts-or-invoices-uploaded',
  );

  plan.setRoute(
    'receipts-or-invoices-uploaded',
    'remove-receipt-or-invoice',
    (r, c) => (c.data['receipts-or-invoices-uploaded']?.removeMode === true),
  );

  plan.setRoute(
    'remove-receipt-or-invoice',
    'receipts-or-invoices-uploaded',
    (r, c) => (c.data['receipts-or-invoices-uploaded']?.removeMode !== true),
  );

  plan.setRoute(
    'receipts-or-invoices-uploaded',
    'upload-receipts-or-invoices',
    (r, c) => (c.data['receipts-or-invoices-uploaded'] !== undefined
      && isYes('uploadMore', 'receipts-or-invoices-uploaded')(r, c)),
  );

  plan.setRoute(
    'receipts-or-invoices-uploaded',
    'about-needs-to-be-paid',
    (r, c) => ((c.data.__journey_type__.journeyType === claimTypesFullName.EA
        || c.data.__hidden_account__.account.payees.length === 0)
      && c.data['receipts-or-invoices-uploaded'] !== undefined
      && isNo('uploadMore', 'receipts-or-invoices-uploaded')(r, c)),
  );

  plan.setRoute(
    'receipts-or-invoices-uploaded',
    'about-the-person-or-company-being-paid',
    (r, c) => (((c.data.__journey_type__.journeyType === claimTypesFullName.SW
          || c.data.__journey_type__.journeyType === claimTypesFullName.TW)
        && c.data.__hidden_account__.account.payees.length > 0)
      && c.data['receipts-or-invoices-uploaded'] !== undefined
      && isNo('uploadMore', 'receipts-or-invoices-uploaded')(r, c)),
  );
};

module.exports = (plan) => evidenceRoutes(plan);
