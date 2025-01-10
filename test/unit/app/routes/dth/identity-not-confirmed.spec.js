const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = require('../../../../../app/routes/dth/identity-not-confirmed');
const sinon = require('sinon');

let chai, assert, sinonChai;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('/identity-not-confirmed', () => {
  const req = new Request();
  const res = new Response(req);

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

    it('GET - identity-not-confirmed.njk', async () => {
      const router = page(app);

      await router(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.rendered.view, 'pages/dth/identity-not-confirmed.njk');
    });
  });
});

