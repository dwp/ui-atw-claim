const MimeTypeError = require('../../../../../app/middleware/errors/mime-type-error');
const {
  assert
} = require('chai');
describe('MimeTypeError', () => {

    it('Returns error', () => {
      const error = new MimeTypeError('error');
      assert.equal(error.message, 'error');
      assert.equal(error.name, 'MimeTypeError');
    });
  }
);
