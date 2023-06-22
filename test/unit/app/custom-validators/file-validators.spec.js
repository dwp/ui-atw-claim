const customFileValidator = require('../../../../app/custom-validators/file-validators');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
chai.use(chaiAsPromised);
const {
  expect,
  assert
} = chai;

describe('Validators: file-validators', () => {
  let dataContext = {
    journeyContext: {
      setDataForPage: sinon.stub()
    },
  };

  it('should be true for valid type, and right size files', async () => {
    let dataset = {
      isInvalidMimeType: false,
      isFileLimitExceeded: false,
    };
    dataContext.journeyContext.getDataForPage = () => dataset;
    assert.equal(await customFileValidator.FileFormat({ waypointId: 'your-document-1' }, dataContext), true);
    assert.equal(await customFileValidator.MaxFileSize({ waypointId: 'your-document-1' }, dataContext), true);
  });

  it('FileFormat: should reject invalid file type', async () => {
    let dataset = {
      isInvalidMimeType: true,
      isFileLimitExceeded: false,
    };
    dataContext.journeyContext.getDataForPage = () => dataset;
    assert.equal(await customFileValidator.MaxFileSize({ waypointId: 'your-document-1' }, dataContext), true);
    try {
      await customFileValidator.FileFormat({ waypointId: 'your-document-1' }, dataContext);
      assert.fail();
    } catch (e) {
      assert.equal(e.message, 'upload-receipts-or-invoices:errors.invalidType');
    }
  });

  it('MaxFileSize: should reject file size exceeding 10MB', async () => {
    let dataset = {
      isInvalidMimeType: false,
      isFileLimitExceeded: true,
    };
    dataContext.journeyContext.getDataForPage = () => dataset;
    assert.equal(await customFileValidator.FileFormat({ waypointId: 'your-document-1' }, dataContext)
      , true);
    try {
      await customFileValidator.MaxFileSize({ waypointId: 'your-document-1' }, dataContext);
      assert.fail();
    } catch (e) {
      assert.equal(e.message, 'upload-receipts-or-invoices:errors.tooLarge');
    }
  });
});
