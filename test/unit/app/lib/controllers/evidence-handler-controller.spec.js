const rewire = require('rewire');
const controller = rewire('../../../../../app/lib/controllers/evidence-handler-controller');
const chai = require('chai');
const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
chai.use(require('sinon-chai'));

const axiosStub = sinon.stub();
controller.__set__('axios', axiosStub);
const responseData = {
  status: 200,
}

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
