const page = require('../../../../../../../app/definitions/pages/common/file-upload/upload-receipts-or-invoices');
const sinon = require('sinon');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('definitions/pages/common/upload-receipts-or-invoices', () => {
  it('should page a function', () => {
    assert.typeOf(page, 'function');
  });
  describe('when exported function is invoked', () => {
    beforeEach(() => {
      this.result = page();
    });
    it('when exported function is invoked', () => {
      assert.typeOf(this.result, 'object');
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
          assert.equal(this.result.view, 'pages/common/file-upload/upload-receipts-or-invoices.njk');
        });
      });
      describe('`fieldValidators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('fieldValidators');
        });

        it('value should return an object', () => {
          assert.typeOf(this.result.fieldValidators, 'object');
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
      let req,
        res,
        nextStub;

      beforeEach(() => {
        this.result = page();
        const mockResponse = () => {
          const res = {};
          res.locals = {
            t: () => 'upload-receipts-or-invoices:continueButton'
          };
          return res;
        };

        res = mockResponse();

        nextStub = sinon.stub();
      });
      describe('`prerender`', () => {

        it('should set file upload flag', () => {
          this.result.hooks.prerender(req, res, nextStub);
          assert.equal(res.locals.fileUpload, true);
          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('should set BUTTON_TEXT', () => {
          this.result.hooks.prerender(req, res, nextStub);
          assert.equal(res.locals.BUTTON_TEXT, 'upload-receipts-or-invoices:continueButton');
          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('should set fileSizeLimit', () => {
          this.result.hooks.prerender(req, res, nextStub);
          assert.equal(res.locals.fileSizeLimit, 10000000);
          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });
      });

      describe('`preredirect`', () => {

        it('should set file upload flag === false', () => {
          this.result.hooks.preredirect(req, res, nextStub);
          assert.equal(res.locals.fileUpload, false);
          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });
      });

      describe('prevalidate', () => {
        let req,
          res,
          nextStub;
        let sandbox;

        beforeEach(() => {
          this.result = page();
          sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext').callsFake();
          const mockResponse = () => {
            const res = {};
            res.locals = {
              t: () => 'upload-receipts-or-invoices:continueButton'
            };
            return res;
          };

          res = mockResponse();

          nextStub = sinon.stub();
        });

        afterEach(() => {
          sandbox.restore();
        });

        it('no errors found', () => {
          const setDataForPageStub = sinon.stub();
          req = {
            file: {},
            casa: {
              journeyWaypointId: 'waypoint',
              journeyContext: {
                setDataForPage: setDataForPageStub
              }
            },
            session: {
              save: sinon.stub()
                .callsFake((cb) => {
                  if (cb) {
                    cb();
                  }
                }),
            }
          };
          this.result.hooks.prevalidate(req, res, nextStub);
          sinon.assert.calledOnce(setDataForPageStub);
          sinon.assert.calledOnce(nextStub);
        });

        it('NoFileError', () => {
          const setDataForPageStub = sinon.stub();
          req = {
            file: {},
            casa: {
              journeyWaypointId: 'waypoint',
              journeyContext: {
                setDataForPage: setDataForPageStub
              }
            },
            body: {
              error: {
                name: 'NoFileError'
              }
            },
            session: {
              save: sinon.stub()
                .callsFake((cb) => {
                  if (cb) {
                    cb();
                  }
                }),
            }
          };
          this.result.hooks.prevalidate(req, res, nextStub);
          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('waypoint',
              {
                file: null,
                isFileLimitExceeded: false,
                isInvalidMimeType: false
              });
          sinon.assert.calledOnce(nextStub);
        });

        it('NoFileError', () => {
          const setDataForPageStub = sinon.stub();
          req = {
            file: {},
            casa: {
              journeyWaypointId: 'waypoint',
              journeyContext: {
                setDataForPage: setDataForPageStub
              }
            },
            body: {
              error: {
                name: 'NoFileError'
              }
            },
            session: {
              save: sinon.stub()
                .callsFake((cb) => {
                  if (cb) {
                    cb();
                  }
                }),
            }
          };
          this.result.hooks.prevalidate(req, res, nextStub);
          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('waypoint',
              {
                file: null,
                isFileLimitExceeded: false,
                isInvalidMimeType: false
              });
          sinon.assert.calledOnce(nextStub);
        });

        it('MimetypeError', () => {
          const setDataForPageStub = sinon.stub();
          req = {
            file: {},
            casa: {
              journeyWaypointId: 'waypoint',
              journeyContext: {
                setDataForPage: setDataForPageStub
              }
            },
            body: {
              error: {
                name: 'MimetypeError'
              }
            },
            session: {
              save: sinon.stub()
                .callsFake((cb) => {
                  if (cb) {
                    cb();
                  }
                }),
            }
          };
          this.result.hooks.prevalidate(req, res, nextStub);
          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('waypoint',
              {
                file: 'in res.file',
                isFileLimitExceeded: false,
                isInvalidMimeType: true
              });
          sinon.assert.calledOnce(nextStub);
        });
        it('FileLimitError', () => {
          const setDataForPageStub = sinon.stub();
          req = {
            file: {},
            casa: {
              journeyWaypointId: 'waypoint',
              journeyContext: {
                setDataForPage: setDataForPageStub
              }
            },
            body: {
              error: {
                name: 'FileLimitError'
              }
            },
            session: {
              save: sinon.stub()
                .callsFake((cb) => {
                  if (cb) {
                    cb();
                  }
                }),
            }
          };
          this.result.hooks.prevalidate(req, res, nextStub);
          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('waypoint',
              {
                file: 'in res.file',
                isFileLimitExceeded: true,
                isInvalidMimeType: false
              });
          sinon.assert.calledOnce(nextStub);
        });
        it('Invalid error type', () => {
          const setDataForPageStub = sinon.stub();
          req = {
            file: {},
            casa: {
              journeyWaypointId: 'waypoint',
              journeyContext: {
                setDataForPage: setDataForPageStub
              }
            },
            body: {
              error: {
                name: 'OtherError'
              }
            },
            session: {
              save: sinon.stub()
            }
          };
          try {
            this.result.hooks.prevalidate(req, res, nextStub);
          } catch (e) {
            assert.equal(e.message, 'invalid error type');
          }
          sinon.assert.notCalled(nextStub);
          sinon.assert.notCalled(setDataForPageStub);
        });
      });
    });
  });
});
