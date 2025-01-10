const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = require('../../../../../app/routes/account/claim-by-post');
const sinon = require('sinon');

let assert;
(async() => {
  assert = (await import ('chai')).assert;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('/claim-by-post', () => {
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
        post: sinon.stub(),
      },
    };

    it('GET - claim-by-post.njk', async () => {
      const router = page(app);

      await router.getPage(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.rendered.view, 'pages/account/claim-by-post.njk');
    });
  });
});

