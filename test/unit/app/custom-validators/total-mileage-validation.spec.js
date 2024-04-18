const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const validators = require('../../../../app/custom-validators/total-mileage-validation');
const { claimTypesFullName } = require('../../../../app/config/claim-types');

chai.use(chaiAsPromised);
const {
  expect,
  assert,
} = chai;

describe('Validators: totalMileageValidation', () => {
  describe('validate - total mileage', () => {
    const getDataForPageStub = sinon
      .stub()
      .returns({
        journeyType: claimTypesFullName.TiW,
      });

    const journeyContext = {
      journeyContext: {
        getDataForPage: getDataForPageStub,
      },
    };

    it('leave total mileage empty', async () => {
      const queue = [];
      queue.push(expect(validators.make()
        .validate('', journeyContext))
        .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
          assert.equal(v.inline, 'total-mileage:validation.required');
          assert.equal(v.summary, 'total-mileage:validation.required');
          return true;
        }));
      return Promise.all(queue);
    });

    it('Decimal value for total mileage', async () => {
      const queue = [];
      queue.push(expect(validators.make()
        .validate('10.5', journeyContext))
        .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
          assert.equal(v.inline, 'total-mileage:validation.nonDecimal');
          assert.equal(v.summary, 'total-mileage:validation.nonDecimal');
          return true;
        }));
      return Promise.all(queue);
    });

    it('Non-numeric value for total mileage', async () => {
        const queue = [];
        queue.push(expect(validators.make()
          .validate('abc', journeyContext))
          .to
          .be
          .rejected
          .eventually
          .satisfy((v) => {
            assert.equal(v.inline, 'total-mileage:validation.nonNumeric');
            assert.equal(v.summary, 'total-mileage:validation.nonNumeric');
            return true;
          }));
        return Promise.all(queue);
      });
  });
});
