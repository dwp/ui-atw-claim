const formatSortcode = require('../../../../app/utils/format-sortcode');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();

describe('Utils: format-sortcode', () => {
  it('should export a function', () => {
    expect(formatSortcode)
      .to
      .be
      .a('function');
  });

  it('should not throw error if input is a string', () => {
    expect(() => formatSortcode('121212'))
      .to
      .not
      .throw();
  });

  it('should throw error if input is not string', () => {
    expect(() => formatSortcode(123))
      .to
      .throw(TypeError, 'Expected string got number: 123');
  });

  it('should correctly format sortcode', () => {

    assert.typeOf(formatSortcode('112233'), 'string');
    assert.equal(formatSortcode('112233'), '112233');
    assert.equal(formatSortcode('11-22-33'), '112233');
    assert.equal(formatSortcode('11 22 33'), '112233');

  });
});
