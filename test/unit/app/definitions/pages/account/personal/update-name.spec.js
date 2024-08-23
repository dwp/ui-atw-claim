const page = require(
  '../../../../../../../app/definitions/pages/account/personal/update-name');
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const sinon = require('sinon');
const validators = require('../../../../../../../app/definitions/field-validators/common/personal/update-name');
const {
  expectValidatorToFail, 
  expectValidatorToPass
} = require('../../../../../../helpers/validator-assertions');

let assert, expect;

(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();

describe('definitions/pages/account/personal/update-name', () => {
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
          assert.equal(this.result.view, 'pages/account/personal/update-name.njk');
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
            `/claim/personal/change-personal-details`);
        });
      });
    });
    describe('field validation - required', () => {
      it('should fail "required" validator if no value is provided for firstName', async () => {
        await expectValidatorToFail(
          validators,
          'firstName',
          'Required',
          { firstName: '' });
      });
      it('should fail "required" validator if no value is provided for lastName', async () => {
        await expectValidatorToFail(
          validators,
          'lastName',
          'Required',
          { lastName: '' });
      });
      it('should pass "required" validator if value is provided for firstName', async () => {
        await expectValidatorToPass(
          validators,
          'firstName',
          'Required',
          { firstName: 'Neil' });
      });
      it('should pass "required" validator if value is provided for lastName', async () => {
        await expectValidatorToPass(
          validators,
          'lastName',
          'Required',
          { lastName: 'Cooper' });
      });
    });
    describe('field validation - invalid', () => {
      it('should fail "invalid" validator if firstName is provided as numeric value', async () => {
        await expectValidatorToFail(
          validators,
          'firstName',
          'Regex',
          { firstName: '123' });
      });
      it('should fail "invalid" validator if lastName contains number', async () => {
        await expectValidatorToFail(
          validators,
          'lastName',
          'Regex',
          { lastName: 'Cooper123' });
      });
      it('should fail "invalid" validator if firstName having unexpected character', async () => {
        await expectValidatorToFail(
          validators,
          'firstName',
          'Regex',
          { firstName: 'Neil!@£' });
      });
      it('should pass "invalid" validator if lastName is provided with valid characters', async () => {
        await expectValidatorToPass(
          validators,
          'lastName',
          'Regex',
          { lastName: 'Cooper S' });
      });
    });
  });
});
