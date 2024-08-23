const validators = require('../../../../../../app/definitions/field-validators/common/optional-validator');
const config = require('../../../../../../app/config/config-mapping');
const {
  expectValidatorToPass
} = require('../../../../../helpers/validator-assertions');

let assert;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
})();

describe('Validators: your-equipment-or-adaptation-grant', () => {
  it('should export a function', () => {
    assert.typeOf(config, 'object');
  });

  describe('field: reviewed', () => {
    it('should pass "optional" - if empty', async () => {
      await expectValidatorToPass(
        validators,
        'reviewed',
        'Optional',
        { reviewed: '' });
    });

    it('should pass "optional" - if any value', async () => {
      await expectValidatorToPass(
        validators,
        'reviewed',
        'Optional',
        { reviewed: 'VALUE' });
    });
  });
});

