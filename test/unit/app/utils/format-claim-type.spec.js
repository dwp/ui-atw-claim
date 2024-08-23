const formatClaimType = require('../../../../app/utils/format-claim-type');
const {
  claimTypesShortName,
} = require('../../../../app/config/claim-types');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();

describe('Utils: format-claim-type', () => {
  it('should export a function', () => {
    expect(formatClaimType)
      .to
      .be
      .a('function');
  });

  it('should not throw error if input is a string', () => {
    expect(() => formatClaimType('EQUIPMENT_OR_ADAPTATION'))
      .to
      .not
      .throw();
  });

  it('should throw error if input is not string', () => {
    expect(() => formatClaimType(123))
      .to
      .throw(TypeError, 'Expected string got number: 123');
  });

  it('should convert claimType', () => {

    assert.typeOf(formatClaimType('EQUIPMENT_OR_ADAPTATION'), 'string');
    assert.equal(formatClaimType('EQUIPMENT_OR_ADAPTATION'),
      claimTypesShortName.EQUIPMENT_OR_ADAPTATION);
    assert.equal(formatClaimType('TRAVEL_TO_WORK'), claimTypesShortName.TRAVEL_TO_WORK);
    assert.equal(formatClaimType('SUPPORT_WORKER'), claimTypesShortName.SUPPORT_WORKER);

    expect(() => formatClaimType('OTHER_TYPE'))
      .to
      .throw(Error, 'Invalid Claim got: OTHER_TYPE');

  });
});
