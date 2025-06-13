const page = require('../../../../../../app/definitions/pages/vehicle-adaptations/your-vehicle-adaptations');
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const { removeAllSpaces, removeLeadingZero } = require('../../../../../../app/utils/remove-all-spaces.js');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('definitions/pages/vehicle-adaptations/your-vehicle-adaptations', () => {
  it('should page a function', () => {
    assert.typeOf(page, 'function');
  });
  describe('when exported function is invoked', () => {
    let sandbox;

    beforeEach(() => {
      this.result = page();
      sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();
    });

    afterEach(() => {
      sandbox.restore();
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
          assert.equal(this.result.view, 'pages/vehicle-adaptations/your-vehicle-adaptations.njk');
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
        .calledWith();

      expect(getDataForPageStub)
        .to
        .be
        .calledWith('your-vehicle-adaptations');

      expect(setDataForPageStub)
        .to
        .be
        .calledOnceWithExactly('your-vehicle-adaptations', {
          item: [{
            description: '',
            dateOfInvoice: {
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
          dateOfInvoice: {
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

      this.result.hooks.prerender(req, res, nextStub);

      expect(nextStub)
        .to
        .be
        .calledWith();

      expect(getDataForPageStub)
        .to
        .be
        .calledWith('your-vehicle-adaptations');

      sinon.assert.notCalled(setDataForPageStub);

    });
  });

  describe('`pregather` key', () => {
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
            dateOfInvoice: {
              dd: ' 2 5 ',
              mm: ' 1 2 ',
              yyyy: ' 20 23 ',
            },
          }]
        };

        this.result.hooks.pregather(req, res, nextStub);

        expect(req.body.item.map(e=>e.dateOfInvoice))
          .to
          .include
          .deep
          .members([{dd: '25', mm: '12', yyyy: '2023'}])
      });
    });

    describe('Utils: removeLeadingZeros', () => {
      it('should export a function', () => {
        expect(removeLeadingZero)
          .to
          .be
          .a('function');
      });

      it('should strip leading zeros from a string', () => {
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
            dateOfInvoice: {
              dd: '05',
              mm: '02',
              yyyy: '2023',
            },
          }]
        };

        this.result.hooks.pregather(req, res, nextStub);

        expect(req.body.item.map(e=>e.dateOfInvoice))
          .to
          .include
          .deep
          .members([{dd: '5', mm: '2', yyyy: '2023'}])
      });
    });

    describe('`preredirect` key', () => {
      beforeEach(() => {
        this.result = page();
      });
  
      it('should be defined', () => {
        expect(Object.keys(this.result))
            .to
            .includes('hooks');
        expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');
  
      });
  
      it('if not in edit mode', () => {
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
  
        req.inEditMode = false;
  
        this.result.hooks.preredirect(req, res, nextStub);
  
        expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
  
      });
    });
  })

  describe('`postvalidate` key', () => {
   
    it('should be defined', () => {
      expect(Object.keys(this.result))
        .to
        .includes('hooks');
      expect(Object.keys(this.result.hooks))
        .to
        .includes('postvalidate');

    });
  });
});
