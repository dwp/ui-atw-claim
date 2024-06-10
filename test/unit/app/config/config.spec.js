const assert = require('chai').assert;

describe('config/config-mapping', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../../../../app/config/config-mapping')];
  });

  it('should export a function', () => {
    const config = require('../../../../app/config/config-mapping');
    assert.typeOf(config, 'object');
  });

  it('should mount the url', () => {
    const config = require('../../../../app/config/config-mapping');
    assert.equal(config.mountURL, '/claim/');
  });

  it('should get 10MB for file upload limited', () => {
    const config = require('../../../../app/config/config-mapping');
    assert.equal(config.fileSizeLimit, 10000000);
  });

  it('should get 90 for file number limit to upload evidences', () => {
    const config = require('../../../../app/config/config-mapping');
    assert.equal(config.numberOfFilesLimit, 90);
  });
});
