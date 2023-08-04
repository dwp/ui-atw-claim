const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const {
  assert,
  expect,
} = require('chai');
const sinon = require('sinon');
const {
  expectValidatorToFailWithJourney,
  expectValidatorToPass,
} = require('../../../../../../helpers/validator-assertions');
const validators = require(
  '../../../../../../../app/definitions/field-validators/common/workplaceContact/details-of-someone-who-can-confirm-costs',
);
const { claimTypesFullName } = require('../../../../../../../app/config/claim-types');
const page = require('../../../../../../../app/definitions/pages/common/workplaceContact/details-of-someone-who-can-confirm-costs');
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const removeAllSpaces = require('../../../../../../../app/utils/remove-all-spaces.js');

describe('definitions/pages/workplaceContact/details-of-someone-who-can-confirm-costs', () => {
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
          assert.equal(this.result.view, 'pages/common/workplaceContact/details-of-someone-who-can-confirm-costs.njk');
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

        it('should fail "required" validator if no value is provided for SW', async () => {
          await expectValidatorToFailWithJourney(
            validators,
            'confirmer-details',
            'fullName',
            'Required',
            new JourneyContext({
              __journey_type__: {
                journeyType: claimTypesFullName.SW,
              },
            }),

            {
              inline: 'details-of-someone-who-can-confirm-costs:inputs.fullName.errors.required.support-worker',
              summary: 'details-of-someone-who-can-confirm-costs:inputs.fullName.errors.required.support-worker',
            },
          );
        });

        it('should fail "required" validator if no value is provided for TW', async () => {
          await expectValidatorToFailWithJourney(
            validators,
            'confirmer-details',
            'emailAddress',
            'Required',
            new JourneyContext({
              __journey_type__: {
                journeyType: claimTypesFullName.TW,
              },
            }),

            {
              inline: 'details-of-someone-who-can-confirm-costs:inputs.emailAddress.errors.required.travel-to-work',
              summary: 'details-of-someone-who-can-confirm-costs:inputs.emailAddress.errors.required.travel-to-work',
            },
          );
        });

        it('should throw an error for journey type EA', async () => {
          const req = new Request();
          req.casa = {
            journeyContext: {
              getDataForPage: () => ({
                journeyType: claimTypesFullName.EA,
              }),
            },
          };
          await expectValidatorToPass(
            validators,
            'confirmer-details',
            'emailAddress',
            'Required',
            new JourneyContext({
              __journey_type__: {
                journeyType: claimTypesFullName.EA,
              },
            }),
            new Error(`Unsupported journey type ${req.casa.journeyType}`),
          );
        });
      });

      describe('prerender', () => {
        it('set res.locals', () => {
          const req = new Request();
          const res = new Response(req);
          req.casa = {
            journeyContext: {
              setDataForPage: sinon.stub(),
              getDataForPage: () => ({
                journeyType: claimTypesFullName.TW,
              }),
            },
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.journeyType)
            .to
            .deep
            .equal(claimTypesFullName.TW);
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
