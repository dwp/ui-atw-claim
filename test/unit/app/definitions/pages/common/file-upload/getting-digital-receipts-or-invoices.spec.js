const page = require('../../../../../../../app/definitions/pages/common/file-upload/getting-digital-receipts-or-invoices');
const sinon = require('sinon');
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const { claimTypesFullName } = require('../../../../../../../app/config/claim-types');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('definitions/pages/common/file-upload/getting-digital-receipts-or-invoices', () => {
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
          assert.equal(this.result.view, 'pages/common/file-upload/getting-digital-receipts-or-invoices.njk');
        });
      });
      describe('`fieldValidators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('fieldValidators');
        });

        it('value should return an object', () => {
          assert.typeOf(this.result.fieldValidators, 'object');
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
          const nextStub = sinon.stub();

          const getDataForPageStub = sinon.stub()
            .returns({
              journeyType: claimTypesFullName.EA
            });
          req.casa = {
            journeyContext: {
              getDataForPage: getDataForPageStub
            }
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(res.locals.journeyType)
            .to
            .deep
            .equal(claimTypesFullName.EA);
        });
      });
    });
  });
});
