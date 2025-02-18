const rewire = require('rewire');
const middleware = rewire('../../../../app/middleware/account.middleware');
const sinon = require('sinon');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');

const {
  jwt,
  testGuid,
} = require('../helpers/test-data');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const getOAuthTokenStub = sinon.stub();
const getNinoStub = sinon.stub();
const getAccountDataStub = sinon.stub();
const getGuidFromJwtStub = sinon.stub();

let expect;
(async() => {
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

middleware.__set__('oauthTokenFetcher', { getOAuthToken: getOAuthTokenStub });
middleware.__set__('ninoFetcher', { getNinoFromDwpGuid: getNinoStub });
middleware.__set__('accountDataFetcher', { getAccountData: getAccountDataStub });
middleware.__set__('getGuidFromJwt', getGuidFromJwtStub);

describe('Middleware: account', () => {
  let app;
  let req;
  let res;
  let nextStub;
  let sandbox;

  beforeEach(() => {
    app = {
      use(mw) {
        this.use = mw;
      },
    };
    req = new Request();
    res = new Response(req);
    nextStub = sinon.stub();

    getOAuthTokenStub.reset();
    getNinoStub.reset();
    getAccountDataStub.reset();
    getGuidFromJwtStub.reset();
    sandbox = sinon.createSandbox();
    sandbox.stub(JourneyContext, 'putContext').callsFake();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should add a "use" middleware', () => {
    middleware(app);
    expect(app.use)
      .to
      .be
      .an
      .instanceOf(Function);
  });

  describe('apply middleware', () => {
      it(
        'account data already in session and guid matches so skip the test of middleware',
        async () => {
          getGuidFromJwtStub.returns(testGuid);

          req.header = sinon.stub();

          req.path = '/account/home';

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === '__guid__') {
                  return {
                    guid: testGuid,
                  };
                } else if (page === '__hidden_account__') {
                  return {
                    account: 'some_data',
                  };
                }
                return undefined;
              },
            },
          };
          middleware(app);
          await app.use(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

      it('account data already in session BUT guid mismatches so get account data from DiSC',
        async () => {
          process.env.NODE_ENV = 'production';

          getGuidFromJwtStub.returns(testGuid);

          req.session = {
            save: sinon.stub()
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          const setDataForPageStub = sinon.stub();
          req.path = '/account/home';

          req.casa.journeyContext = {
            setDataForPage: setDataForPageStub,
            getDataForPage: (page) => {
              if (page === '__guid__') {
                return {
                  guid: 'OLDGUID',
                };
              } else if (page === '__hidden_account__') {
                return {
                  account: 'some_data',
                };
              }
              return undefined;
            },
          };

          getOAuthTokenStub
            .resolves(Promise.resolve('access_token'));
          getNinoStub
            .resolves(Promise.resolve('PW001001D'));
          getAccountDataStub
            .resolves(Promise.resolve({
              some : 'data',
            }));

          middleware(app);
          await app.use(req, res, nextStub);

          sinon.assert.calledTwice(setDataForPageStub);

          sinon.assert.calledWith(setDataForPageStub.firstCall, '__guid__', { guid: testGuid});
          sinon.assert.calledWith(setDataForPageStub.secondCall, '__hidden_account__',
            { 'account': { 'some': 'data' } });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

    describe('errors', function () {
      it('Error getting account info',
        async () => {
          process.env.NODE_ENV = 'production';

          getGuidFromJwtStub.returns(testGuid);

          req.session = {
            save: sinon.stub()
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          const setDataForPageStub = sinon.stub();
          req.path = '/account/home';

          req.casa.journeyContext = {
            setDataForPage: setDataForPageStub,
            getDataForPage: (page) => {
              if (page === '__guid__') {
                return {
                  guid: 'OLDGUID',
                };
              }
              return undefined;
            },
          };

          getOAuthTokenStub
            .resolves(Promise.resolve('access_token'));
          getNinoStub
            .resolves(Promise.resolve('PW001001D'));
          getAccountDataStub
            .resolves(Promise.reject('Failed to get account data'));

          middleware(app);
          await app.use(req, res, nextStub);

          expect(res.redirectedTo)
            .to
            .be
            .equal('/claim/problem-with-service');
        });

      it('Error getting guid',
        async () => {
          process.env.NODE_ENV = 'production';

          getGuidFromJwtStub.throws(Error('Could not get guid'));

          req.session = {
            save: sinon.stub()
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          const setDataForPageStub = sinon.stub();
          req.path = '/account/home';

          req.casa.journeyContext = {
            setDataForPage: setDataForPageStub,
            getDataForPage: (page) => {
              if (page === '__guid__') {
                return {
                  guid: 'OLDGUID',
                };
              }
              return undefined;
            },
          };

          middleware(app);
          await app.use(req, res, nextStub);

          sinon.assert.notCalled(getOAuthTokenStub);
          sinon.assert.notCalled(getNinoStub);
          sinon.assert.notCalled(getAccountDataStub);
          sinon.assert.notCalled(setDataForPageStub);

          expect(res.redirectedTo)
            .to
            .be
            .equal('/claim/problem-with-service');
        });
    });
          
  });
});
