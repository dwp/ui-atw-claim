const page = require('../../../../../../app/definitions/pages/vehicle-adaptations/remove-vehicle-adaptations');
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('definitions/pages/vehicle-adaptations/remove-vehicle-adaptations', () => {
  it('should page a function', () => {
    assert.typeOf(page, 'function');
  });
  describe('when exported function is invoked', () => {
    let sandbox;
    beforeEach(() => {
      this.result = page();
      sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();
    });

    afterEach(() => {
      sandbox.restore();
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
          assert.equal(this.result.view, 'pages/vehicle-adaptations/remove-vehicle-adaptations.njk');
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

      describe('prerender', () => {
        it('set removeId from page data', () => {
          const req = new Request();
          const res = new Response(req);

          req.query = {
            remove: '1'
          }

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.removeId)
            .to
            .equal('1');
        });

      });

      describe('postvalidate', () => {

        it('user answers no just continue', () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  removeVehicleAdaptation: 'no'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledTwice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-vehicle-adaptations', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'vehicle-adaptations-summary', undefined);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('user answers yes and continue', () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();


          req.query = {
            remove: '1',
          };

          req.session = {
            save: sinon.stub()
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === '__hidden_vehicle_adaptations_page__') {
                  return {
                    '0': [{
                      description: "car door",
                      dateOfInvoice: {
                        dd: "1",
                        mm: "2",
                        yyyy: "2003"
                      }
                    }],
                    '1': [{
                      description: "lift",
                      dateOfInvoice: {
                        dd: "4",
                        mm: "5",
                        yyyy: "2006"
                      }
                    }]
                  };
                }
                return {
                  removeVehicleAdaptation: 'yes'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledThrice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-vehicle-adaptations', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'vehicle-adaptations-summary', undefined);
          sinon.assert.calledWith(setDataForPageStub.thirdCall, '__hidden_vehicle_adaptations_page__', {
            '0': [{
              description: "car door",
              dateOfInvoice: {
                dd: "1",
                mm: "2",
                yyyy: "2003"
              }
            }]
          });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('user answers yes and continue in edit mode', () => {

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.inEditMode = true;

          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  removeVehicleAdaptation: 'no'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledTwice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-vehicle-adaptations', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'vehicle-adaptations-summary', {
            addAnother: 'no'
          });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });
      });
    });
  });
});
