const sinon = require('sinon');
const page = require(
  '../../../../../../app/definitions/pages/travel-to-work/days-you-travelled-for-work');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const { removeAllSpaces } = require('../../../../../../app/utils/remove-all-spaces.js');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('definitions/pages/travel-to-work/days-you-travelled-for-work', () => {
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
          assert.equal(this.result.view, 'pages/travel-to-work/days-you-travelled-for-work.njk');
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
      sandbox.stub(JourneyContext, 'putContext')
        .callsFake();
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
    it('should populate initial record if there is not one present/undefined', () => {
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
            if (page === 'travel-month') {
              return {
                dateOfTravel: {
                  mm: '12',
                  yyyy: '2020',
                },
              };
            }
            if (page === 'journeys-miles') {
              return {
                journeysOrMileage: 'mileage',
              };
            }
            return undefined;
          },
          setDataForPage: setDataForPageStub,
        },
      };

      this.result.hooks.prerender(req, res, nextStub);

      expect(res.locals.journeysOrMileage)
        .to
        .be
        .equal('mileage');

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();

      expect(setDataForPageStub)
        .to
        .be
        .calledOnceWithExactly('travel-days', {
          day: [
            {
              dayOfTravel: '',
              totalTravel: '',
            }],
        });
    });

    it('should do nothing as there are already records present and do not need pre-populating',
      () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');

        const req = new Request();
        const res = new Response(req);
        const saveStub = sinon.stub();

        req.session = {
          save: saveStub
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };

        const pageData = {
          day: [
            {
              dayOfTravel: '1',
              totalTravel: '1',
            }, {
              dayOfTravel: '2',
              totalTravel: '2',
            }],
        };

        const getDataForPageStub = sinon.stub()
          .returns(pageData);

        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
        req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === 'travel-month') {
                  return {'dateOfTravel': {mm: '1', yyyy: '2020'}}
                };
                return {
                  mm: '12',
                  yyyy: '2020',
                };
              },
            setDataForPage: setDataForPageStub,
          },
        };

        this.result.hooks.prerender(req, res, nextStub);

        sinon.assert.notCalled(saveStub);
        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();
        sinon.assert.notCalled(setDataForPageStub);
      });

    it('clear and populate fields when loaded in Change mode', () => {
      const req = new Request();
      const res = new Response(req);

      req.query = {
        changeMonthYear: '0',
      };

      req.session = {
        save: sinon.stub()
          .callsFake((cb) => {
            if (cb) {
              cb();
            }
          }),
      };

      const pageData = {
        0: {
          monthYear: {
            mm: '12',
            yyyy: '2020',
          },
          claim: [
            {
              dayOfTravel: '1',
              totalTravel: '1',
            }, {
              dayOfTravel: '2',
              totalTravel: '2',
            }],
        },
      };
      const setDataForPageStub = sinon.stub();
      const nextStub = sinon.stub();
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__hidden_travel_page__') {
              return pageData;
            }
            return {
              mm: '12',
              yyyy: '2020',
            };
          },
          setDataForPage: setDataForPageStub,
        },
      };

      this.result.hooks.prerender(req, res, nextStub);

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();

      sinon.assert.calledTwice(setDataForPageStub);
      sinon.assert.calledWith(setDataForPageStub.firstCall, 'travel-month', {
        monthIndex: '0',
        dateOfTravel: {
          mm: '12',
          yyyy: '2020',
        },
      });
      sinon.assert.calledWith(setDataForPageStub.secondCall, 'travel-days', {
        day: [
          {
            dayOfTravel: '1',
            totalTravel: '1',
          }, {
            dayOfTravel: '2',
            totalTravel: '2',
          },
        ],
      });
    });
  });

  describe('`postvalidate` key', () => {
    let sandbox;

    beforeEach(() => {
      this.result = page();
      sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext')
        .callsFake();
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

    it('should go to the next page if continue is pressed (__hidden_travel_page__ empty)', () => {
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
            if (page === 'travel-month') {
              return {
                monthIndex: 0,
                dateOfTravel: {
                  mm: 1,
                  yyyy: 2020,
                },
              };
            }
            if (page === 'travel-days') {
              return {
                day: [
                  {
                    dayOfTravel: '1',
                    totalTravel: '1',
                  }, {
                    dayOfTravel: '2',
                    totalTravel: '2',
                  }],
              };
            }
            return undefined;
          },
          setDataForPage: setDataForPageStub,
        },
      };

      req.body.dateOfTravel = [
        {
          "dateOfTravel": "1"
        },
        {
          "dateOfTravel": "2"
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        },
        {
          "dateOfTravel": ""
        }
      ]

      this.result.hooks.postvalidate(req, res, nextStub);

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();

      sinon.assert.calledTwice(setDataForPageStub);
      sinon.assert.calledWith(setDataForPageStub.firstCall, '__hidden_travel_page__', {
        0: {
          monthYear: {
            mm: 1,
            yyyy: 2020,
          },
          claim: [
            {
              dayOfTravel: 1,
              totalTravel: 1,
            }, {
              dayOfTravel: 2,
              totalTravel: 2,
            }],
        },
      });

      sinon.assert.calledWith(setDataForPageStub.secondCall, 'journey-summary', undefined);
    });

    it('should go to the next page if continue is pressed (__hidden_travel_page__ populated)',
      () => {
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
              if (page === 'travel-month') {
                return {
                  monthIndex: 1,
                  dateOfTravel: {
                    mm: 12,
                    yyyy: 2020,
                  },
                };
              }
              if (page === 'travel-days') {
                return {
                  day: [
                    {
                      dayOfTravel: '4',
                      totalTravel: '4',
                    }],
                };
              }
              return {
                '0': {
                  monthYear: {
                    mm: 11,
                    yyyy: 2020,
                  },
                  claim: [
                    {
                      dayOfTravel: 1,
                      totalTravel: 1,
                    }, {
                      dayOfTravel: 2,
                      totalTravel: 2,
                    }],
                },
                '1': {
                  monthYear: {
                    mm: 12,
                    yyyy: 2020,
                  },
                  claim: [
                    {
                      dayOfTravel: 1,
                      totalTravel: 1,
                    }, {
                      dayOfTravel: 2,
                      totalTravel: 2,
                    }],
                },
              };
            },
            setDataForPage: setDataForPageStub,
          },
        };

        req.body.dateOfTravel = [
          {
            "dateOfTravel": "1"
          },
          {
            "dateOfTravel": "2"
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          },
          {
            "dateOfTravel": ""
          }
        ]

        this.result.hooks.postvalidate(req, res, nextStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();

        sinon.assert.calledTwice(setDataForPageStub);
        sinon.assert.calledWith(setDataForPageStub.firstCall, '__hidden_travel_page__', {
          '0': {
            monthYear: {
              mm: 11,
              yyyy: 2020
            },
            claim: [
              {
                dayOfTravel: 1,
                totalTravel: 1
              },
              {
                dayOfTravel: 2,
                totalTravel: 2
              }
            ]
          },
          '1': {
            monthYear: {
              mm: 12,
              yyyy: 2020
            },
            claim: [
              {
                dayOfTravel: 1,
                totalTravel: 1
              },
              {
                dayOfTravel: 2,
                totalTravel: 2
              }
            ]
          }
        });

      sinon.assert.calledWith(setDataForPageStub.secondCall, 'journey-summary', undefined);
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
            .includes('prerender');

        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();

        req.body.dateOfTravel = [
          {
            "dateOfTravel": " 1 "
          },
          {
            "dateOfTravel": " 2 "
          }
        ]

        this.result.hooks.pregather(req, res, nextStub);

        expect(req.body.dateOfTravel)
            .to
            .include
            .deep
            .members([
              {
                "dateOfTravel": "1"
              },
              {
                "dateOfTravel": "2"
              }
            ])
      });
    });
  });


});
