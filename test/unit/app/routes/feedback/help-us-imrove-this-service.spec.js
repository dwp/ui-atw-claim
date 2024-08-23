const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');

const page = require('../../../../../app/routes/feedback/help-us-improve-this-service');
const sinon = require('sinon');

let chai, assert, sinonChai;
(async() => {
  assert = (await import ('chai')).assert;
  chai.use(require('sinon-chai'));
})();

describe('/feedback', () => {
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

        it('GET - help-us-improve-this-service.njk', async () => {
            req.query = { referrer: '/someReferrer' };
            const router = page(app);

            await router(req, res);
            assert.equal(res.locals.backLink, '/someReferrer')
            assert.equal(res.locals.hideBackButton, true)
            assert.equal(res.statusCode, 200);
            assert.equal(res.rendered.view, 'pages/feedback/help-us-improve-this-service.njk');
          });
        });
});
