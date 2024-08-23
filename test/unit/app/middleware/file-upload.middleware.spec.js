const fileUpload = require('../../../../app/middleware/file-upload.middleware');
const sinon = require('sinon');
const DocumentUploadMiddleware = require('../../../../app/middleware/file-upload.middleware').DocumentUploadMiddleware;

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('middleware/file-upload.middleware', () => {

    it('should page a function', () => {
        assert.typeOf(fileUpload, 'function');
    });

    describe('Given a valid upload path', () => {
       
      it('should log the correct value to console', () => {
        
        console.log(DocumentUploadMiddleware);
        //assert.equal(DocumentUploadMiddleware, {});
      });
       
        
    });

});
