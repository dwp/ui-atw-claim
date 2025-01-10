const page = require('../../../../../../app/definitions/pages/travel-in-work/journey-number');
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const {removeAllSpaces} = require("../../../../../../app/utils/remove-all-spaces");

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('definitions/pages/travel-in-work/journey-number', () => {
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
          assert.equal(this.result.view, 'pages/travel-in-work/journey-number.njk');
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
    let sandbox;
    beforeEach(() => {
      this.result = page();
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
        .includes('prerender');

    });
    it('should create textboxes for month', () => {
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
            if (page === 'travel-claim-month') {
              return {
                monthIndex: '0',
                dateOfTravel: {
                  mm: '12',
                  yyyy: '2020'
                }
              };
            }
            return undefined;
          },
          setDataForPage: setDataForPageStub
        }
      };

      this.result.hooks.prerender(req, res, nextStub);

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();
    });

    it('Change from summary screen not CYA', () => {
      expect(Object.keys(this.result))
          .to
          .includes('hooks');
      expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');

      const req = new Request();
      const res = new Response(req);
      req.query.changeMonthYear = '0';

      const setDataForPageStub = sinon.stub();
      const nextStub = sinon.stub();
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__hidden_travel_page__') {
              return {
                '0': {
                  monthYear: {
                    mm: '1',
                    yyyy: '2024',
                  },
                  claim: [{dayOfTravel: 1,
                      startPostcode: 'a',
                      endPostcode: 'b',
                      costOfTravel: '1'
                  }]
                }
              }
            }
            if (page === 'travel-claim-month') {
              return {
                monthIndex: "0",
                dateOfTravel: {
                  mm: "1",
                  yyyy: "2024"
                }
              };
            } else if (page === 'travel-claim-days') {
              return {
                daysOfSupport: [{indexDay: 1, journeyNumber: 1}]
              };
            }
            return undefined;
          },
          setDataForPage: setDataForPageStub
        }
      };

      this.result.hooks.prerender(req, res, nextStub);

      expect(res.locals.days)
          .to
          .deep
          .equal([1]
      );

      expect(res.locals.monthYearOfSupport).to
          .deep
          .equal ({
            mm: "1",
            yyyy: "2024"
          });

    });

  });

  describe('`pregather` key', () => {
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

      req.body.dateOfTravel = [
        {
          "dateOfTravel": "1"
        }
      ]

      this.result.hooks.pregather(req, res, nextStub);

      expect(req.body.dateOfTravel.map(e => e))
          .to
          .include
          .deep
          .members([{dateOfTravel: '1'}])
    });
  });

  describe('`postvalidate` key', () => {
    let sandbox;
    beforeEach(() => {
      this.result = page();
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
        .includes('postvalidate');

    });
    it('should go to the next page if continue is pressed (travel-claim-days populated)', () => {
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
            if (page === 'travel-claim-month') {
              return {
                monthIndex: '0',
                dateOfTravel: {
                  mm: '12',
                  yyyy: '2020'
                }
              };
            } else if (page === 'travel-claim-days') {
              return {
                '0': {
                  monthYear: {
                    mm: '12',
                    yyyy: '2020'
                  },
                  days: [{
                    '0': {
                      indexDay: '1',
                      journeyNumber: '1'
                    }
                  }]
                }
              };

            }
            return undefined;
          },
          setDataForPage: setDataForPageStub
        }
      };

      req.body.dateOfTravel = [
        {
          "dateOfTravel": "1"
        }
      ];

      this.result.hooks.postvalidate(req, res, nextStub);

      expect(setDataForPageStub)
        .to
        .be
        .calledOnceWithExactly('travel-claim-days', [{
          "indexDay": 1,
          "journeyNumber": 1
        }]
        );
    });

  });

});

