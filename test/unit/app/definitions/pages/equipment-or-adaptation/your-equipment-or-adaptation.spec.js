const page = require('../../../../../../app/definitions/pages/equipment-or-adaptation/your-equipment-or-adaptation');
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const { removeAllSpaces, removeLeadingZero } = require('../../../../../../app/utils/remove-all-spaces.js');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('definitions/pages/equipment-or-adaptation/your-equipment-or-adaptation', () => {
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

        sinon.assert.called(nextStub);
        sinon.assert.called(getDataForPageStub);
        sinon.assert.called(setDataForPageStub);

      });

      it('should populate initial record if add another was selected', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');

        const req = new Request();
        const res = new Response(req);

        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
        req.casa = {
          journeyContext: {
            getDataForPage: (page) => {
              if (page === 'specialist-equipment-summary') {
                return {
                  addAnother: 'yes'
                };
              } 
              return undefined;
            },
            setDataForPage: setDataForPageStub
          }
        };

        this.result.hooks.prerender(req, res, nextStub);

        sinon.assert.called(nextStub);
        sinon.assert.called(setDataForPageStub);

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

        sinon.assert.called(nextStub);
        sinon.assert.called(getDataForPageStub);
        sinon.assert.notCalled(setDataForPageStub);
  
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
  
      it('if in edit mode', () => {
        expect(Object.keys(this.result))
            .to
            .includes('hooks');
        expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');
  
        const req = new Request();
        const res = new Response(req);
  
        const pageData = {
          '0': [{
            description: "computer",
            dateOfPurchase: {
              dd: "1",
              mm: "2",
              yyyy: "2003"
            }
          }],
          '1': [{
            description: "mouse",
            dateOfPurchase: {
              dd: "4",
              mm: "5",
              yyyy: "2006"
            }
          }]
        };
  
        const getDataForPageStub = sinon.stub()
          .returns(pageData);
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
  
        req.inEditMode = true;
  
        req.editOriginUrl = 'test-origin';
  
        const redirectStub = sinon.stub();
  
        res.redirect = redirectStub;
  
        this.result.hooks.preredirect(req, res, nextStub);
  
        sinon.assert.notCalled(nextStub);
  
        expect(redirectStub)
            .to
            .be
            .calledOnceWithExactly(
                'specialist-equipment-summary?edit=&editorigin=test-origin');
  
        sandbox.restore();
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

    describe('`postvalidate` key', () => {
   
      it('should be defined', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('postvalidate');

      });

      it('should go to the next page if continue is pressed when your-specialist-equipment populated)', () => {
        const req = new Request();
        const res = new Response(req);
  
        const setDataForPageStub = sinon.stub();
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
            getDataForPage: (page) => {
              if (page === 'your-specialist-equipment') {
                return {
                  item: [{
                    description: 'Item 1',
                    dateOfPurchase: {
                      day: '11',
                      month: '22',
                      year: '2024',
                    },
                  }]
                };
              } 
              return undefined;
            },
            setDataForPage: setDataForPageStub
          }
        };
 
        this.result.hooks.postvalidate(req, res, nextStub);
  
        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();
  
        sinon.assert.calledTwice(setDataForPageStub);
  
        sinon.assert.calledWith(setDataForPageStub.firstCall, '__hidden_specialist_equipment_page__', {
          '0': [{
            description: 'Item 1',
            dateOfPurchase: {
              day: '11',
              month: '22',
              year: '2024',
            },
          }]
        });
  
      });

      it('should go to the next page if continue is pressed (__hidden_specialist_equipment_page__ populated)', () => {
        const req = new Request();
        const res = new Response(req);
  
        const setDataForPageStub = sinon.stub();
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
            getDataForPage: (page) => {
              if (page === 'your-specialist-equipment') {
                return {
                  item: [{
                    description: 'Item 2',
                    dateOfPurchase: {
                      day: '11',
                      month: '22',
                      year: '2024',
                    },
                  }]
                };
              } 
              return {
                '0': [{
                  description: 'Item 1',
                  dateOfPurchase: {
                    day: '22',
                    month: '11',
                    year: '2020',
                  },
                }],
              }
            },
            setDataForPage: setDataForPageStub
          }
        };
 
        this.result.hooks.postvalidate(req, res, nextStub);
  
        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();
  
        sinon.assert.calledTwice(setDataForPageStub);
  
        sinon.assert.calledWith(setDataForPageStub.firstCall, '__hidden_specialist_equipment_page__', {
          '0': [{
            description: 'Item 1',
            dateOfPurchase: {
              day: '22',
              month: '11',
              year: '2020',
            },
          }],
          '1': [{
            description: 'Item 2',
            dateOfPurchase: {
              day: '11',
              month: '22',
              year: '2024',
            },
          }],
        });
  
      });

      describe('Utils: removeAllSpaces', () => {
        it('should export a function', () => {
          expect(removeAllSpaces)
            .to
            .be
            .a('function');

          expect(removeLeadingZero)
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

        it('should remove leading zeros from a string', () => {
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
                dd: '01',
                mm: '03',
                yyyy: '02023',
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

        it('should remove leading zeros and spaces from a string', () => {
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
                dd: ' 01 ',
                mm: ' 03 ',
                yyyy: ' 02023 ',
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
