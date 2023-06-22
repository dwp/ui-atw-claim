const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');

const timeOut = require('../../../../app/routes/time-out');
const sinon = require('sinon');
const {
  assert,
} = require('chai');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

const endSessionStub = sinon.stub();
const app = {
  router: {
    get: sinon.stub(),
  },
  endSession: endSessionStub,
};

describe('time-out.router', () => {
  const req = new Request();
  const res = new Response(req);

  it('should be a function', () => {
    assert.typeOf(timeOut, 'function');
  });

  describe('get', () => {
    it('should end session and render time out page', async () => {
      endSessionStub.resolves(Promise.resolve());
      const sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();

      await timeOut(app)(req, res);

      sinon.assert.calledWith(endSessionStub, req)
      assert.equal(res.rendered.view, 'pages/time-out/time-out.njk');
      endSessionStub.reset();
      sandbox.restore();
    });
  });
});
