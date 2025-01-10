const page = require(
  '../../../../../../../app/definitions/pages/account/personal/remove-home-number');
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const sinon = require('sinon');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('definitions/pages/account/personal/remove-home-number', () => {
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
          assert.equal(this.result.view, 'pages/account/personal/remove-home-number.njk');
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

      it('check res.local', () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();

        req.casa = {
          journeyContext: {
            getDataForPage: (pageName) => {
              if (pageName === 'telephone-number-change') {
                return {
                  homeNumber: '02089078888',
                };
              }
            },
          },
        };

        this.result.hooks.prerender(req, res, nextStub);

        assert.equal(res.locals.forceShowBackButton, true);
        assert.equal(res.locals.casa.journeyPreviousUrl,
          `/claim/personal/telephone-number-change`);
      });
    });

  describe('`postvalidate`', () => {

    it('if pageData.removingEntry equals yes', () => {
      const req = new Request();
      const res = new Response(req);
      const nextStub = sinon.stub();
      const setDataForPageStub = sinon.stub();

      req.session = {
        save: sinon.stub()
          .callsFake((cb) => {
            if (cb) {
              cb();
            }
          }),
      };

      const pageData = {
        removingHomeNumber: 'yes'
      }

      const getDataForPageStub = sinon.stub()
      .returns(pageData);

      req.casa = {
        journeyContext: {
          getDataForPage: getDataForPageStub,
          setDataForPage: setDataForPageStub
        }
      };

      this.result.hooks.postvalidate(req, res, nextStub);

      sinon.assert.calledOnce(setDataForPageStub);
      sinon.assert.calledWith(setDataForPageStub.firstCall, 'new-phone-number', {
        removingHomeNumber: 'yes'
      });
    });

  });
  });
});
