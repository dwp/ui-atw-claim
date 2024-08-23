const journeys = require('../../../../app/definitions/journeys.js');

let assert;
(async() => {
  assert = (await import ('chai')).assert;
})();

describe('definitions/journeys.js', () => {
  it('when exported function is invoked', () => {
    assert.typeOf(journeys, 'function');
  });
  it('when exported function is invoked', () => {
    assert.typeOf(journeys(), 'object');
  });
});
