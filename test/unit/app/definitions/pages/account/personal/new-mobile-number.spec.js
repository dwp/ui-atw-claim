const chai = require('chai');
const page = require(
  '../../../../../../../app/definitions/pages/account/personal/new-mobile-number');
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const sinon = require('sinon');

const {
  assert,
  expect,
} = chai;

describe('definitions/pages/account/personal/new-mobile-number', () => {
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
          assert.equal(this.result.view, 'pages/account/personal/new-mobile-number.njk');
        });
      });
    });
    describe('returned object keys', () => {
      describe('`prerender` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');
        });
        it('set res.locals', () => {
          const req = new Request();
          const res = new Response(req);

          this.result.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.locals.forceShowBackButton, true);
          assert.equal(res.locals.casa.journeyPreviousUrl,
            `/claim/personal/telephone-number-change`);
        });
      });
    });
  });
});
