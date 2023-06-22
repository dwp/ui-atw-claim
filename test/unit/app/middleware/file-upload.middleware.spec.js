const fileUpload = require('../../../../app/middleware/file-upload.middleware');
const chai = require('chai');
const {
  assert,
  expect
} = chai;
const sinon = require('sinon');
chai.use(require('sinon-chai'));

const DocumentUploadMiddleware = require('../../../../app/middleware/file-upload.middleware').DocumentUploadMiddleware;

const Busboy = require('busboy');
const NoFileError = require('../../../../app/middleware/errors/no-file-error');
const MimetypeError = require('../../../../app/middleware/errors/mime-type-error');
const FileLimitError = require('../../../../app/middleware/errors/file-limit-error');

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
