const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');

const page = require('../../../../../app/routes/unauthorised/cannot-use-service');
const sinon = require('sinon');

let chai, assert;
(async() => {
  assert = (await import ('chai')).assert;
  chai.use(require('sinon-chai'));
})();

describe('/cannot-use-service', () => {
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

        it('GET - cannot-use-service.njk', async () => {
            const router = page(app);

            await router(req, res);

            assert.equal(res.statusCode, 200);
            assert.equal(res.rendered.view, 'pages/unauthorised/cannot-use-service.njk');
          });
        });
});
