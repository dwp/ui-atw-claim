const rewire = require('rewire');
const controller = rewire('../../../../../app/lib/controllers/evidence-handler-controller');
const sinon = require('sinon');
const axiosStub = sinon.stub();
controller.__set__('axios', axiosStub);
const responseData = {
  status: 200,
}

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('evidence-handler-controller', () => {
  beforeEach(() => {
    axiosStub.reset();
  });

  it('success', async () => {
    axiosStub.resolves(Promise.resolve(responseData));

    await controller.deleteFile('fileId');

  });

  it('reject', async () => {
    axiosStub.resolves(Promise.reject({ response: 'error' }));
    try {
      await controller.deleteFile('fileId');
      assert.fail( 'Oh no the exception not thrown');
    } catch (e) {
      expect(e.response).to.be.equal('error');
    }

  });
});
