const page = require('../../../../../../app/definitions/pages/travel-to-work/employment-status');
const {
  assert,
  expect
} = require('chai');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const sinon = require('sinon');

describe('definitions/pages/travel-to-work/employment-status', () => {
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
          assert.equal(this.result.view, 'pages/travel-to-work/employment-status.njk');
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

      describe('postvalidate', () => {

        beforeEach(() => {
          this.result = page();
        });
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('postvalidate');
        });

        it('If self employed get employment status data', () => {
          const req = new Request();
          const res = new Response(req);
          const setDataForPageStub = sinon.stub();
          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  employmentStatus: 'selfEmployed'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, sinon.stub());

          sinon.assert.callCount(setDataForPageStub, 2);
          sinon.assert.calledWith(setDataForPageStub.getCall(0), 'confirmer-details', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(1), 'check-confirmer-details', undefined);
        });

      });
    });
  });
});
