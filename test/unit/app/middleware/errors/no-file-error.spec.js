const NoFileError = require('../../../../../app/middleware/errors/no-file-error');

let assert;
(async() => {
  assert = (await import ('chai')).assert;
})();

describe('NoFileError', () => {

    it('Returns error', () => {
      const error = new NoFileError('error');
      assert.equal(error.message, 'error');
      assert.equal(error.name, 'NoFileError');
    });
  }
);
