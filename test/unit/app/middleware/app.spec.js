let  assert, expect;

(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('app.js dependencies', function () {
  this.timeout(100000);
  it('should load without throwing', function (done) {
        expect(() => require('../../../../app.js'))
        .to.not.throw();
        setTimeout(done, 5000);
  });
})