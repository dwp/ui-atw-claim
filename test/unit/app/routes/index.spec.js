const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
const index = require('../../../../app/routes');
const chai = require('chai');
const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
chai.use(require('sinon-chai'));

describe('/index', () => {
  const req = new Request();
  const res = new Response(req);

  it('should be a function', () => {
    assert.typeOf(index, 'function');
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

    it('GET -  return home.njk - Test', async () => {
      const router = index(app);

      req.session = {
        save: sinon.stub()
          .callsFake((cb) => {
            if (cb) {
              cb();
            }
          }),
      };

      await router.getIndex(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.rendered.view, 'home.njk');
    });
    it('GET -  return home.njk (Production)', async () => {
      process.env.NODE_ENV = 'production';

      const router = index(app);

      await router.getIndex(req, res);

      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/account/home');
      assert.equal(res.statusCode, 200);
    });

    describe('POST - setup personal details', () => {
      it('alf', async () => {
        const router = index(app);
        req.body = {
          persona: 'AA370773A',
        };

        const sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').callsFake();

        const setDataForPageStub = sinon.stub();

        req.casa = {
          journeyContext: {
            setDataForPage: setDataForPageStub,
          },
        };
        req.session = {
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };

        await router.postIndex(req, res);

        assert.equal(req.session.token, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdF9oYXNoIjoiVC1zUVpkandNX3NzY3FYcG82dklOZyIsInN1YiI6ImFib2Z1ODU2QGV4YW1wbGUuY29tIiwiYXVkaXRUcmFja2luZ0lkIjoiZWRmYmE5ZWMtNDdhNS00MTM3LTkyMjctNjhmNzMzZDcwMWM5LTI4OTg2IiwiaXNzIjoiaHR0cHM6Ly9mb3JnZXJvY2subG9jYWwubHZoLm1lL2FtL29hdXRoMi9yZWFsbXMvcm9vdC9yZWFsbXMvQ2l0aXplbnMvcmVhbG1zL1dFQiIsInRva2VuTmFtZSI6ImlkX3Rva2VuIiwiYXVkIjoiUk1ELVdFQiIsImNfaGFzaCI6Il90aFY2QmxGODFiSkVaOU42ZERyLXciLCJhY3IiOiJBdXRoLUxldmVsLU1lZGl1bSIsIm9yZy5mb3JnZXJvY2sub3BlbmlkY29ubmVjdC5vcHMiOiJOVzZNRE9rR2dCQVN3UHN1RFNUWXhLV1VKQmMiLCJzX2hhc2giOiJhN1hrR1Nwb3hndEhkdC1mbUYzdG1RIiwiYXpwIjoiUk1ELVdFQiIsImF1dGhfdGltZSI6MTYzNzY3MzUyMSwicmVhbG0iOiIvQ2l0aXplbnMvV0VCIiwiZXhwIjoxNjM3NjczNjQxLCJ0b2tlblR5cGUiOiJKV1RUb2tlbiIsImlhdCI6MTYzNzY3MzUyMX0.3LaGARz42AfoDq22rzTw6Q4CnXmcltA43UIRMCJOVEc")

        expect(res.redirectedTo)
          .to
          .be
          .equal('/claim/account/home');

        sandbox.restore();
      });
    });
  });
});

