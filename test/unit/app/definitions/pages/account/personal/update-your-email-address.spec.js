const chai = require('chai');
const page = require(
  '../../../../../../../app/definitions/pages/account/personal/update-your-email-address');
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const sinon = require('sinon');


const removeAllSpaces = require('../../../../../../../app/utils/remove-all-spaces.js');

const {
  assert,
  expect,
} = chai;

describe('definitions/pages/account/personal/update-your-email-address', () => {
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
          assert.equal(this.result.view, 'pages/account/personal/update-your-email-address.njk');
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
            `/claim/personal/personal-information-change`);
        });
      });

      describe('Utils: removeAllSpaces', () => {
        it('should export a function', () => {
          expect(removeAllSpaces)
              .to
              .be
              .a('function');
        });

        it('should strip spaces from a string', () => {
          expect(Object.keys(this.result))
              .to
              .includes('hooks');
          expect(Object.keys(this.result.hooks))
              .to
              .includes('pregather');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          req.body.emailAddress = ' t e s t @ e m a i l . c o . u k '

          this.result.hooks.pregather(req, res, nextStub);

          expect(req.body.emailAddress)
              .to
              .equal('test@email.co.uk');
        });
      });
    });
  });
});
