const chai = require('chai');
const rewire = require('rewire');
const page = rewire(
  '../../../../../../../app/definitions/pages/common/file-upload/receipts-or-invoices-uploaded');
const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

const stubbedGuid = "48c3d7f5-9bf1-435a-8754-69894f7ed1a9";

page.__set__('uuidv4', () => stubbedGuid);

describe('definitions/pages/common/file-upload/receipts-or-invoices-uploaded', () => {
  it('should export a function', () => {
    assert.typeOf(page, 'function');
  });

  describe('when exported function is invoked', () => {
    beforeEach(() => {
      this.result = page();
    });

    it('returns an object', () => {
      assert.typeOf(this.result, 'object');
    });

    describe('returned object keys', () => {
      describe('`view` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('view');
        });

        it('should contain path to the template', () => {
          assert.typeOf(this.result.view, 'string');
          assert.equal(this.result.view,
            'pages/common/file-upload/receipts-or-invoices-uploaded.njk');
        });
      });

      describe('`fieldValidators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('fieldValidators');
        });

        it('should return an object', () => {
          assert.typeOf(this.result.fieldValidators, 'object');
        });
      });

      describe('hooks', () => {
        let req,
          res,
          nextStub,
          getDataForPageStub,
          setDataForPageStub,
          saveStub,
          toObjectStub;

        let removeContextClearValidationStub = sinon.stub();
        let removeContextSetDataForPageStub = sinon.stub();

        let sandbox;
        beforeEach(() => {
          sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'fromObject')
            .callsFake(() => {
              return {
                data: {},
                identity: {},
                nav: {},
                validation: {},
                clearValidationErrorsForPage: removeContextClearValidationStub,
                setDataForPage: removeContextSetDataForPageStub,
              };
            });

          sandbox.stub(JourneyContext, 'removeContextsByTag')
            .callsFake(() => {
              return {};
            });

          sandbox.stub(JourneyContext, 'putContext')
            .callsFake(() => {
              return {};
            });

        });

        afterEach(() => {
          sandbox.restore();
          removeContextClearValidationStub.reset();
          removeContextSetDataForPageStub.reset();
        });

        beforeEach(() => {
          req = new Request();
          res = new Response(req);
          nextStub = sinon.stub();
          setDataForPageStub = sinon.stub();
          clearValidationStub = sinon.stub();
          saveStub = sinon.stub();

          toObjectStub = sinon.stub()
            .returns({});

          getDataForPageStub = sinon.stub()
            .returns({
              files: [
                {
                  fileId: 'file-id-1',
                }, {
                  fileId: 'file-id-2',
                },
              ],
            });

          req.session = {
            save: saveStub
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          req.casa = {
            journeyContext: {
              toObject: toObjectStub,
              clearValidationErrorsForPage: clearValidationStub,
              getDataForPage: getDataForPageStub,
              setDataForPage: setDataForPageStub,
            },
          };
        });

        describe('`prerender` key', () => {
          it('should be defined', () => {
            expect(Object.keys(this.result))
              .to
              .includes('hooks');
            expect(Object.keys(this.result.hooks))
              .to
              .includes('prerender');
          });

          it('should expose any uploaded files to the templates', () => {

            this.result.hooks.prerender(req, res, nextStub);

            sinon.assert.calledTwice(removeContextSetDataForPageStub);
            sinon.assert.callCount(removeContextClearValidationStub, 4);

            const callsRemoveContextClearValidationStub = removeContextClearValidationStub.getCalls();
            assert.equal(callsRemoveContextClearValidationStub[0].args[0], 'receipts-invoices-uploaded');
            assert.equal(callsRemoveContextClearValidationStub[1].args[0], 'remove-receipt-invoice');
            assert.equal(callsRemoveContextClearValidationStub[2].args[0], 'receipts-invoices-uploaded');
            assert.equal(callsRemoveContextClearValidationStub[3].args[0], 'remove-receipt-invoice');

            const callsRemoveContextSetDataForPageStub = removeContextSetDataForPageStub.getCalls();

            assert.equal(callsRemoveContextSetDataForPageStub[0].args[0], 'remove-receipt-invoice');
            assert.equal(callsRemoveContextSetDataForPageStub[0].args[1], undefined);
            assert.equal(callsRemoveContextSetDataForPageStub[1].args[0], 'remove-receipt-invoice');
            assert.equal(callsRemoveContextSetDataForPageStub[1].args[1], undefined);

            expect(res.locals.files)
              .to
              .deep
              .equal([
                {
                  "fileId": "file-id-1",
                  "removeLink": `remove-receipt-invoice?contextid=${stubbedGuid}`,
                },
                {
                  "fileId": "file-id-2",
                  "removeLink": `remove-receipt-invoice?contextid=${stubbedGuid}`,
                }
              ]);
          });

          it('should expose any uploaded files to the templates (edit mode)', () => {

            req.inEditMode = true;
            req.editOriginUrl = '/claim/check-your-answers';


            this.result.hooks.prerender(req, res, nextStub);

            sinon.assert.calledTwice(removeContextSetDataForPageStub);
            sinon.assert.callCount(removeContextClearValidationStub, 4);

            const callsRemoveContextClearValidationStub = removeContextClearValidationStub.getCalls();
            assert.equal(callsRemoveContextClearValidationStub[0].args[0], 'receipts-invoices-uploaded');
            assert.equal(callsRemoveContextClearValidationStub[1].args[0], 'remove-receipt-invoice');
            assert.equal(callsRemoveContextClearValidationStub[2].args[0], 'receipts-invoices-uploaded');
            assert.equal(callsRemoveContextClearValidationStub[3].args[0], 'remove-receipt-invoice');

            const callsRemoveContextSetDataForPageStub = removeContextSetDataForPageStub.getCalls();

            assert.equal(callsRemoveContextSetDataForPageStub[0].args[0], 'remove-receipt-invoice');
            assert.equal(callsRemoveContextSetDataForPageStub[0].args[1], undefined);
            assert.equal(callsRemoveContextSetDataForPageStub[1].args[0], 'remove-receipt-invoice');
            assert.equal(callsRemoveContextSetDataForPageStub[1].args[1], undefined);

            expect(res.locals.files)
              .to
              .deep
              .equal([
                {
                  "fileId": "file-id-1",
                  "removeLink": `remove-receipt-invoice?contextid=${stubbedGuid}&edit=&editorigin=/claim/check-your-answers`,
                },
                {
                  "fileId": "file-id-2",
                  "removeLink": `remove-receipt-invoice?contextid=${stubbedGuid}&edit=&editorigin=/claim/check-your-answers`,
                }
              ]);
          });
        });
      });
    });
  });
});
