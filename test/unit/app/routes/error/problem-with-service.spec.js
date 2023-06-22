const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');

const page = require('../../../../../app/routes/error/problem-with-service');
const chai = require('chai');
const {
  assert,
} = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('/problem-with-service', () => {
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

        it('GET - problem-with-service.njk', async () => {
            const router = page(app);

            await router(req, res);

            assert.equal(res.statusCode, 200);
            assert.equal(res.rendered.view, 'casa/errors/500.njk');
          });
        });
});
