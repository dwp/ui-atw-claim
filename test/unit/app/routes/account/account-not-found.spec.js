const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');

const accountNotFound = require('../../../../../app/routes/account-not-found');
const sinon = require('sinon');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

const endSessionStub = sinon.stub();
const app = {
  router: {
    get: sinon.stub(),
  },
  endSession: endSessionStub,
};

let assert;
(async() => {
  assert = (await import ('chai')).assert;
})();

describe('/account-not-found', () => {
  const req = new Request();
  const res = new Response(req);

  it('should be a function', () => {
    assert.typeOf(accountNotFound, 'function');
  });

  describe('get', () => {
    it('should end session and render account not found page', async () => {
      const sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();
      endSessionStub.resolves(Promise.resolve());

      await accountNotFound(app)(req, res);

      sinon.assert.calledWith(endSessionStub, req)
      assert.equal(res.rendered.view, 'pages/account/account-not-found.njk');
      endSessionStub.reset();
      sandbox.restore();
    });
  });
});
