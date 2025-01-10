const rewire = require('rewire');
const bankDetails = rewire(
  '../../../../../../app/definitions/pages/common/payee-details/bank-details-of-person-or-company-being-paid');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const { removeAllSpaces } = require('../../../../../../app/utils/remove-all-spaces.js');

const sinon = require('sinon');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

const axiosStub = sinon.stub();
bankDetails.__set__('axios', axiosStub);
const validBankResponse = {
  status: 200,
  data: {
    validDetails: true,
    transactionsSupported: ['DIRECT_CREDIT'],
  },
};
const failedBankResponse = {
  status: 200,
  data: {
    validDetails: false,
  },
};

describe('definitions/pages/bank-details-of-person-or-company-being-paid', () => {
  it('should export a function', () => {
    assert.typeOf(bankDetails, 'function');
  });

  describe('when exported function is invoked', () => {
    describe('with valid params', () => {
      beforeEach(() => {
        this.result = bankDetails();
        axiosStub.reset();
      });

      it('should return an object', () => {
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

            assert.equal(this.result.view,
              'pages/common/payee-details/bank-details-of-person-or-company-being-paid.njk');
          });
        });
        describe('`custom-validators` key', () => {
          it('should be defined', () => {
            expect(Object.keys(this.result))
              .to
              .include('fieldValidators');
          });

          it('value should return an object', () => {
            assert.typeOf(this.result.fieldValidators, 'object');
          });
        });
        describe('`hooks` key', () => {
          it('should be defined', () => {
            expect(Object.keys(this.result))
              .to
              .include('hooks');
          });

          it('value should be set to an object', () => {

            assert.typeOf(this.result.hooks, 'object');

          });

          describe('`prerender` key', () => {
            it('should be defined', () => {
              expect(Object.keys(this.result.hooks))
                .to
                .include('prerender');
            });

            it('key value should be a function', () => {
              assert.typeOf(this.result.hooks.prerender, 'function');
            });

            describe('when function is invoked', () => {
              beforeEach(() => {
                this.fakeReq = {
                  casa: {
                    journeyContext: {
                      getDataForPage: (page) => {
                        if (page === 'person-company-being-paid-details') {
                          return {
                            fullName: 'George',
                          };
                        } else {
                          return {};
                        }
                      },
                    },
                  },
                };

                this.fakeRes = {
                  locals: {},
                };
                this.fakeNext = sinon.stub();
                this.result.hooks.prerender(this.fakeReq, this.fakeRes, this.fakeNext);
              });

              it('should set payeeName ', () => {
                assert.equal(this.fakeRes.locals.payeeName, 'George');
              });

              it('should populate req.casa.journeyContext with a data', () => {
                sinon.assert.calledOnce(this.fakeNext);
              });

            });
          });

          describe('`postvalidate` key', () => {

            it('should be defined', () => {
              expect(Object.keys(this.result.hooks))
                .to
                .include('postvalidate');
            });

            it('key value should be a function', () => {
              assert.typeOf(this.result.hooks.postvalidate, 'function');
            });

            it('should pass bank validation api check - no roll number', async () => {
                const req = new Request();
                const res = new Response(req);
                const nextStub = sinon.stub();

                const getDataForPageStub = sinon.stub();
                const setDataForPageStub = sinon.stub();

                getDataForPageStub.returns({
                  'sortCode': '000004',
                  'accountNumber': '12345677',
                  'accountHolderName': 'John Smith',
                });

                req.casa = {
                  journeyContext: {
                    getDataForPage: getDataForPageStub,
                    setDataForPage: setDataForPageStub,
                  },
                };

                axiosStub.resolves(Promise.resolve(validBankResponse));
                await this.result.hooks.postvalidate(req, res, nextStub);

                expect(setDataForPageStub)
                  .to
                  .be
                  .calledOnceWithExactly('person-company-being-paid-payment-details', {
                    'sortCode': '000004',
                    'accountNumber': '12345677',
                    'accountHolderName': 'John Smith',
                    'rollNumber': undefined,
                  });

                sinon.assert.calledOnce(axiosStub);

                expect(nextStub)
                  .to
                  .be
                  .calledOnceWithExactly();

              },
            );

            it('should pass bank validation api check - no roll number and sort code with -',
              async () => {
                const req = new Request();
                const res = new Response(req);
                const nextStub = sinon.stub();

                const getDataForPageStub = sinon.stub();
                const setDataForPageStub = sinon.stub();

                getDataForPageStub.returns({
                  'sortCode': '00-00-04',
                  'accountNumber': '12345677',
                  'rollNumber': '12343546',
                  'accountHolderName': 'George',
                });

                req.casa = {
                  journeyContext: {
                    getDataForPage: getDataForPageStub,
                    setDataForPage: setDataForPageStub,
                  },
                };

                axiosStub.resolves(Promise.resolve(validBankResponse));
                await this.result.hooks.postvalidate(req, res, nextStub);

                expect(setDataForPageStub)
                  .to
                  .be
                  .calledOnceWithExactly('person-company-being-paid-payment-details', {
                    'accountHolderName': 'George',
                    'accountNumber': '12345677',
                    'sortCode': '000004',
                    'rollNumber': '12343546',
                  });

                sinon.assert.calledOnce(axiosStub);

                expect(nextStub)
                  .to
                  .be
                  .calledOnceWithExactly();

              },
            );

            it('should pass bank validation api check - no roll number and sort code with /',
              async () => {
                const req = new Request();
                const res = new Response(req);
                const nextStub = sinon.stub();

                const getDataForPageStub = sinon.stub();
                const setDataForPageStub = sinon.stub();

                getDataForPageStub.returns({
                  'sortCode': '00/00/04',
                  'accountNumber': '12345677',
                  'accountHolderName': 'George',
                });

                req.casa = {
                  journeyContext: {
                    getDataForPage: getDataForPageStub,
                    setDataForPage: setDataForPageStub,
                  },
                };

                axiosStub.resolves(Promise.resolve(validBankResponse));
                await this.result.hooks.postvalidate(req, res, nextStub);

                expect(setDataForPageStub)
                  .to
                  .be
                  .calledOnceWithExactly('person-company-being-paid-payment-details', {
                    'sortCode': '000004',
                    'accountNumber': '12345677',
                    'accountHolderName': 'George',
                    'rollNumber': undefined,
                  });

                sinon.assert.calledOnce(axiosStub);

                expect(nextStub)
                  .to
                  .be
                  .calledOnceWithExactly();
              },
            );

            it('should pass bank validation api check - empty roll number', async () => {
                const req = new Request();
                const res = new Response(req);
                const nextStub = sinon.stub();

                const getDataForPageStub = sinon.stub();
                const setDataForPageStub = sinon.stub();

                getDataForPageStub.returns({
                  'sortCode': '000004',
                  'accountNumber': '12345677',
                  'accountHolderName': 'George',
                  'rollNumber': '',
                });

                req.casa = {
                  journeyContext: {
                    getDataForPage: getDataForPageStub,
                    setDataForPage: setDataForPageStub,
                  },
                };

                axiosStub.resolves(Promise.resolve(validBankResponse));
                await this.result.hooks.postvalidate(req, res, nextStub);

                expect(setDataForPageStub)
                  .to
                  .be
                  .calledOnceWithExactly('person-company-being-paid-payment-details', {
                    'sortCode': '000004',
                    'accountNumber': '12345677',
                    'accountHolderName': 'George',
                    'rollNumber': '',
                  });

                sinon.assert.calledOnce(axiosStub);

                expect(nextStub)
                  .to
                  .be
                  .calledOnceWithExactly();

              },
            );

            it('should pass bank validation api check - with role number', async () => {
                const req = new Request();
                const res = new Response(req);
                const nextStub = sinon.stub();

                const getDataForPageStub = sinon.stub();
                const setDataForPageStub = sinon.stub();

                getDataForPageStub.returns({
                  'sortCode': '000004',
                  'accountNumber': '12345677',
                  'rollNumber': '1234567',
                  'accountHolderName': 'George',
                });

                req.casa = {
                  journeyContext: {
                    getDataForPage: getDataForPageStub,
                    setDataForPage: setDataForPageStub,
                  },
                };

                axiosStub.resolves(Promise.resolve(validBankResponse));
                await this.result.hooks.postvalidate(req, res, nextStub);

                expect(setDataForPageStub)
                  .to
                  .be
                  .calledOnceWithExactly('person-company-being-paid-payment-details', {
                    'sortCode': '000004',
                    'accountNumber': '12345677',
                    'accountHolderName': 'George',
                    'rollNumber': '1234567',
                  });

                sinon.assert.calledOnce(axiosStub);

                expect(nextStub)
                  .to
                  .be
                  .calledOnceWithExactly();

              },
            );

            it('should fail bank validation api check', async () => {
              const req = new Request();
              const res = new Response(req);
              const nextStub = sinon.stub();

              const getDataForPageStub = sinon.stub();
              const setDataForPageStub = sinon.stub();

              getDataForPageStub.returns({
                'sortCode': '000004',
                'accountNumber': '12345677',
              });

              req.casa = {
                journeyContext: {
                  getDataForPage: getDataForPageStub,
                  setDataForPage: setDataForPageStub,
                },
              };

              axiosStub.resolves(Promise.resolve(failedBankResponse));
              await this.result.hooks.postvalidate(req, res, nextStub);

              sinon.assert.notCalled(setDataForPageStub);

              sinon.assert.calledOnce(axiosStub);

              expect(nextStub)
                .to
                .be
                .calledOnceWithExactly({
                  invalid: [
                    {
                      inline: res.locals.t('bank-details-of-person-or-company-being-paid:invalidBankDetails'),
                      summary: res.locals.t('bank-details-of-person-or-company-being-paid:invalidBankDetails'),
                      focusSuffix: [],
                      field: '',
                      fieldHref: '#f-sortCode',
                    }],
                });
            });

            it('bank validation api throws exceptions', async () => {
              const req = new Request();
              const res = new Response(req);
              const nextStub = sinon.stub();

              const getDataForPageStub = sinon.stub();
              const setDataForPageStub = sinon.stub();

              getDataForPageStub.returns({
                'sortCode': '000004',
                'accountNumber': '12345677',
              });

              req.casa = {
                journeyContext: {
                  getDataForPage: getDataForPageStub,
                  setDataForPage: setDataForPageStub,
                },
              };

              axiosStub.resolves(Promise.reject({ response: 'error' }));
              await this.result.hooks.postvalidate(req, res, nextStub);

              sinon.assert.notCalled(setDataForPageStub);

              expect(nextStub)
                .to
                .be
                .calledOnceWithExactly({
                  invalid: [
                    {
                      inline: res.locals.t('bank-details-of-person-or-company-being-paid:mismatchAccountDetails'),
                      summary: res.locals.t('bank-details-of-person-or-company-being-paid:mismatchAccountDetails'),
                      focusSuffix: [],
                      field: '',
                      fieldHref: '#f-sortCode',
                    }],
                });
            });

            it('bank validation api returns 500', async () => {
              const req = new Request();
              const res = new Response(req);
              const nextStub = sinon.stub();

              const getDataForPageStub = sinon.stub();
              const setDataForPageStub = sinon.stub();

              getDataForPageStub.returns({
                'sortCode': '000004',
                'accountNumber': '12345677',
              });

              req.casa = {
                journeyContext: {
                  getDataForPage: getDataForPageStub,
                  setDataForPage: setDataForPageStub,
                },
              };

              axiosStub.resolves(Promise.resolve({
                status: 500,
              }));
              await this.result.hooks.postvalidate(req, res, nextStub);
              sinon.assert.notCalled(setDataForPageStub);

              expect(nextStub)
                .to
                .be
                .calledOnceWithExactly({
                  invalid: [
                    {
                      inline: res.locals.t('bank-details-of-person-or-company-being-paid:mismatchAccountDetails'),
                      summary: res.locals.t('bank-details-of-person-or-company-being-paid:mismatchAccountDetails'),
                      focusSuffix: [],
                      field: '',
                      fieldHref: '#f-sortCode',
                    }],
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

                req.body.sortCode = ' 0 0 0 0 0 4 ';
                req.body.accountNumber = ' 1 2 3 4 5 6 7 7 '
                req.body.rollNumber = ' 1 2 3 4 5 6 7 7 '

                this.result.hooks.pregather(req, res, nextStub);

                expect(req.body.sortCode)
                  .to
                  .equal('000004');
                expect(req.body.accountNumber)
                  .to
                  .equal('12345677');
                  expect(req.body.rollNumber)
                  .to
                  .equal('12345677');
              });
            });
          });
        });
      });
    });
  });
});

