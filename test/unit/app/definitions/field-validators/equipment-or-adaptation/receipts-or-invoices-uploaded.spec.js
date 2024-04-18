const {
  expectValidatorToFailWithJourney, expectValidatorToPassWithJourney,
} = require('../../../../../helpers/validator-assertions');
const validators = require(
  '../../../../../../app/definitions/field-validators/common/file-upload/receipts-or-invoices-uploaded');
const { assert } = require('chai');
const config = require('../../../../../../app/config/config-mapping');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const { claimTypesFullName } = require('../../../../../../app/config/claim-types');

describe('Validators: receipts-invoices-uploaded', () => {
  it('should export a function', () => {
    assert.typeOf(config, 'object');
  });

  describe('field: uploadMore', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFailWithJourney(validators,
        'receipts-invoices-uploaded', 'uploadMore', 'Required',
        new JourneyContext({
          ['receipts-invoices-uploaded']: {
            uploadMore: '',
          }, ['remove-receipt-invoice']: { removeId: undefined },
        }), {
          summary: 'receipts-or-invoices-uploaded:validation.required',
          inline: 'receipts-or-invoices-uploaded:validation.required',
        });
    });

    it('should pass "required" validator if value is provided - Yes',
      async () => {
        await expectValidatorToPassWithJourney(validators,
          'receipts-invoices-uploaded', 'uploadMore', 'Required',
          new JourneyContext({
            ['receipts-invoices-uploaded']: {
              uploadMore: 'Yes',
            }, ['remove-receipt-invoice']: { removeId: undefined },
          }));
      });

    it('should pass "required" validator if value is provided - No',
      async () => {
        await expectValidatorToPassWithJourney(validators,
          'receipts-invoices-uploaded', 'uploadMore', 'Required',
          new JourneyContext({
            ['receipts-invoices-uploaded']: {
              uploadMore: 'No',
            }, ['remove-receipt-invoice']: { removeId: undefined },
          }));
      });

    it(
      `should fail "FileList" validator user tries to proceed but has not uploaded- ${claimTypesFullName.EA}`,
      async () => {
        await expectValidatorToFailWithJourney(validators,
          'receipts-invoices-uploaded', 'uploadMore', 'FileList',
          new JourneyContext({
            ['receipts-invoices-uploaded']: {
              uploadMore: 'no',
            }, ['__journey_type__']: {
              journeyType: claimTypesFullName.EA,
            }, ['__hidden_uploaded_files__']: {
              files: [],
            }, ['remove-receipt-invoice']: { removeId: undefined },
          }), {
            summary: 'receipts-or-invoices-uploaded:validation.noFiles',
          });
      });

    it(
      `should fail "FileList" validator user tries to proceed but has not uploaded- ${claimTypesFullName.SW}`,
      async () => {
        await expectValidatorToFailWithJourney(validators,
          'receipts-invoices-uploaded', 'uploadMore', 'FileList',
          new JourneyContext({
            ['receipts-invoices-uploaded']: {
              uploadMore: 'no',
            }, ['__journey_type__']: {
              journeyType: claimTypesFullName.SW,
            }, ['__hidden_uploaded_files__']: {
              files: [],
            }, ['remove-receipt-invoice']: { removeId: undefined },
          }), {
            summary: 'receipts-or-invoices-uploaded:validation.noFiles',
          });
      });

    it(
      `should fail "FileList" validator user tries to proceed but has not uploaded- ${claimTypesFullName.TW}`,
      async () => {
        await expectValidatorToFailWithJourney(validators,
          'receipts-invoices-uploaded', 'uploadMore', 'FileList',
          new JourneyContext({
            ['receipts-invoices-uploaded']: {
              uploadMore: 'no',
            }, ['__journey_type__']: {
              journeyType: claimTypesFullName.TW,
            }, ['__hidden_uploaded_files__']: {
              files: [],
            }, ['remove-receipt-invoice']: { removeId: undefined },
          }), {
            summary: 'receipts-or-invoices-uploaded:validation.noFiles',
          });
      });

    it(
      'should pass "FileList" validator when user tries to proceed and has uploaded',
      async () => {
        await expectValidatorToPassWithJourney(validators,
          'receipts-invoices-uploaded', 'uploadMore', 'FileList',
          new JourneyContext({
            ['receipts-invoices-uploaded']: {
              uploadMore: 'no',
            }, ['__journey_type__']: {
              journeyType: claimTypesFullName.EA,
            }, ['__hidden_uploaded_files__']: {
              files: [
                {
                  fileId: '123', fileName: 'FielsName',
                }],
            }, ['remove-receipt-invoice']: { removeId: undefined },
          }));
      });

    it(
      'should skip "FileList" validator when user clicks remove (no validation needed)',
      async () => {
        await expectValidatorToPassWithJourney(validators,
          'receipts-invoices-uploaded', 'uploadMore', 'FileList',
          new JourneyContext({
            ['receipts-invoices-uploaded']: {
              uploadMore: 'no',
            }, ['__hidden_uploaded_files__']: {
              files: [],
            }, ['remove-receipt-invoice']: { removeId: 123 },
          }));
      });

    it(
      'should skip "required" validator when user clicks remove (no validation needed)',
      async () => {
        await expectValidatorToPassWithJourney(validators,
          'receipts-invoices-uploaded', 'uploadMore', 'Required',
          new JourneyContext({
            ['receipts-invoices-uploaded']: {
              uploadMore: '',
            }, ['remove-receipt-invoice']: { removeId: 123 },
          }));
      });
  });
});

