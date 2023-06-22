const {
  expect,
  assert
} = require('chai');
const formatSortcode = require('../../../../app/utils/format-sortcode');
const journeys = require('../../../../app/definitions/journeys.js');

const sortCodeObj = {
  sort1: '11',
  sort2: '22',
  sort3: '33'
};

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
