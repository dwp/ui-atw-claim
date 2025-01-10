const customFileValidator = require('../../../../app/custom-validators/file-list-validators');
const sinon = require('sinon');
const { claimTypesFullName } = require('../../../../app/config/claim-types');

let assert;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
chai.use(require('sinon-chai'));
})();


describe('Validators: file-list-validators', () => {

  let dataContext = {
    journeyContext: {
      setDataForPage: sinon.stub(),
    },
  };

  it('should be true for when files are uploaded, and wants to add more', async () => {
    dataContext.journeyContext.getDataForPage = (page) => {
      if (page === 'receipts-invoices-uploaded') {
        return {
          uploadMore: 'yes',
        };
      } else if ('__hidden_uploaded_files__') {
        return {
          files: [
            {
              fileId: 'fileId',
              fileName: 'Name',
            }],
        };
      } else {
        throw Error('page not supported');
      }
    };
    assert.equal(await customFileValidator.FileList({ waypointId: 'your-document-1' }, dataContext),
      true);

  });

  it('should be true for when no files are uploaded, and wants to add more', async () => {
    dataContext.journeyContext.getDataForPage = (page) => {
      if (page === 'receipts-invoices-uploaded') {
        return {
          uploadMore: 'yes',
        };
      } else if ('__hidden_uploaded_files__') {
        return {
          files: [],
        };
      } else {
        throw Error('page not supported');
      }
    };
    assert.equal(await customFileValidator.FileList({ waypointId: 'your-document-1' }, dataContext),
      true);
  });

  it('should be true for when  files are undefined, and wants to add more', async () => {
    dataContext.journeyContext.getDataForPage = (page) => {
      if (page === 'receipts-invoices-uploaded') {
        return {
          uploadMore: 'yes',
        };
      } else if ('__hidden_uploaded_files__') {
        return {
          files: undefined,
        };
      } else {
        throw Error('page not supported');
      }
    };
    assert.equal(await customFileValidator.FileList({ waypointId: 'your-document-1' }, dataContext),
      true);
  });

  it(
    `should return error as user has no files and does not want to upload any more - ${claimTypesFullName.EA}`,
    async () => {
      dataContext.journeyContext.getDataForPage = (page) => {
        if (page === 'receipts-invoices-uploaded') {
          return {
            uploadMore: 'no',
          };
        } else if (page === '__hidden_uploaded_files__') {
          return {
            files: [],
          };
        } else if (page === '__journey_type__') {
          return {
            journeyType: claimTypesFullName.EA,
          };
        } else {
          throw Error(`page not supported ${page}`);
        }
      };
      try {
        assert.equal(
          await customFileValidator.FileList({ waypointId: 'your-document-1' }, dataContext), true);
        assert.fail();
      } catch (e) {
        assert.equal(e.message,
          'receipts-or-invoices-uploaded:validation.noFiles');
      }
    });

  it(
    `should return error as user has no files and does not want to upload any more - ${claimTypesFullName.SW}`,
    async () => {
      dataContext.journeyContext.getDataForPage = (page) => {
        if (page === 'receipts-invoices-uploaded') {
          return {
            uploadMore: 'no',
          };
        } else if (page === '__hidden_uploaded_files__') {
          return {
            files: [],
          };
        } else if (page === '__journey_type__') {
          return {
            journeyType: claimTypesFullName.SW,
          };
        } else {
          throw Error(`page not supported ${page}`);
        }
      };
      try {
        assert.equal(
          await customFileValidator.FileList({ waypointId: 'your-document-1' }, dataContext), true);
        assert.fail();
      } catch (e) {
        assert.equal(e.message, 'receipts-or-invoices-uploaded:validation.noFiles');
      }
    });

  it(
    `should return error as user has no files and does not want to upload any more - ${claimTypesFullName.TW}`,
    async () => {
      dataContext.journeyContext.getDataForPage = (page) => {
        if (page === 'receipts-invoices-uploaded') {
          return {
            uploadMore: 'no',
          };
        } else if (page === '__hidden_uploaded_files__') {
          return {
            files: [],
          };
        } else if (page === '__journey_type__') {
          return {
            journeyType: claimTypesFullName.TW,
          };
        } else {
          throw Error(`page not supported ${page}`);
        }
      };
      try {
        assert.equal(
          await customFileValidator.FileList({ waypointId: 'your-document-1' }, dataContext), true);
        assert.fail();
      } catch (e) {
        assert.equal(e.message, 'receipts-or-invoices-uploaded:validation.noFiles');
      }
    });

  it(`should return exception when unsupported - TIW`, async () => {
    dataContext.journeyContext.getDataForPage = (page) => {
      if (page === 'receipts-invoices-uploaded') {
        return {
          uploadMore: 'no',
        };
      } else if (page === '__hidden_uploaded_files__') {
        return {
          files: [],
        };
      } else if (page === '__journey_type__') {
        return {
          journeyType: 'TIW',
        };
      } else {
        throw Error(`page not supported ${page}`);
      }
    };
    try {
      assert.equal(
        await customFileValidator.FileList({ waypointId: 'your-document-1' }, dataContext), true);
      assert.fail();
    } catch (e) {
      assert.equal(e.message, 'Unsupported journey type TIW');
    }
  });
});
