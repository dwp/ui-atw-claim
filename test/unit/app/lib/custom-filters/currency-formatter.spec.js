
const formatter = require('../../../../../app/lib/custom-filters/currency-formatter');
const {
  assert,
} = require('chai');
describe('currencyFormatter', () => {

    it('1', () => {
      const date = formatter(1);

      assert.equal(date, '£1.00');
    });

    it('1.1', () => {
      const date = formatter(1.1);

      assert.equal(date, '£1.10');
    });

    it('1.01', () => {
      const date = formatter(1.01);

      assert.equal(date, '£1.01');
    });

    it('1.00001', () => {
      const date = formatter(1.00001);

      assert.equal(date, '£1.00');
    });

    it('1 - string', () => {
      const date = formatter('1');

      assert.equal(date, '£1.00');
    });

    it('1.1 - string', () => {
      const date = formatter('1.1');

      assert.equal(date, '£1.10');
    });

    it('1.01 - string', () => {
      const date = formatter('1.01');

      assert.equal(date, '£1.01');
    });

    it('1.00001 - string', () => {
      const date = formatter('1.00001');

      assert.equal(date, '£1.00');
    });

    it('abc', () => {
      const date = formatter('abc');

      assert.equal(date, '£0.00');
    });

    it('null', () => {
      const date = formatter(null);

      assert.equal(date, '£0.00');
    });

    it('undefined', () => {
      const date = formatter(undefined);

      assert.equal(date, '£0.00');
    });
});
