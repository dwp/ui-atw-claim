const page = require('../../../../../../../app/definitions/pages/common/workplaceContact/confirm-workplace-contact-details');
const {
  assert,
  expect
} = require('chai');
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const sinon = require('sinon');
const { claimTypesFullName } = require('../../../../../../../app/config/claim-types');

describe('definitions/pages/support-worker/confirm-workplace-contact-details-to-submit-a-claim', () => {
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
          assert.equal(this.result.view, 'pages/common/workplaceContact/confirm-workplace-contact-details.njk');
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
              getDataForPage: () => {
                return {
                  fullName: 'My name',
                  emailAddress: 'email@email.com',
                  journeyType: claimTypesFullName.TW
                };
              },
            }
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.locals.BUTTON_TEXT, 'confirm-workplace-contact-details:continueButton');
          assert.equal(res.locals.fullName, 'My name');
          assert.equal(res.locals.emailAddress, 'email@email.com');
          assert.equal(res.locals.journeyType, claimTypesFullName.TW);
        });
      });
    });
  });
});
