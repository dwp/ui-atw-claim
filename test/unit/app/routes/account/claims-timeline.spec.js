const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = require('../../../../../app/routes/account/claims-timeline');
const sinon = require('sinon');
const { claimTypesFullName } = require('../../../../../app/config/claim-types');

let assert;
(async() => {
  assert = (await import ('chai')).assert;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('/claims-timeline', () => {
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

    it('GET - claims-timeline.njk', async () => {
      const router = page(app);

      req.session.claimHistory = {
        awardType: claimTypesFullName.EA,
      };

      await router.claimsTimeline(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.rendered.view, 'pages/account/claims-timeline.njk');
    });
  });
});
