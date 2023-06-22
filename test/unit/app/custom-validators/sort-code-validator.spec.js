const sortCodeValidator = require('../../../../app/custom-validators/sort-code-validator');
const { ValidationError } = require('@dwp/govuk-casa');
const {
  assert,
  expect
} = require('chai');

describe('app/custom-validators/sortCode', () => {
  it('should return a function', () => {
    assert.typeOf(sortCodeValidator, 'function');
  });

  describe('when invoked', () => {
    let errorMessages = {
      regexError: {
        summary: 'custom-validation:sortCodeValidation.regexError.summary',
        inline: 'custom-validation:sortCodeValidation.regexError.inline',
      },
      invalidLength: {
        summary: 'custom-validation:sortCodeValidation.invalidLength.summary',
        inline: 'custom-validation:sortCodeValidation.invalidLength.inline',
      }
    };

    it('should resolve promise if valid sortcode entered', (done) => {
      sortCodeValidator('111111')
        .then(
          () => {
            done();
          },
          () => {
            done.fail('Promise should be resolved');
          }
        );
    });

    it('should resolve promise if valid sortcode entered with spaces', (done) => {
      sortCodeValidator('11-11-11')
        .then(
          () => {
            done();
          },
          () => {
            done.fail('Promise should be resolved');
          }
        );
    });

    it('should reject promise if invalid characters in sort code', (done) => {
      sortCodeValidator.bind({ errorMsg: errorMessages.regexError })('$$1122')
        .then(
          () => {
            done.fail('Promise should be rejected');
          },
          (err) => {
            assert.equal(err.summary, errorMessages.regexError.summary);
            done();
          }
        );
    });

    it('should reject promise if sort code to short', (done) => {
      sortCodeValidator.bind({ invalidLengthErrorMsg: errorMessages.invalidLength })('2343')
        .then(
          () => {
            done.fail('Promise should be rejected');
          },
          (err) => {
            assert.equal(err.summary, errorMessages.invalidLength.summary);
            done();
          }
        );

    });

    it('should reject promise if sort code to long', (done) => {
      sortCodeValidator.bind({ invalidLengthErrorMsg: errorMessages.invalidLength })('2343123123')
        .then(
          () => {
            done.fail('Promise should be rejected');
          },
          (err) => {
            assert.equal(err.summary, errorMessages.invalidLength.summary);
            done();
          }
        );
    });
  });
});
