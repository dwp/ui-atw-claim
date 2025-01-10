const page = require(
  '../../../../../../../app/definitions/pages/common/payee-details/about-the-person-or-company-being-paid');
const sinon = require('sinon');
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('definitions/pages/common/payee-details/about-the-person-or-company-being-paid', () => {
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
            'pages/common/payee-details/about-the-person-or-company-being-paid.njk');
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

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  payees: [
                    {
                      'value': 0,
                      'name': 'Mr John Smith',
                      'email': 'email@email.com',
                    },
                  ],
                },
              };
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(res.locals.payees)
            .to
            .deep
            .equal([
              {
                'value': 0,
                'name': 'Mr John Smith',
                'email': 'email@email.com',
              },
            ]);
        });

        it('should allow user to add a new payee, even if they are in edit mode', () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  payees: [
                    {
                      'value': 0,
                      'name': 'Mr John Smith',
                      'email': 'email@email.com',
                    },
                  ],
                },
              };
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(res.locals.shouldHaveOptionToAddNewPayee)
            .to
            .be
            .true;

        })

        it('should prevent the user from adding a new payee, when they just added a new payee', () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          req.casa.journeyContext = {
            getDataForPage: (pageName) => {
              if (pageName === '__hidden_account__') {
                return {
                  account: {
                    payees: [
                      {
                        'value': 0,
                        'name': 'Mr John Smith',
                        'email': 'email@email.com',
                      },
                    ],
                  },
                };
              }
              if (pageName === '__hidden_new_payee__') {
                return { newPayee: true }
              };
            }
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(res.locals.shouldHaveOptionToAddNewPayee)
            .to
            .be
            .false;
        })
      });

      describe('`postvalidate` key', () => {

        it('new payee', () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          const setDataForPageStub = sinon.stub();
          const setValidationErrorsForPage = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: (pageName) => {
                if (pageName === 'person-company-being-paid') {
                  return {
                    'payee': 'new',

                  };
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

        it('existing payee', () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          const setDataForPageStub = sinon.stub();
          const setValidationErrorsForPage = sinon.stub();



          req.casa = {
            journeyContext: {
              getDataForPage: (pageName) => {
                if (pageName === 'person-company-being-paid') {
                  return {
                    'payee': '0',

                  };
                }
                if (pageName === '__hidden_account__') {
                  return {
                    'account': {
                      payees: [
                        {
                          'id': 0,
                          'bankAccountName': 'Mr John Smith',
                          'email': 'email@email.com',
                        },
                        {
                          'id': 1,
                          'name': 'Mr Jonna Smith',
                          'email': 'jonna@email.com',
                        },
                      ],
                    }
                  };
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

          sinon.assert.callCount(setDataForPageStub, 8);
          sinon.assert.calledWith(setDataForPageStub.getCall(0), '__hidden_new_payee__', {
            newPayee: false,
          });
          sinon.assert.calledWith(setDataForPageStub.getCall(1), '__hidden_existing_payee__', {
            fullName: 'Mr John Smith',
            emailAddress: 'email@email.com',
          });
          sinon.assert.calledWith(setDataForPageStub.getCall(2), 'person-company-being-paid-details',
            undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(3),
            'person-company-being-paid-postcode', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(4), '__hidden_address__', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(5),
            'person-company-being-paid-address', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(6),
            'enter-person-company-being-paid-address', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(7),
            'person-company-being-paid-payment-details', undefined);

          sinon.assert.callCount(setValidationErrorsForPage, 5);
          sinon.assert.calledWith(setValidationErrorsForPage.getCall(0), 'person-company-being-paid-details',
            undefined);
          sinon.assert.calledWith(setValidationErrorsForPage.getCall(1),
            'person-company-being-paid-postcode', undefined);
          sinon.assert.calledWith(setValidationErrorsForPage.getCall(2),
            'person-company-being-paid-address', undefined);
          sinon.assert.calledWith(setValidationErrorsForPage.getCall(3),
            'enter-person-company-being-paid-address', undefined);
          sinon.assert.calledWith(setValidationErrorsForPage.getCall(4),
            'person-company-being-paid-payment-details', undefined);

        });
      });
    });
  });
});
