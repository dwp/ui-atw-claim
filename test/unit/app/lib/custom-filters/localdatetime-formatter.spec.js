
const formatter = require('../../../../../app/lib/custom-filters/localdatetime-formatter');
const {
  assert,
} = require('chai');
describe('localDatetimeFormatter', () => {

  describe('en', () => {
    const locale = 'en';
    it('format localDateTime', () => {
      const date = formatter('2022-03-12T16:33:16', locale);

      assert.equal(date, '12 March 2022');
    });

    it('format localDate', () => {
      const date = formatter('2022-04-12', locale);

      assert.equal(date, '12 April 2022');
    });
  });

  describe('cy', () => {
    const locale = 'cy';
    it('format localDateTime', () => {
      const date = formatter('2022-03-12T16:33:16', locale);

      assert.equal(date, '12 Mawrth 2022');
    });

    it('format localDate', () => {
      const date = formatter('2022-04-12', locale);

      assert.equal(date, '12 Ebrill 2022');
    });
  });
});
