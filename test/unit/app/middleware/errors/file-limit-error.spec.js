const FileLimitError = require('../../../../../app/middleware/errors/file-limit-error');
const {
  assert
} = require('chai');
describe('FileLimitError', () => {

    it('Returns error', () => {
      const error = new FileLimitError('error');
      assert.equal(error.message, 'error');
      assert.equal(error.name, 'FileLimitError');
    });
  }
);
