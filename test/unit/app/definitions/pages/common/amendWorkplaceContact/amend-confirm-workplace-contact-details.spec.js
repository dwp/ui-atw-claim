const {
  assert,
  expect,
} = require('chai');
const sinon = require('sinon');
const page = require('../../../../../../../app/definitions/pages/common/amendWorkplaceContact/amend-confirm-workplace-contact-details');
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');

describe('pages/common/amendWorkplaceContact/amend-confirm-workplace-contact-details', () => {
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
          assert.equal(this.result.view, 'pages/common/amendWorkplaceContact/amend-confirm-workplace-contact-details.njk');
        });
      });
      describe('`fieldValidators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('fieldValidators');
        });
      });

      describe('`prerender` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: () => ({
                fullName: 'My name',
                emailAddress: 'email@email.com',
              }),
            },
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.locals.BUTTON_TEXT, 'confirm-workplace-contact-details:continueButton');
          assert.equal(res.locals.fullName, 'My name');
          assert.equal(res.locals.emailAddress, 'email@email.com');
        });
      });
    });
  });
});
