const page = require('../../../../../../app/definitions/pages/support-worker/remove-month-of-support');
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('definitions/pages/support-worker/remove-month-of-support', () => {
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
          assert.equal(this.result.view, 'pages/support-worker/remove-month-of-support.njk');
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
            remove: '1',
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.removeId)
            .to
            .equal('1');
        });

      });

      describe('postvalidate', () => {
        let sandbox;
        beforeEach(() => {
          sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext').callsFake();
        });

        afterEach(() => {
          sandbox.restore();
        });

        it('user answers no just continue', () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  removeMonthOfSupport: 'no'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledTwice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-support-month', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'support-claim-summary', undefined);

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
            remove: '0',
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
                if (page === '__hidden_support_page__') {
                  return {
                    '0': {
                      monthYear: {
                        mm: '12',
                        yyyy: '2020',
                      },
                      claim: [{
                        'dayOfSupport': '1',
                        'hoursOfSupport': '3',
                        'minutesOfSupport': '3',
                      }]
                    },
                    '1': {
                      monthYear: {
                        mm: '1',
                        yyyy: '2020',
                      },
                      claim: [{
                        'dayOfSupport': '2',
                        'hoursOfSupport': '2',
                        'minutesOfSupport': '1',
                      }]
                    }
                  };
                }
                return {
                  removeMonthOfSupport: 'yes'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledThrice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-support-month', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'support-claim-summary', undefined);
          sinon.assert.calledWith(setDataForPageStub.thirdCall, '__hidden_support_page__', {
            '1': {
              monthYear: {
                mm: '1',
                yyyy: '2020',
              },
              claim: [{
                'dayOfSupport': '2',
                'hoursOfSupport': '2',
                'minutesOfSupport': '1',
              }]
            }
          });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it("user answers yes and continue in edit mode", () => {

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.inEditMode = true;

          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  removeMonthOfSupport: 'no'
                }
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledTwice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-support-month', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'support-claim-summary', {
            anotherMonth: 'no'
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
