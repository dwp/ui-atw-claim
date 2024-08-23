const rewire = require('rewire');
const sinon = require('sinon');

let assert;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
})();

const accountDataFetcher = rewire('../../../../../app/middleware/fetchers/account-data-fetcher');

const axiosStub = sinon.stub();
const loggerDebugStub = sinon.stub();
const loggerErrorStub = sinon.stub();
accountDataFetcher.__set__('axios', axiosStub);
accountDataFetcher.__set__('log', { debug: loggerDebugStub, error: loggerErrorStub });

describe('Account data fetcher', () => {
  const nino = 'a nino';
  beforeEach(() => {
    axiosStub.reset();
    loggerDebugStub.reset();
    loggerErrorStub.reset();
  });

  it('should export an object with a function for fetching account data', () => {
    assert.typeOf(accountDataFetcher, 'object');
    assert.typeOf(accountDataFetcher.getAccountData, 'function');
  });

  describe('getAccountData', () => {
    it('should return account data if the endpoint is available', async () => {
      axiosStub.resolves(Promise.resolve({
        status: 200,
        data: {
          some: 'account data',
        },
      }));
      const account = await accountDataFetcher.getAccountData(nino);
      expect(account).to.be.deep.eq({ some: 'account data' });
    });

    it('should return undefined if the account was not found', async () => {
      axiosStub.resolves(Promise.reject({
        response: {
          status: 404,
          respose: 'Account not found',
        }
      }));
      const account = await accountDataFetcher.getAccountData(nino);

      expect(account).to.be.undefined;
    });

    it('should throw an error if the endpoint is not available', async () => {
      const axiosResponse = {
        response: {
          status: 500,
          message: 'Oops... something went wrong',
        }
      }
      axiosStub.resolves(Promise.reject(axiosResponse));

      await expect(accountDataFetcher.getAccountData()).to.be.rejectedWith(axiosResponse);
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
      await accountDataFetcher.getAccountData(nino).catch(() => {})

      expect(loggerErrorStub).calledWithMatch('Unexpected status code from ms-disc-query service');
      expect(loggerErrorStub).calledWithMatch('Oops... something went wrong');
      expect(loggerErrorStub).calledWithMatch('Internal Server Error');
    });

    it('should remove the data from the error json', async () => {
      axiosStub.resolves(Promise.reject({
        response:{
          status: 400,
          config: {
            "method": "post",
            "url": "http://localhost:9021/account",
            "data": "{\"nino\":\"a nino\"}"
          },
          message: 'No service available',
        }
      }));
      try {
        await accountDataFetcher.getAccountData(nino);
      } catch (e) {
        expect(e.response.config.data).to.be.undefined;
      }
    });

  });
});