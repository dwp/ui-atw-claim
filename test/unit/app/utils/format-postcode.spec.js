const formatPostcode = require('../../../../app/utils/format-postcode.js');

let expect;
(async() => {
  expect = (await import ('chai')).expect;
})();

describe('Utils: format-postcode', () => {
  it('should export a function', () => {
    expect(formatPostcode)
      .to
      .be
      .a('function');
  });

  it('should not throw error if input is a string', () => {
    expect(() => formatPostcode('AA9A9AA'))
      .to
      .not
      .throw();
  });

  it('should throw error if input is not string', () => {
    expect(() => formatPostcode(123))
      .to
      .throw(TypeError, 'Expected string got number: 123');
  });

  it('should correctly space postcode format AA9A 9AA', () => {
    expect(formatPostcode('AA9A9AA'))
      .to
      .equal('AA9A 9AA');
  });

  it('should correctly space postcode format A9A 9AA', () => {
    expect(formatPostcode('A9A9AA'))
      .to
      .equal('A9A 9AA');
  });

  it('should correctly space postcode format A9 9AA', () => {
    expect(formatPostcode('A99AA'))
      .to
      .equal('A9 9AA');
  });

  it('should force postcode to uppercase', () => {
    expect(formatPostcode('aa9a9aa'))
      .to
      .equal('AA9A 9AA');
  });
});
