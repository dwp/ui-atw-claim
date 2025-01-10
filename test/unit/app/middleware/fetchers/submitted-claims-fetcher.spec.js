const rewire = require('rewire');
const sinon = require('sinon');
const submittedClaimsFetcher = rewire('../../../../../app/middleware/fetchers/submitted-claims-fetcher');
const { claimTypesFullName } = require('../../../../../app/config/claim-types');

const axiosStub = sinon.stub();
const loggerDebugStub = sinon.stub();
const loggerErrorStub = sinon.stub();

let assert;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
  chai.use(require('chai-as-promised'));
})();

submittedClaimsFetcher.__set__('axios', axiosStub);
submittedClaimsFetcher.__set__('log', { debug: loggerDebugStub, error: loggerErrorStub });

describe('Submitted claims fetcher', () => {
  const nino = 'some nino';
  const awardType = 'some awardType';
  beforeEach(() => {
    axiosStub.reset();
    loggerDebugStub.reset();
    loggerErrorStub.reset();
  });

  it('should export an object with a function for fetching claims', () => {
    assert.typeOf(submittedClaimsFetcher, 'object');
    assert.typeOf(submittedClaimsFetcher.getSubmittedClaims, 'function');
  });

  describe('getSubmittedClaims', () => {
    it('should return claim(s) corresponding to the passed in nino and awardType if the endpoint is available', async () => {
      axiosStub.resolves(Promise.resolve({
        status: 200,
        data: {
            id: 26,
            createdDate: '2022-02-15T10:36:09.161',
            lastModifiedDate: '2022-02-15T10:36:09.161',
            claimStatus: 'AWAITING_COUNTER_SIGN',
            nino: 'AA370773A',
            claimType: 'TRAVEL_TO_WORK',
            workplaceContact: {
              employmentStatus: 'employed'
            },
        },
      }));
      const submittedClaims = await submittedClaimsFetcher.getSubmittedClaims(nino, awardType);
      expect(submittedClaims.claimStatus).to.be.deep.eq('AWAITING_COUNTER_SIGN');
      expect(submittedClaims.claimType).to.be.deep.eq(claimTypesFullName.TW);
    });

    it('should return undefined if the claim was not found', async () => {
      axiosStub.resolves(Promise.reject({
        response: {
          status: 404,
          respose: 'Claim not found',
        }
      }));
      const submittedClaims = await submittedClaimsFetcher.getSubmittedClaims(nino, awardType);

      expect(submittedClaims).to.be.undefined;
    });

    it('should throw an error if the endpoint is not available', async () => {
      const axiosResponse = {
        response: {
          status: 500,
          message: 'Oops... something went wrong',
        }
      }
      axiosStub.resolves(Promise.reject(axiosResponse));
      await expect(submittedClaimsFetcher.getSubmittedClaims()).to.be.rejectedWith(axiosResponse);
    });

    it('should log useful information if the endpoint is unavailable', async () => {
      axiosStub.resolves(Promise.reject({
        response: {
          status: 500,
          data: {
            message: 'Oops... something went wrong',
            error: 'more useful information',
          },
          message: 'Internal Server Error',
        }
      }));
      await submittedClaimsFetcher.getSubmittedClaims(nino, awardType).catch(() => {})

      expect(loggerErrorStub).calledWithMatch(`Error getting claims history for nino and ${awardType}`);
      expect(loggerErrorStub).calledWithMatch({
        response: {
          status: 500,
          data: {
            message: 'Oops... something went wrong',
            error: 'more useful information',
          },
          message: 'Internal Server Error',
        }
      });
    });
  });
});
