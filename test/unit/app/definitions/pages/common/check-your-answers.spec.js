const page = require('../../../../../../app/definitions/pages/common/check-your-answers');
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const {
  map,
  data,
} = require('../../../../../helpers/journey-mocks');
const { claimTypesFullName } = require('../../../../../../app/config/claim-types');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

const setupGetDataForPage = (claimType) => (pageName) => {
        if (pageName === '__journey_type__') {
          return {
            journeyType: claimType,
          };
        }
        if (pageName === '__hidden_account__') {
          return {
            account: {
              payees: [],
            },
          };
        }
        return undefined
      }

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();


describe('definitions/pages/common/check-your-answers', () => {
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
          assert.equal(this.result.view, 'pages/common/review/check-your-answers.njk');
        });
      });
    });
  });

  describe('prerender hook', () => {
    let mockRequest;
    let mockResponse;
    let stubNext;
    let prerender;

    beforeEach(() => {
      mockRequest = new Request();
      mockRequest.casa = {
        plan: map(),
        journeyContext: data(),
      };
      mockResponse = new Response();
      mockResponse.locals.casa = {
        mountUrl: '/test-mount/',
      };
      stubNext = sinon.stub();
      prerender = page().hooks.prerender;
    });

    it('should call next middleware in chain', () => {
      mockRequest.casa.journeyOrigin = {
        originId: '',
        waypoint: '',
      };
      prerender(mockRequest, mockResponse, stubNext);
      expect(stubNext)
        .to
        .be
        .calledOnceWithExactly();
    });

    it('should set the correct "changeUrlPrefix" template variable', () => {
      mockRequest.casa.journeyOrigin = {
        originId: '',
        waypoint: '',
      };
      prerender(mockRequest, mockResponse, stubNext);
      expect(mockResponse.locals)
        .has
        .property('changeUrlPrefix')
        .that
        .equals('/test-mount/');

      mockRequest.casa.journeyOrigin = {
        originId: 'test-guid',
        waypoint: '',
      };
      prerender(mockRequest, mockResponse, stubNext);
      expect(mockResponse.locals)
        .has
        .property('changeUrlPrefix')
        .that
        .equals('/test-mount/test-guid/');
    });

    it('should set the correct "journeyContext" template variable', () => {
      mockRequest.casa.journeyOrigin = {
        originId: '',
        waypoint: '',
      };
      mockRequest.casa.journeyContext.getData = sinon.stub()
        .returns({
          test: 'data',
        });
      prerender(mockRequest, mockResponse, stubNext);
      expect(mockResponse.locals)
        .has
        .property('journeyContext')
        .that
        .eql({
          test: 'data',
        });
    });

    it('should set the correct "reviewErrors" template variable', () => {
      mockRequest.casa.journeyOrigin = {
        originId: '',
        waypoint: '',
      };
      mockRequest.casa.journeyContext.getValidationErrors = sinon.stub()
        .returns('test-errors');
      prerender(mockRequest, mockResponse, stubNext);
      expect(mockResponse.locals)
        .has
        .property('reviewErrors')
        .that
        .eql('test-errors');
    });

    it('should set the correct "reviewBlocks" template variable EA', () => {
      const equipmentAndAdaptationPageMeta = {
        'test-page-0': {
          reviewBlockView: 'test-view',
        },
        'test-page-1': Object.create(null),
      };

      const supportWorkerPageMeta = {
        'test-page-2': {
          reviewBlockView: 'test-view-2',
        },
        'test-page-3': Object.create(null),
      };

      prerender = page(equipmentAndAdaptationPageMeta, supportWorkerPageMeta).hooks.prerender;
      mockRequest.editOriginUrl = 'test-origin';
      mockRequest.casa.journeyContext.getDataForPage = setupGetDataForPage(claimTypesFullName.EA)

      mockRequest.casa.journeyOrigin = {
        originId: '',
        waypoint: '',
      };
      mockRequest.casa.plan.traverse = sinon.stub()
        .returns(['test-page-0', 'test-page-1']);
      prerender(mockRequest, mockResponse, stubNext);
      expect(mockResponse.locals)
        .has
        .property('reviewBlocks')
        .that
        .deep
        .eql([
          {
            waypointId: 'test-page-0',
            waypointEditUrl: '/test-mount/test-page-0?edit=&editorigin=%2Ftest-origin',
            reviewBlockView: 'test-view',
          }]);
    });

    it('should set the correct "reviewBlocks" template variable SW', () => {
      const equipmentAndAdaptationPageMeta = {
        'test-page-0': {
          reviewBlockView: 'test-view',
        },
        'test-page-1': Object.create(null),
      };

      const supportWorkerPageMeta = {
        'test-page-2': {
          reviewBlockView: 'test-view-2',
        },
        'test-page-3': Object.create(null),
      };

      prerender = page(equipmentAndAdaptationPageMeta, supportWorkerPageMeta).hooks.prerender;
      mockRequest.editOriginUrl = 'test-origin';
      mockRequest.casa.journeyContext.getDataForPage = setupGetDataForPage(claimTypesFullName.SW)
      mockRequest.casa.journeyOrigin = {
        originId: '',
        waypoint: '',
      };
      mockRequest.casa.plan.traverse = sinon.stub()
        .returns(['test-page-2', 'test-page-3']);
      prerender(mockRequest, mockResponse, stubNext);
      expect(mockResponse.locals)
        .has
        .property('reviewBlocks')
        .that
        .deep
        .eql([
          {
            waypointId: 'test-page-2',
            waypointEditUrl: '/test-mount/test-page-2?edit=&editorigin=%2Ftest-origin',
            reviewBlockView: 'test-view-2',
          }]);
    });

    it('should set the correct "reviewBlocks" template variable TW', () => {
      const equipmentAndAdaptationPageMeta = {
        'test-page-0': {
          reviewBlockView: 'test-view',
        },
        'test-page-1': Object.create(null),
      };

      const supportWorkerPageMeta = {
        'test-page-2': {
          reviewBlockView: 'test-view-2',
        },
        'test-page-3': Object.create(null),
      };

      const travelToWorkPageMeta = {
        'test-page-2': {
          reviewBlockView: 'test-view-2',
        },
        'test-page-3': Object.create(null),
      };

      prerender = page(equipmentAndAdaptationPageMeta, supportWorkerPageMeta,
        travelToWorkPageMeta).hooks.prerender;
      mockRequest.editOriginUrl = 'test-origin';
      mockRequest.casa.journeyContext.getDataForPage = setupGetDataForPage(claimTypesFullName.TW)
      mockRequest.casa.journeyOrigin = {
        originId: '',
        waypoint: '',
      };
      mockRequest.casa.plan.traverse = sinon.stub()
        .returns(['test-page-2', 'test-page-3']);
      prerender(mockRequest, mockResponse, stubNext);
      expect(mockResponse.locals)
        .has
        .property('reviewBlocks')
        .that
        .deep
        .eql([
          {
            waypointId: 'test-page-2',
            waypointEditUrl: '/test-mount/test-page-2?edit=&editorigin=%2Ftest-origin',
            reviewBlockView: 'test-view-2',
          }]);
    });

    describe('checkIfShouldShowSelectSavedPayee', () => {
      it('should return true if user has existing payees and wants to add a new one', () => {
        mockRequest.casa.journeyContext.getDataForPage = (pageName) =>{
          if (pageName === '__journey_type__') {
            return { journeyType: claimTypesFullName.SW }
          }
          if (pageName === '__hidden_new_payee__') {
            return { newPayee: true}
          }
          if (pageName === '__hidden_account__') {
            return { account: {
              payees: ['foo', 'bar']
            }}
          }
        }

        mockRequest.casa.journeyOrigin = {
          originId: '',
          waypoint: '',
        };
        prerender(mockRequest, mockResponse, stubNext);
        expect(mockResponse.locals.shouldShowSelectSavedPayee).to.be.true
      })

      it('should return false if user has no existing payees', () => {
        mockRequest.casa.journeyContext.getDataForPage = (pageName) =>{
          if (pageName === '__journey_type__') {
            return { journeyType: claimTypesFullName.SW }
          }
          if (pageName === '__hidden_new_payee__') {
            return { newPayee: true}
          }
          if (pageName === '__hidden_account__') {
            return { account: {
              payees: []
            }}
          }
        }

        mockRequest.casa.journeyOrigin = {
          originId: '',
          waypoint: '',
        };
        prerender(mockRequest, mockResponse, stubNext);
        expect(mockResponse.locals.shouldShowSelectSavedPayee).to.be.false
      })

      it('should return false if user has no existing payees and does not want to add a new payee', () => {
        mockRequest.casa.journeyContext.getDataForPage = (pageName) =>{
          if (pageName === '__journey_type__') {
            return { journeyType: claimTypesFullName.SW }
          }
          if (pageName === '__hidden_new_payee__') {
            return { newPayee: false}
          }
          if (pageName === '__hidden_account__') {
            return { account: {
              payees: []
            }}
          }
        }

        mockRequest.casa.journeyOrigin = {
          originId: '',
          waypoint: '',
        };
        prerender(mockRequest, mockResponse, stubNext);
        expect(mockResponse.locals.shouldShowSelectSavedPayee).to.be.false
      })

      it('should return false if user has existing payees and does not wants to add a new payee', () => {
        mockRequest.casa.journeyContext.getDataForPage = (pageName) =>{
          if (pageName === '__journey_type__') {
            return { journeyType: claimTypesFullName.SW }
          }
          if (pageName === '__hidden_new_payee__') {
            return { newPayee: false}
          }
          if (pageName === '__hidden_account__') {
            return { account: {
              payees: ['foo', 'bar']
            }}
          }
        }

        mockRequest.casa.journeyOrigin = {
          originId: '',
          waypoint: '',
        };
        prerender(mockRequest, mockResponse, stubNext);
        expect(mockResponse.locals.shouldShowSelectSavedPayee).to.be.false
      })
    })
  });

  describe('`prevalidate` key', () => {
    it('should be defined', () => {
      expect(Object.keys(this.result))
        .to
        .includes('hooks');
      expect(Object.keys(this.result.hooks))
        .to
        .includes('prevalidate');
    });

    it('if in edit mode for SUPPORT_WORKER', () => {
      const req = new Request();
      const res = new Response(req);
      const nextStub = sinon.stub();
      const setDataForPageStub = sinon.stub();
      const sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();
      req.body = {
        remove: '9',
      };

      req.casa = {
        journeyContext: {
          setDataForPage: setDataForPageStub,
          getDataForPage: (pages) => {
            if (pages === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.SW,
              };
            }
            return undefined;
          },
        },
      };

      this.result.hooks.prevalidate(req, res, nextStub);

      assert.equal(res.locals.journeyType, claimTypesFullName.SW);

      sinon.assert.calledTwice(setDataForPageStub);
      sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-support-month', {
        removeId: '9',
      });
      sinon.assert.calledWith(setDataForPageStub.secondCall, 'support-claim-summary', undefined);
      sandbox.restore();
    });

    it('if in edit mode for TRAVEL_TO_WORK', () => {
      const req = new Request();
      const res = new Response(req);
      const nextStub = sinon.stub();
      const setDataForPageStub = sinon.stub();
      const sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();

      req.body = {
        remove: '9',
      };

      req.casa = {
        journeyContext: {
          setDataForPage: setDataForPageStub,
          getDataForPage: (pages) => {
            if (pages === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.TW,
              };
            }
            return undefined;
          },
        },
      };

      this.result.hooks.prevalidate(req, res, nextStub);

      assert.equal(res.locals.journeyType, claimTypesFullName.TW);

      sinon.assert.calledTwice(setDataForPageStub);
      sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-travel-month', {
        removeId: '9',
      });
      sinon.assert.calledWith(setDataForPageStub.secondCall, 'journey-summary', undefined);
      sandbox.restore();
    });

    it('req body is undefined', () => {
      const req = new Request();
      const res = new Response(req);

      const nextStub = sinon.stub();

      req.session = {
        save: sinon.stub()
          .callsFake((cb) => {
            if (cb) {
              cb();
            }
          }),
      };

      req.casa = {
        journeyContext: {
          getDataForPage: (pages) => {
            if (pages === '__journey_type__') {
              return {
                journeyType: 'other',
              };
            }
            return undefined;
          },
        },
      };

      this.result.hooks.prevalidate(req, res, nextStub);

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();
    });
  });
  describe('`postvalidate` key', () => {
    it('should be defined', () => {
      expect(Object.keys(this.result))
        .to
        .includes('hooks');
      expect(Object.keys(this.result.hooks))
        .to
        .includes('postvalidate');
    });

    it('save session', () => {
      const req = new Request();
      const res = new Response(req);

      const sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();

      req.session = {
        save: sinon.stub().callsFake((cb) => {
          if (cb) {
            cb();
          }
        }),
      };

      this.result.hooks.postvalidate(req, res);

      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/declaration');

      sandbox.restore();

    });
  });

});
