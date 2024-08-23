const FileLimitError = require('../../../../../app/middleware/errors/file-limit-error');

let assert;
(async() => {
  assert = (await import ('chai')).assert;
})();

describe('FileLimitError', () => {

    it('Returns error', () => {
      const error = new FileLimitError('error');
      assert.equal(error.message, 'error');
      assert.equal(error.name, 'FileLimitError');
    });
  }
);
