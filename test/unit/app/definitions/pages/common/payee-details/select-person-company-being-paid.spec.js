const page = require(
  '../../../../../../../app/definitions/pages/common/payee-details/select-person-company-being-paid');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const sinon = require('sinon');

const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const { claimTypesFullName } = require('../../../../../../../app/config/claim-types');

let assert, expect;
(async () => {
  assert = (await import('chai')).assert;
  expect = (await import('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('definitions/pages/common/payee-details/select-person-company-being-paid', () => {
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
          assert.equal(this.result.view,
            'pages/common/payee-details/select-person-company-being-paid.njk');
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


      describe('prerender key', () => {
        it('should be defined and populated payees correctly', () => {

          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          req.casa.journeyContext = {
            getDataForPage: (page) => {
              if (page === '__hidden_existing_payee_details__') {
                return {
                  id: 86710601, fullName: 'name 1', emailAddress: 'name1@test.com'
                }
              }
              if (page === '__hidden_account__') {
                return {
                  account: {
                    payees: [
                      {
                        id: 86710601,
                        name: 'name 1',
                        emailAddress: 'name1@test.com',
                        bankAccountName: 'bank account name 1',
                        accountNumber: '12345601',
                        sortCode: '000001',
                      },
                      {
                        id: 86710602,
                        name: 'name 1',
                        emailAddress: 'name1@test.com',
                        bankAccountName: 'bank account name 12',
                        accountNumber: '12345602',
                        sortCode: '000002',
                      },
                      {
                        id: 86710603,
                        name: 'name 1',
                        emailAddress: 'name1@test.com',
                        bankAccountName: 'bank account name 13',
                        accountNumber: '12345603',
                        sortCode: '000003',
                      },
                      {
                        id: 86710604,
                        name: 'name 1',
                        emailAddress: 'name1@test.com',
                        bankAccountName: 'bank account name 14',
                        accountNumber: '12345604',
                        sortCode: '000004',
                      },
                      {
                        id: 86710605,
                        name: 'name 1',
                        emailAddress: 'name1@test.com',
                        bankAccountName: 'bank account name 15',
                        accountNumber: '12345605',
                        sortCode: '000005',
                      },
                      {
                        id: 86710606,
                        name: 'name 6',
                        emailAddress: 'name6@test.com',
                        bankAccountName: 'bank account name 61',
                        accountNumber: '12345606',
                        sortCode: '000006',
                      },
                      {
                        id: 86710607,
                        name: 'name 6',
                        emailAddress: 'name6@test.com',
                        bankAccountName: 'bank account name 62',
                        accountNumber: '12345607',
                        sortCode: '000007',
                      },
                      {
                        id: 86710608,
                        name: 'name 6',
                        emailAddress: 'name6@test.com',
                        bankAccountName: 'bank account name 63',
                        accountNumber: '12345608',
                        sortCode: '000008',
                      },
                      {
                        id: 86710609,
                        name: 'name 6',
                        emailAddress: 'name6@test.com',
                        bankAccountName: 'bank account name 64',
                        accountNumber: '12345609',
                        sortCode: '000009',
                      },
                      {
                        id: 86710610,
                        name: 'name 6',
                        emailAddress: 'name6@test.com',
                        bankAccountName: 'bank account name 65',
                        accountNumber: '12345610',
                        sortCode: '000010',
                      },
                      {
                        id: 86710611,
                        name: 'name 11',
                        emailAddress: 'name11@test.com',
                        bankAccountName: 'bank account name 111',
                        accountNumber: '12345611',
                        sortCode: '000011',
                      },
                    ],
                    sentForPayment : [
                      {
                        amountPaid: 140,
                        claimType: 'TRAVEL_TO_WORK',
                        sentForPaymentOn: '2023-12-01',
                        payeeId: 86710601
                      },
                      {
                        amountPaid: 150,
                        claimType: 'TRAVEL_TO_WORK',
                        sentForPaymentOn: '2023-12-02',
                        payeeId: 86710602
                      },
                      {
                        amountPaid: 150,
                        claimType: 'TRAVEL_TO_WORK',
                        sentForPaymentOn: '2023-12-03',
                        payeeId: 86710603
                      },
                      {
                        amountPaid: 150,
                        claimType: 'TRAVEL_TO_WORK',
                        sentForPaymentOn: '2023-12-04',
                        payeeId: 86710604
                      },
                      {
                        amountPaid: 150,
                        claimType: 'TRAVEL_TO_WORK',
                        sentForPaymentOn: '2023-12-05',
                        payeeId: 86710605
                      },
                    ]
                  }
                }
              }
             }
          }

          this.result.hooks.prerender(req, res, nextStub);

          expect(res.locals.payeeAccountDetails).to.deep.equal(
              [
                {
                  "accountNumber": "5601",
                  "bankAccountName": "bank account name 1",
                  "id": 86710601,
                  "lastPaid": "01/12/2023"
                },
                {
                  "accountNumber": "5602",
                  "bankAccountName": "bank account name 12",
                  "id": 86710602,
                  "lastPaid": "02/12/2023"
                },
                {
                  "accountNumber": "5603",
                  "bankAccountName": "bank account name 13",
                  "id": 86710603,
                  "lastPaid": "03/12/2023"
                },
                {
                  "accountNumber": "5604",
                  "bankAccountName": "bank account name 14",
                  "id": 86710604,
                  "lastPaid": "04/12/2023"
                },
                {
                  "accountNumber": "5605",
                  "bankAccountName": "bank account name 15",
                  "id": 86710605,
                  "lastPaid": "05/12/2023"
                }
              ]
          )
        })
      });

      describe('`preredirect` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');
        });
        it('should be inEditMode preredirect SW', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: (pageName) => {
                if(pageName === '__journey_type__') {
                  return {
                    journeyType: claimTypesFullName.SW
                  }
                }
              },
              setDataForPage: setDataForPageStub,
            },
          };

          req.inEditMode = true;

          const redirectStub = sinon.stub();

          res.redirect = redirectStub;

          this.result.hooks.preredirect(req, res, nextStub);

          sinon.assert.notCalled(nextStub);

          expect(redirectStub)
            .to
            .be
            .calledOnceWithExactly(
              '/claim/support-worker/check-your-answers');

          sinon.assert.notCalled(setDataForPageStub);
    
        });
        it('should be inEditMode preredirect TW', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: (pageName) => {
                if(pageName === '__journey_type__') {
                  return {
                    journeyType: claimTypesFullName.TW
                  }
                }
              },
              setDataForPage: setDataForPageStub,
            },
          };

          req.inEditMode = true;

          const redirectStub = sinon.stub();

          res.redirect = redirectStub;

          this.result.hooks.preredirect(req, res, nextStub);

          sinon.assert.notCalled(nextStub);

          expect(redirectStub)
            .to
            .be
            .calledOnceWithExactly(
              '/claim/travel-to-work/check-your-answers');

          sinon.assert.notCalled(setDataForPageStub);
    
        });
        it('should be inEditMode preredirect TIW', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: (pageName) => {
                if(pageName === '__journey_type__') {
                  return {
                    journeyType: claimTypesFullName.TIW
                  }
                }
              },
              setDataForPage: setDataForPageStub,
            },
          };

          req.inEditMode = true;

          const redirectStub = sinon.stub();

          res.redirect = redirectStub;

          this.result.hooks.preredirect(req, res, nextStub);

          sinon.assert.notCalled(nextStub);

          expect(redirectStub)
            .to
            .be
            .calledOnceWithExactly(
              '/claim/travel-in-work/check-your-answers');

          sinon.assert.notCalled(setDataForPageStub);
    
        });
      })

      describe('`postvalidate` key', () => {
        let sandbox;
        beforeEach(() => {
          this.result = page();
          sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext').callsFake();
        });
    
        afterEach(() => {
          sandbox.restore();
        });
    
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('postvalidate');
    
        });

        it('new payee', () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          const setDataForPageStub = sinon.stub();
          const setValidationErrorsForPage = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: (pageName) => {
                if (pageName === 'select-person-company-being-paid') {
                  return {
                    'bankDetails': 'new',
                  };
                } else if (pageName === 'person-company-being-paid') {
                  return {
                    'payee': '86710601'
                  }
                }
              },
              setDataForPage: setDataForPageStub,
              setValidationErrorsForPage: setValidationErrorsForPage,
            },
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          sinon.assert.calledTwice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, '__hidden_new_payee__', {
            newPayee: true,
          });
          sinon.assert.calledWith(setDataForPageStub.secondCall, '__hidden_existing_payee__',
            undefined);

          sinon.assert.notCalled(setValidationErrorsForPage);

          expect(req.inEditMode).to.be.false;
        });

        it('should go to the next page if continue is pressed adding existing payee', () => {
          const req = new Request();
          const res = new Response(req);
    
          const setDataForPageStub = sinon.stub();
          const setValidationErrorsForPageStub = sinon.stub();
          const nextStub = sinon.stub();
    
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
                if (page === 'select-person-company-being-paid') {
                  return {
                    bankDetails: '86710601'
                  };
                } else if (page === 'person-company-being-paid') {
                  return {
                    payee: '86710601'
                  };
                } else if (page === '__hidden_account__') {
                  return {
                    account: {
                      payees: [
                        {
                          id: 86710601,
                          name: 'name 1',
                          emailAddress: 'name1@test.com',
                          bankAccountName: 'bank account name 1',
                          accountNumber: '12345601',
                          sortCode: '000001',
                        },
                        {
                          id: 86710602,
                          name: 'name 1',
                          emailAddress: 'name1@test.com',
                          bankAccountName: 'bank account name 12',
                          accountNumber: '12345602',
                          sortCode: '000002',
                        },
                        {
                          id: 86710603,
                          name: 'name 1',
                          emailAddress: 'name1@test.com',
                          bankAccountName: 'bank account name 13',
                          accountNumber: '12345603',
                          sortCode: '000003',
                        },
                        {
                          id: 86710604,
                          name: 'name 1',
                          emailAddress: 'name1@test.com',
                          bankAccountName: 'bank account name 14',
                          accountNumber: '12345604',
                          sortCode: '000004',
                        },
                        {
                          id: 86710605,
                          name: 'name 1',
                          emailAddress: 'name1@test.com',
                          bankAccountName: 'bank account name 15',
                          accountNumber: '12345605',
                          sortCode: '000005',
                        },
                        {
                          id: 86710606,
                          name: 'name 6',
                          emailAddress: 'name6@test.com',
                          bankAccountName: 'bank account name 61',
                          accountNumber: '12345606',
                          sortCode: '000006',
                        },
                        {
                          id: 86710607,
                          name: 'name 6',
                          emailAddress: 'name6@test.com',
                          bankAccountName: 'bank account name 62',
                          accountNumber: '12345607',
                          sortCode: '000007',
                        },
                        {
                          id: 86710608,
                          name: 'name 6',
                          emailAddress: 'name6@test.com',
                          bankAccountName: 'bank account name 63',
                          accountNumber: '12345608',
                          sortCode: '000008',
                        },
                        {
                          id: 86710609,
                          name: 'name 6',
                          emailAddress: 'name6@test.com',
                          bankAccountName: 'bank account name 64',
                          accountNumber: '12345609',
                          sortCode: '000009',
                        },
                        {
                          id: 86710610,
                          name: 'name 6',
                          emailAddress: 'name6@test.com',
                          bankAccountName: 'bank account name 65',
                          accountNumber: '12345610',
                          sortCode: '000010',
                        },
                        {
                          id: 86710611,
                          name: 'name 11',
                          emailAddress: 'name11@test.com',
                          bankAccountName: 'bank account name 111',
                          accountNumber: '12345611',
                          sortCode: '000011',
                        },
                      ],
                    }
                  }
                }
                return undefined;
              },
              setDataForPage: setDataForPageStub,
              setValidationErrorsForPage: setValidationErrorsForPageStub
            }
          };
          this.result.hooks.postvalidate(req, res, nextStub);
          sinon.assert.callCount(setDataForPageStub, 9);
          sinon.assert.calledWith(setValidationErrorsForPageStub.getCall(0), 'person-company-being-paid-details', undefined);
          sinon.assert.calledWith(setValidationErrorsForPageStub.getCall(1), 'person-company-being-paid-postcode', undefined);
          sinon.assert.calledWith(setValidationErrorsForPageStub.getCall(2), 'person-company-being-paid-address', undefined);
          sinon.assert.calledWith(setValidationErrorsForPageStub.getCall(3), 'enter-person-company-being-paid-address', undefined);
          sinon.assert.calledWith(setValidationErrorsForPageStub.getCall(4), 'person-company-being-paid-payment-details', undefined);
        });
      });
    });
  })
});