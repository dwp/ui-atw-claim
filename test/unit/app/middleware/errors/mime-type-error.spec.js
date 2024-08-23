const MimeTypeError = require('../../../../../app/middleware/errors/mime-type-error');

let assert;
(async() => {
  assert = (await import ('chai')).assert;
})();

describe('MimeTypeError', () => {

    it('Returns error', () => {
      const error = new MimeTypeError('error');
      assert.equal(error.message, 'error');
      assert.equal(error.name, 'MimeTypeError');
    });
  }
);
