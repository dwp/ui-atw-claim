const stripHyphens = require('../../../../app/utils/strip-hyphens.js');

let expect;
(async() => {
  expect = (await import ('chai')).expect;
})();

describe('Utils: strip-hyphens', () => {
  it('should export a function', () => {
    expect(stripHyphens)
      .to
      .be
      .a('function');
  });

  it('should strip hyphens from a string', () => {
    expect(stripHyphens('-12-12-12-'))
      .to
      .equal('121212');
  });
});
