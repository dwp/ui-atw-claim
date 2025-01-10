const page = require('../../../../../../app/definitions/pages/equipment-or-adaptation/equipment-or-adaptation-cost');
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const { removeAllSpaces } = require('../../../../../../app/utils/remove-all-spaces');
const { totalCost } = require('../../../../../../app/definitions/field-validators/equipment-or-adaptation/equipment-or-adaptation-cost');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('definitions/pages/equipment-or-adaptation/equipment-or-adaptation-cost', () => {
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
          assert.equal(this.result.view, 'pages/equipment-or-adaptation/equipment-or-adaptation-cost.njk');
        });
      });
      describe('`fieldValidators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('fieldValidators');
        });
      });

      describe('`pregather` key', () => {
        it('should export a function (remove all spaces)', () => {
          expect(removeAllSpaces)
            .to
            .be
            .a('function');
        });

        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('pregather');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          req.body = {
            totalCost: ' 100.511'
          };

          this.result.hooks.pregather(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(req.body.totalCost)
            .to
            .be
            .equal('100.51');
        });
      });
    });
  });
});
