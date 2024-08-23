const page = require('../../../../../../app/definitions/pages/equipment-or-adaptation/equipment-or-adaptation-summary');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const sinon = require('sinon');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();

describe('definitions/pages/equipment-or-adaptation/equipment-or-adaptation-summary', () => {
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
          assert.equal(this.result.view, 'pages/equipment-or-adaptation/equipment-or-adaptation-summary.njk');
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

          const getDataForPageStub = sinon.stub()
            .returns({
              item: [{
                'description': 'Item 1',
                'dateOfPurchase': {
                  'dd': '22',
                  'mm': '11',
                  'yyyy': '2020'
                }
              }]
            });
          req.casa = {
            journeyContext: {
              getDataForPage: getDataForPageStub
            }
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.pData)
            .to
            .deep
            .equal({
              item: [{
                'description': 'Item 1',
                'dateOfPurchase': {
                  'dd': '22',
                  'mm': '11',
                  'yyyy': '2020'
                }
              }]
            });
        });
      });
    });
  });
});
