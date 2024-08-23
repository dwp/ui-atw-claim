const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
const rewire = require('rewire');

const page = rewire('../../../../app/routes/sign-out');
const sinon = require('sinon');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

const sessionKey = 'session';
const configStub = {
  get: (config) => {
    if (config === 'services.oidv.kongSessionName') {
      return sessionKey;
    }
  },
};

let assert, expect
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

page.__set__('config', configStub);

describe('/sign-out', () => {
  const req = new Request();
  const res = new Response(req);
  const clearCookiesStub = sinon.stub();
  res.clearCookie = clearCookiesStub;

  beforeEach(() => {
    clearCookiesStub.reset();
  });

  it('should be a function', () => {
    assert.typeOf(page, 'function');
  });

  describe('when called', () => {
    const endSessionStub = sinon.stub();
    endSessionStub.resolves(Promise.resolve());

    const app = {
      endSession: endSessionStub,
      router: {
        get: sinon.stub(),
      },
    };

    it('GET - sign-out.njk - no kong session to delete', async () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();
      req.cookies = {};

      const router = page(app);

      await router(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.rendered.view, 'pages/sign-out/sign-out.njk');
      sinon.assert.notCalled(clearCookiesStub);
      sandbox.restore();
    });

    it('GET - sign-out.njk - kong session to delete', async () => {
      req.cookies = {
        'session': {},
      };
      const sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();

      const router = page(app);

      await router(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.rendered.view, 'pages/sign-out/sign-out.njk');
      expect(clearCookiesStub)
        .to
        .be
        .calledOnceWithExactly(sessionKey);

      sandbox.restore();
    });
  });
});
