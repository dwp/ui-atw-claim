const page = require('../../../../../../app/definitions/pages/equipment-or-adaptation/your-equipment-or-adaptation');
const sinon = require('sinon');
const chai = require('chai');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const removeAllSpaces = require('../../../../../../app/utils/remove-all-spaces.js');
chai.use(require('sinon-chai'));
const {
  assert,
  expect
} = chai;

describe('definitions/pages/equipment-or-adaptation/your-equipment-or-adaptation', () => {
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
          assert.equal(this.result.view, 'pages/equipment-or-adaptation/your-equipment-or-adaptation.njk');
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
      it('should populate initial record if there is not one present/undefined', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');

        const req = new Request();
        const res = new Response(req);

        const getDataForPageStub = sinon.stub()
          .returns(undefined);
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
            setDataForPage: setDataForPageStub
          }
        };

        this.result.hooks.prerender(req, res, nextStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('your-specialist-equipment');

        expect(setDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('your-specialist-equipment', {
            item: [{
              description: '',
              dateOfPurchase: {
                day: '',
                month: '',
                year: '',
              },
            }],
          });
      });
      it('should do nothing as there are already records present and do not need pre-populating', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');

        const req = new Request();
        const res = new Response(req);

        const pageData = {
          item: [{
            description: 'Item 1',
            dateOfPurchase: {
              day: '22',
              month: '11',
              year: '2020',
            },
          }, {
            description: 'Item 2',
            dateOfPurchase: {
              day: '23',
              month: '11',
              year: '2020',
            },
          }]
        };

        const getDataForPageStub = sinon.stub()
          .returns(pageData);
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
            setDataForPage: setDataForPageStub
          }
        };

        this.result.hooks.prerender(req, res, nextStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('your-specialist-equipment');

        sinon.assert.notCalled(setDataForPageStub);

      });
    });
    describe('`prevalidate` key', () => {
      let sandbox;
      beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').callsFake();
      });

      afterEach(() => {
        sandbox.restore();
      });

      it('should be defined', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prevalidate');

      });
      it('should got to next if continue pressed', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prevalidate');

        const req = new Request();
        const res = new Response(req);

        const getDataForPageStub = sinon.stub();
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
            setDataForPage: setDataForPageStub
          }
        };

        this.result.hooks.prevalidate(req, res, nextStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();

        sinon.assert.notCalled(setDataForPageStub);
        sinon.assert.notCalled(getDataForPageStub);
      });
      it('should add empty record when user clicks add', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prevalidate');

        const req = new Request();
        const res = new Response(req);

        const pageData = {
          item: [{
            description: 'Item 1',
            dateOfPurchase: {
              day: '22',
              month: '11',
              year: '2020',
            },
          }]
        };

        const getDataForPageStub = sinon.stub()
          .returns(pageData);
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
            setDataForPage: setDataForPageStub
          }
        };

        req.body = {
          add: 'add'
        };
        req.inEditMode = false;

        req.session = {
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };
        const redirectStub = sinon.stub();

        res
          .redirect = redirectStub;

        this
          .result.hooks.prevalidate(req, res, nextStub);

        sinon
          .assert.notCalled(nextStub);

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('your-specialist-equipment');

        const newItemList = {
          item: [{
            description: 'Item 1',
            dateOfPurchase: {
              day: '22',
              month: '11',
              year: '2020',
            },
          }, {
            description: '',
            dateOfPurchase: {
              day: '',
              month: '',
              year: '',
            },
          }]
        };

        expect(setDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('your-specialist-equipment', newItemList);

        expect(redirectStub)
          .to
          .be
          .calledOnceWithExactly(`your-specialist-equipment#f-item[1][description]`);

      });

      it('should add empty record when user clicks add in edit mode', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prevalidate');

        const req = new Request();
        const res = new Response(req);

        const pageData = {
          item: [{
            description: 'Item 1',
            dateOfPurchase: {
              day: '22',
              month: '11',
              year: '2020',
            },
          }]
        };

        const getDataForPageStub = sinon.stub()
          .returns(pageData);
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
            setDataForPage: setDataForPageStub
          }
        };

        req.body = {
          add: 'add'
        };
        req.inEditMode = true;

        req.editOriginUrl = 'test-origin';

        req.session = {
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };
        const redirectStub = sinon.stub();

        res
          .redirect = redirectStub;

        this
          .result.hooks.prevalidate(req, res, nextStub);

        sinon
          .assert.notCalled(nextStub);

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('your-specialist-equipment');

        const newItemList = {
          item: [{
            description: 'Item 1',
            dateOfPurchase: {
              day: '22',
              month: '11',
              year: '2020',
            },
          }, {
            description: '',
            dateOfPurchase: {
              day: '',
              month: '',
              year: '',
            },
          }]
        };

        expect(setDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('your-specialist-equipment', newItemList);

        expect(redirectStub)
          .to
          .be
          .calledOnceWithExactly(`your-specialist-equipment?edit=&editorigin=test-origin#f-item[1][description]`);

      });

      it('should remove row and reload (first item)', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prevalidate');

        const req = new Request();
        const res = new Response(req);

        const pageData = {
          item: [{
            description: 'Item 1',
            dateOfPurchase: {
              day: '22',
              month: '11',
              year: '2020',
            },
          }, {
            description: 'Item 2',
            dateOfPurchase: {
              day: '23',
              month: '11',
              year: '2020',
            },
          }]
        };

        const getDataForPageStub = sinon.stub()
          .returns(pageData);
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
            setDataForPage: setDataForPageStub
          }
        };

        req.body = {
          remove: '0'
        };
        req.inEditMode = false;

        req.session = {
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };
        const redirectStub = sinon.stub();

        res.redirect = redirectStub;

        this.result.hooks.prevalidate(req, res, nextStub);

        sinon.assert.notCalled(nextStub);

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('your-specialist-equipment');

        const newItemList = {
          item: [{
            description: 'Item 2',
            dateOfPurchase: {
              day: '23',
              month: '11',
              year: '2020',
            },
          }]
        };

        expect(setDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('your-specialist-equipment', newItemList);

        expect(redirectStub)
          .to
          .be
          .calledOnceWithExactly(`your-specialist-equipment#f-item[0][description]`);

      });

      it('should remove row and reload (first item) in edit mode', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prevalidate');

        const req = new Request();
        const res = new Response(req);

        const pageData = {
          item: [{
            description: 'Item 1',
            dateOfPurchase: {
              day: '22',
              month: '11',
              year: '2020',
            },
          }, {
            description: 'Item 2',
            dateOfPurchase: {
              day: '23',
              month: '11',
              year: '2020',
            },
          }]
        };

        const getDataForPageStub = sinon.stub()
          .returns(pageData);
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
            setDataForPage: setDataForPageStub
          }
        };

        req.body = {
          remove: '0'
        };
        req.inEditMode = true;

        req.editOriginUrl = 'test-origin';

        req.session = {
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };
        const redirectStub = sinon.stub();

        res.redirect = redirectStub;

        this.result.hooks.prevalidate(req, res, nextStub);

        sinon.assert.notCalled(nextStub);

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('your-specialist-equipment');

        const newItemList = {
          item: [{
            description: 'Item 2',
            dateOfPurchase: {
              day: '23',
              month: '11',
              year: '2020',
            },
          }]
        };

        expect(setDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('your-specialist-equipment', newItemList);

        expect(redirectStub)
          .to
          .be
          .calledOnceWithExactly(`your-specialist-equipment?edit=&editorigin=test-origin#f-item[0][description]`);

      });

      it('should remove row and reload (second item)', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prevalidate');

        const req = new Request();
        const res = new Response(req);

        const pageData = {
          item: [{
            description: 'Item 1',
            dateOfPurchase: {
              day: '22',
              month: '11',
              year: '2020',
            },
          }, {
            description: 'Item 2',
            dateOfPurchase: {
              day: '23',
              month: '11',
              year: '2020',
            },
          }]
        };

        const getDataForPageStub = sinon.stub()
          .returns(pageData);
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
            setDataForPage: setDataForPageStub
          }
        };
        req.inEditMode = false;

        req.body = {
          remove: '1'
        };

        req.session = {
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };
        const redirectStub = sinon.stub();

        res.redirect = redirectStub;

        this.result.hooks.prevalidate(req, res, nextStub);

        sinon.assert.notCalled(nextStub);

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('your-specialist-equipment');

        const newItemList = {
          item: [{
            description: 'Item 1',
            dateOfPurchase: {
              day: '22',
              month: '11',
              year: '2020',
            },
          }]
        };

        expect(setDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('your-specialist-equipment', newItemList);

        expect(redirectStub)
          .to
          .be
          .calledOnceWithExactly(`your-specialist-equipment#f-item[0][description]`);

      });

      describe('Utils: removeAllSpaces', () => {
        it('should export a function', () => {
          expect(removeAllSpaces)
            .to
            .be
            .a('function');
        });

        it('should strip spaces from a string', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('pregather');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          req.body = {
            item: [{
              description: 'Item 1',
              dateOfPurchase: {
                dd: ' 1 ',
                mm: ' 3 ',
                yyyy: ' 2023 ',
              },
            }]
          };

          this.result.hooks.pregather(req, res, nextStub);

          expect(req.body.item.map(e=>e.dateOfPurchase))
            .to
            .include
            .deep
            .members([{dd: '1', mm: '3', yyyy: '2023'}])
        });
      });
    });
  });
});
