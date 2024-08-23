const rewire = require('rewire');
const sinon = require('sinon');

let assert;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
})();

const ninoFetcher = rewire('../../../../../app/middleware/fetchers/nino-fetcher');

const axiosStub = sinon.stub();
const loggerDebugStub = sinon.stub();
const loggerErrorStub = sinon.stub();
ninoFetcher.__set__('axios', axiosStub);
ninoFetcher.__set__('log', { debug: loggerDebugStub, error: loggerErrorStub });

describe('Nino fetcher', () => {
  const oauthToken = 'access_token';
  const guid = 'some uuid';
  beforeEach(() => {
    axiosStub.reset();
    loggerDebugStub.reset();
    loggerErrorStub.reset();
  });

  it('should export an object with a function for fetching nino', () => {
    assert.typeOf(ninoFetcher, 'object');
    assert.typeOf(ninoFetcher.getNinoFromDwpGuid, 'function');
  });

  describe('getNinoFromDwpGuid', () => {
    it('should return a nino corresponding to the passed in guid if the endpoint is available', async () => {
      axiosStub.resolves(Promise.resolve({
        status: 200,
        data: {
          identifier: 'PW001001D',
          type: 'NINO',
        },
      }));
      const nino = await ninoFetcher.getNinoFromDwpGuid(guid, oauthToken);
      expect(nino).to.be.equal('PW001001D');
    });

    it('should return undefined if the endpoint is unavailable', async () => {
      axiosStub.resolves(Promise.reject({
        response: {
          status: 500,
          message: 'Oops... something went wrong',
        }
      }));
      const nino = await ninoFetcher.getNinoFromDwpGuid(guid, oauthToken);

      expect(nino).to.be.undefined;
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
      await ninoFetcher.getNinoFromDwpGuid(guid, oauthToken);

      expect(loggerErrorStub).calledWithMatch('Unexpected status code from guidLookup');
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
