const page = require('../../../../../../app/definitions/pages/support-worker/grant-only-for-support-worker-costs');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const sinon = require('sinon');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();

describe('definitions/pages/support-worker/grant-only-for-support-worker-costs', () => {
  it('should page a function', () => {
    assert.typeOf(page, 'function');
  });
  describe('when exported function is invoked', () => {
    beforeEach(() => {
      this.result = page();
    });
    it('when exported function is invoked', () => {
      assert.typeOf(this.result, 'object');
    });

    describe('returned object keys', () => {
      describe('`view` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('view');
        });
        it('value be a string', () => {
          assert.typeOf(this.result.view, 'string');
          assert.equal(this.result.view, 'pages/support-worker/grant-only-for-support-worker-costs.njk');
        });
      });
      describe('`fieldValidators` key', () => {
        it('should not be defined', () => {
          expect(Object.keys(this.result))
            .to
            .not
            .includes('fieldValidators');
        });
      });
      describe('`hooks` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result)).to.includes('hooks');

          expect(Object.keys(this.result.hooks)).to.includes('prerender');
        });

        it('should contain hideBackButton', () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub).to.be.calledOnceWithExactly();
        });
      });
    });
  });
});
