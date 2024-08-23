const constants = require('../../../../app/config/constants');
let assert;

(async() => {
  assert = (await import ('chai')).assert;
})();

describe('config/config-mapping', () => {
  it('declarationVersion is 1', () => {
    assert.equal(constants.DECLARATION_VERSION, 1);
  });
});
