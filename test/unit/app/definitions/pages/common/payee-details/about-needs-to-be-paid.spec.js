const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const page = require(
  '../../../../../../../app/definitions/pages/common/payee-details/about-needs-to-be-paid');
const sinon = require('sinon');
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const { claimTypesFullName } = require('../../../../../../../app/config/claim-types');
const validators = require(
  '../../../../../../../app/definitions/field-validators/common/payee-details/about-needs-to-be-paid',
);
const { removeAllSpaces } = require('../../../../../../../app/utils/remove-all-spaces.js');
const { trimWhitespace } = require('@dwp/govuk-casa').gatherModifiers;
const {
  expectValidatorToFailWithJourney, 
  expectValidatorToPass
} = require('../../../../../../helpers/validator-assertions');

let assert, expect;

(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();

describe('definitions/pages/common/payee-details/about-needs-to-be-paid', () => {
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
          assert.equal(this.result.view, 'pages/common/payee-details/about-needs-to-be-paid.njk');
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

        it('should fail "invalid" validator if no valid value is provided (no domain provided)', async () => {
          await expectValidatorToFailWithJourney(
            validators,
            'person-company-being-paid-payment-details',
            'emailAddress',
            'Regex',
            new JourneyContext({
              __journey_type__: {
                journeyType: claimTypesFullName.SW,
              },
              ['person-company-being-paid-payment-details']: {
                emailAddress: 'john@john.',
              },
            }),
            {
              inline: 'about-needs-to-be-paid:inputs.emailAddress.errors.invalid',
              summary: 'about-needs-to-be-paid:inputs.emailAddress.errors.invalid',
            },
          );
        });
        
        it('should fail "invalid" validator if no valid value is provided (no .com or .co.uk etc provided))', async () => {
          await expectValidatorToFailWithJourney(
            validators,
            'person-company-being-paid-payment-details',
            'emailAddress',
            'Regex',
            new JourneyContext({
              __journey_type__: {
                journeyType: claimTypesFullName.SW,
              },
              ['person-company-being-paid-payment-details']: {
                emailAddress: 'john@john',
              },
            }),
            {
              inline: 'about-needs-to-be-paid:inputs.emailAddress.errors.invalid',
              summary: 'about-needs-to-be-paid:inputs.emailAddress.errors.invalid',
            },
          );
        });

        it('should pass if valid value is provided', async () => {
          await expectValidatorToPass(
            validators,
            'person-company-being-paid-payment-details',
            'emailAddress',
            'Regex',
            new JourneyContext({
              __journey_type__: {
                journeyType: claimTypesFullName.SW,
              },
              ['person-company-being-paid-payment-details']: {
                emailAddress: 'john@john.co.uk',
              },
            }),
          );
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
        });

        it(claimTypesFullName.EA, () => {

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          const setDataForPageStub = sinon.stub();
          const getDataForPageStub = sinon.stub()
            .returns({
              journeyType: claimTypesFullName.EA,
            });
          req.casa = {
            journeyContext: {
              getDataForPage: getDataForPageStub,
              setDataForPage: setDataForPageStub,
            },
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

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('__hidden_new_payee__', { newPayee: true });
        });

        it(claimTypesFullName.SW, () => {

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: (pageName) => {
                if (pageName === '__journey_type__') {
                  return {
                    journeyType: claimTypesFullName.SW,
                  };
                }
                if (pageName === '__hidden_account__') {
                  return {
                    account: {
                      payees: [
                        {
                          value: 0,
                          name: "name",
                          email: "email",
                        }
                      ],
                    },
                  };
                }
              },
              setDataForPage: setDataForPageStub,
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(res.locals.journeyType)
            .to
            .deep
            .equal(claimTypesFullName.SW);

          sinon.assert.notCalled(setDataForPageStub);

        });

        it('SW - not existing payee', () => {

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: (pageName) => {
                if (pageName === '__journey_type__') {
                  return {
                    journeyType: claimTypesFullName.SW,
                  };
                }
                if (pageName === '__hidden_account__') {
                  return {
                    account: {
                      payees: [],
                    },
                  };
                }
              },
              setDataForPage: setDataForPageStub,
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(res.locals.journeyType)
            .to
            .deep
            .equal(claimTypesFullName.SW);

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('__hidden_new_payee__', { newPayee: true });
        });

        it(claimTypesFullName.TW, () => {

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: (pageName) => {
                if (pageName === '__journey_type__') {
                  return {
                    journeyType: claimTypesFullName.TW,
                  };
                }
                if (pageName === '__hidden_account__') {
                  return {
                    account: {
                      payees: [
                        {
                          value: 0,
                          name: "name",
                          email: "email",
                        }
                      ],
                    },
                  };
                }
                if (pageName === 'which-journey-type') {
                  return {
                    howDidYouTravelForWork: 'lift'
                  };
                }
              },
              setDataForPage: setDataForPageStub,
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(res.locals.journeyType)
            .to
            .deep
            .equal(claimTypesFullName.TW);

            expect(res.locals.howDidYouTravelForWork)
            .to
            .deep
            .equal('lift');

          sinon.assert.notCalled(setDataForPageStub);

        });

        describe('Utils: removeAllSpaces', () => {
          it('should export a function', () => {
            expect(removeAllSpaces)
              .to
              .be
              .a('function');
          });

          it('should strip spaces from fullName string', () => {
            expect(Object.keys(this.result))
              .to
              .includes('fieldGatherModifiers');

            const req = new Request();

            req.body.fullName = {
              fieldValue: '   Test Name   '
            };

            const expectedFullName = 'Test Name';

            expect(trimWhitespace(req.body.fullName))
                .to
                .equal(expectedFullName);
          });

          it('should strip spaces from emailAddress string', () => {
            expect(Object.keys(this.result))
                .to
                .includes('hooks');
            expect(Object.keys(this.result.hooks))
                .to
                .includes('pregather');

            const req = new Request();
            const res = new Response(req);
            const nextStub = sinon.stub();

            req.body.emailAddress = ' t e s t @ e m a i l . c o . u k  ';

            this.result.hooks.pregather(req, res, nextStub);

            expect(req.body.emailAddress)
                .to
                .equal('test@email.co.uk');
          });
        });
      });
    });
  });
});
