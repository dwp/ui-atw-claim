const { removeAllSpaces } = require('../../../../app/utils/remove-all-spaces.js');

let expect;
(async() => {
  expect = (await import ('chai')).expect;
})();

describe('Utils: removeAllSpaces', () => {
  it('should export a function', () => {
    expect(removeAllSpaces)
      .to
      .be
      .a('function');
  });

  it('should strip spaces from a string', () => {
    expect(removeAllSpaces(' A A A A A '))
      .to
      .equal('AAAAA');
  });
});
