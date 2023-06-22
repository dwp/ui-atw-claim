const rewire = require('rewire');
const sinon = require('sinon');
const {
  assert, expect,
} = require('chai');

const oauthTokenFetcher = rewire('../../../../../app/middleware/fetchers/oauth-token-fetcher');

const axiosStub = sinon.stub();
const loggerDebugStub = sinon.stub();
const loggerErrorStub = sinon.stub();
oauthTokenFetcher.__set__('axios', axiosStub);
oauthTokenFetcher.__set__('log', { debug: loggerDebugStub, error: loggerErrorStub });

describe('Oauth token fetcher', () => {
  beforeEach(() => {
    axiosStub.reset();
    loggerDebugStub.reset();
    loggerErrorStub.reset();
  });

  it('should export an object with a function for fetching oauth token', () => {
    assert.typeOf(oauthTokenFetcher, 'object');
    assert.typeOf(oauthTokenFetcher.getOAuthToken, 'function');
  });

  describe('getOAuthToken', () => {
    it('should return the oauth token if the endpoint is available', async () => {
      axiosStub.resolves(Promise.resolve({
        status: 200,
        data: {
          access_token: 'accessToken',
          id_token: 'idToken',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      }));
      const oauthToken = await oauthTokenFetcher.getOAuthToken();
      expect(oauthToken).to.be.equal('accessToken');
    });

    it('should throw an error if the endpoint is unavailable', async () => {
      const errorResponse = {
        response: {
          status: 500,
          message: 'Oops... something went wrong',
        }
      }
      axiosStub.resolves(Promise.reject(errorResponse));

      await expect(oauthTokenFetcher.getOAuthToken()).to.be.rejectedWith(errorResponse)
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
      await oauthTokenFetcher.getOAuthToken().catch(() => {});

      expect(loggerErrorStub).calledWithMatch('Unexpected status code from COGNITO');
      expect(loggerErrorStub).calledWithMatch('Oops... something went wrong');
      expect(loggerErrorStub).calledWithMatch('Internal Server Error');
    });
  });
});
