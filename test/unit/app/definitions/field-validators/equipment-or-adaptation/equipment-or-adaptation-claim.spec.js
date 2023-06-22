const {
  expectValidatorToFail,
  expectValidatorToPass
} = require('../../../../../helpers/validator-assertions');
const validators = require('../../../../../../app/definitions/field-validators/equipment-or-adaptation/equipment-or-adaptation-claim');
const { assert } = require('chai');
const config = require('../../../../../../app/config/config-mapping');

describe('Validators: equipment-or-adaptation-claim', () => {
  it('should export a function', () => {
    assert.typeOf(config, 'object');
  });

  describe('field: claimingEquipment', () => {
    it('should fail "required" validator if no value is provided', async () => {
      await expectValidatorToFail(
        validators,
        'claimingEquipment',
        'Required',
        { claimingEquipment: '' });
    });
    it('should pass "required" validator if value is provided - yes', async () => {
      await expectValidatorToPass(
        validators,
        'claimingEquipment',
        'Required',
        { claimingEquipment: 'Yes' });
    });
    it('should pass "required" validator if value is provided - no', async () => {
      await expectValidatorToPass(
        validators,
        'claimingEquipment',
        'Required',
        { claimingEquipment: 'No' });
    });
  });
});

