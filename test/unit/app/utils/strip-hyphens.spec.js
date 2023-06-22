const { expect } = require('chai');
const stripHyphens = require('../../../../app/utils/strip-hyphens.js');

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
