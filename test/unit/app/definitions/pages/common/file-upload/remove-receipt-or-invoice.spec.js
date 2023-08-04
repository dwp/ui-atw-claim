const rewire = require('rewire');

const page = rewire(
  '../../../../../../../app/definitions/pages/common/file-upload/remove-receipt-or-invoice');
const chai = require('chai');
const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const evidenceControllerStub = sinon.stub();

page.__set__('deleteFile', evidenceControllerStub);

describe('definitions/pages/common/remove-receipt-or-invoice', () => {

  describe('when exported function is invoked', () => {
    beforeEach(() => {
      this.result = page();
    });

    it('should page a function', () => {
      assert.typeOf(page, 'function');
    });

    it('when exported function is invoked', () => {
      assert.typeOf(this.result, 'object');
    });
  });

  describe('returned object keys', () => {
    describe('`view` key', () => {
      it('should be defined', () => {
        expect(Object.keys(this.result))
          .to
          .includes('view');
      });
      it('value be a string', () => {
        assert.typeOf(this.result.view, 'string');
        assert.equal(this.result.view, 'pages/common/file-upload/remove-receipt-or-invoice.njk');
      });
    });
    describe('`fieldValidators` key', () => {
      it('should be defined', () => {
        expect(Object.keys(this.result))
          .to
          .includes('fieldValidators');
      });
    });
    describe('`hooks` key', () => {
      it('should be defined', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
      });
      it('should contain prerender', () => {
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');
      });
      it('should contain postvalidate', () => {
        expect(Object.keys(this.result.hooks))
          .to
          .includes('postvalidate');
      });
    });
  });
  describe('`hooks`', () => {
    let sandbox;

    let res,
      nextStub;

    beforeEach(() => {
      this.result = page();
      sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();


      sandbox.stub(JourneyContext, 'removeContext').callsFake();


      const mockResponse = () => {
        const res = {};
        res.locals = {
          t: () => 'remove-receipt-or-invoice:continueButton',
        };
        return res;
      };

      res = mockResponse();

      nextStub = sinon.stub();
    });


    afterEach(() => {
      sandbox.restore();
    });

    describe('`prerender`', () => {

      it('should populate default context with ephemeral context data', () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const setDataForPageStub = sinon.stub();
        const clearValidationErrorsForPageStub = sinon.stub();

        sandbox.stub(JourneyContext, 'getContextById')
          .callsFake(() => {
            return {
              clearValidationErrorsForPage: clearValidationErrorsForPageStub,
              setDataForPage: setDataForPageStub,
            };
          });

        const getDataForPageStub = sinon.stub()
          .returns({
            removeMode: true,
            fileId: 'file-id-1',
            fileIndex: 0,
          });

        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
          },
        };

        this.result.hooks.prerender(req, res, nextStub);

        assert.equal(res.locals.hideBackButton, true);

        expect(clearValidationErrorsForPageStub)
          .to
          .be
          .calledOnceWithExactly('receipts-invoices-uploaded');

        expect(setDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('receipts-invoices-uploaded', {
            removeMode: true,
            fileId: 'file-id-1',
            fileIndex: 0,
          });
      });
    });

    describe('`preredirect`', () => {
      it('removeMode is false', () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const getDataForPageStub = sinon.stub()
          .returns({
            removeMode: false,
          });
        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
          },
        };
        this.result.hooks.preredirect(req, res, nextStub);

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('receipts-invoices-uploaded');

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();
      });

      it('removeMode is undefined', () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const getDataForPageStub = sinon.stub()
          .returns({});

        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
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

        this.result.hooks.preredirect(req, res, nextStub);

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('receipts-invoices-uploaded');

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();
      });

      it('removeMode is true', () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const setDataForPageStub = sinon.stub();
        const getDataForPageStub = sinon.stub()
          .returns({ removeMode: true });

        sandbox.stub(JourneyContext, 'getContextById')
          .callsFake(() => {
            return {
              setDataForPage: setDataForPageStub,
            };
          });

        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
          },
        };
        this.result.hooks.preredirect(req, res, nextStub);

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('receipts-invoices-uploaded');

        expect(setDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('receipts-invoices-uploaded', undefined);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();
      });
    });

    describe('`postvalidate`', () => {

      it('if pageData.removingEntry equals no', () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();

        req.casa = {
          journeyContext: {
            data: {
              'remove-receipt-invoice': {
                'removingEntry': 'no',
              },
            },
          },
        };

        this.result.hooks.postvalidate(req, res, nextStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();
      });

      it('if pageData.removingEntry equals yes', async () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const saveStub = sinon.stub();
        const ephemeralSetDataForPage = sinon.stub();
        const defaultContextSetDataForPageStub = sinon.stub();
        const defaultContextGetDataForPageStub = sinon.stub()
          .returns({
            files: [
              {
                fileId: 'file-id-1',
              },
              {
                fileId: 'file-id-2',
              },
            ],
          });

        sandbox.stub(JourneyContext, 'getContextById')
          .callsFake(() => {
            return {
              toObject: sinon.stub(),
            };
          });

        sandbox.stub(JourneyContext, 'fromObject')
          .callsFake(() => {
            return {
              setDataForPage: defaultContextSetDataForPageStub,
              getDataForPage: defaultContextGetDataForPageStub,
            };
          });

        // Ephemeral Context
        req.casa = {
          journeyContext: {
            setDataForPage: ephemeralSetDataForPage,
            data: {
              'remove-receipt-invoice': {
                'removingEntry': 'yes',
              },
              'receipts-invoices-uploaded': {
                'removeMode': true,
                'fileIndex': 0,
              },
            },
          },
        };

        evidenceControllerStub.resolves(Promise.resolve({
          status: 200,
        }));

        req.session = {
          save: saveStub
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };

        await this.result.hooks.postvalidate(req, res, nextStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();

        expect(ephemeralSetDataForPage)
          .to
          .be
          .calledOnceWithExactly('__hidden_uploaded_files__', {
            files: [
              {
                fileId: 'file-id-2',
              },
            ],
          });

        expect(defaultContextSetDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('__hidden_uploaded_files__', {
            files: [
              {
                fileId: 'file-id-2',
              },
            ],
          });
      });
    });
  });
});

