const page = require(
  '../../../../../../../app/definitions/pages/account/personal/new-phone-number');
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const sinon = require('sinon');
const validators = require(
  '../../../../../../../app/definitions/field-validators/common/personal/new-phone-number');
const {
  expectValidatorToFailWithJourney, 
  expectValidatorToPass
} = require('../../../../../../helpers/validator-assertions');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

let assert, expect;

(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();

describe('definitions/pages/account/personal/new-phone-number', () => {
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
          assert.equal(this.result.view, 'pages/account/personal/new-phone-number.njk');
        });
      });
    });
    describe('returned object keys', () => {
      describe('`prerender` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');
        });
        it('set res.locals', () => {
          const req = new Request();
          const res = new Response(req);

          this.result.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.locals.forceShowBackButton, true);
          assert.equal(res.locals.casa.journeyPreviousUrl,
            `/claim/personal/telephone-number-change`);
        });
      });
    });
    describe('returned object keys', () => {
      describe('fieldValidators key', () => {
        it('should fail "regex" validator if not number format', async () => {
          const journeyContext = new JourneyContext({
            ['new-phone-number']: {
              homeNumber: 'Hello',
            },
            ['new-phone-number-stash']: { 
              homeNumber: '07777777777' 
            }
          })
          await expectValidatorToFailWithJourney(
            validators,
            'new-phone-number',
            'homeNumber',
            'Regex',
            journeyContext, {
              summary: 'new-phone-number:inputs.homeNumber.errors.invalid',
              inline: 'new-phone-number:inputs.homeNumber.errors.invalid',
            });

            expect(journeyContext.data['new-phone-number'].homeNumber).that.equals('07777777777');
        });
        
        it('should pass "regex" validator with number format', async () => {
            await expectValidatorToPass(
              validators,
              'homeNumber',
              'Regex',
              { homeNumber: '07777777777' });
        });
      });
    });
  });
});
