const page = require('../../../../../../app/definitions/pages/support-worker/hours-you-had-support');
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

describe('definitions/pages/support-worker/hours-you-had-support', () => {
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
          assert.equal(this.result.view, 'pages/support-worker/hours-you-had-support.njk');
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

    it('First time entering hours for SW', () => {
      expect(Object.keys(this.result))
        .to
        .includes('hooks');
      expect(Object.keys(this.result.hooks))
        .to
        .includes('prerender');

      const req = new Request();
      const res = new Response(req);
      req.headers.referer = '/claims/page';

      const setDataForPageStub = sinon.stub();
      const nextStub = sinon.stub();
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === 'support-month') {
              return {
                monthIndex: "0",
                dateOfSupport: {
                  mm: "1",
                  yyyy: "1111"
                }
              };
            } else if (page === 'support-days') {
              return {
                daysOfSupport: ['1', '4']
              };
            }
            return undefined;
          },
          setDataForPage: setDataForPageStub
        }
      };

      this.result.hooks.prerender(req, res, nextStub);

      expect(res.locals.daysOfSupport).to
        .deep.equal( [
        {
          day: "1",
          weekday: 0,
          month: "1"
        },
        {
          day: "4",
          weekday: 3,
          month: "1"
        }
      ]);

      expect(res.locals.monthYearOfSupport).to
        .deep
        .equal ({
        mm: "1",
        yyyy: "1111"
      });

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
      req.headers.referer = "http://localhost:3040/claim/support-worker/support-days?changeMonthYear=0";

      const setDataForPageStub = sinon.stub();
      const nextStub = sinon.stub();
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__hidden_support_page__') {
              return {
                '0': {
                  monthYear: {
                    mm: '1',
                    yyyy: '1111'
                  },
                  claim: [{
                    dayOfSupport: '1',
                    timeOfSupport: {
                      hoursOfSupport: '1',
                      minutesOfSupport: '15'
                    }
                  },
                    {
                      dayOfSupport: '4',
                      timeOfSupport: {
                        hoursOfSupport: '2',
                        minutesOfSupport: '30'
                      }
                    }]
                }
              }
            }
            if (page === 'support-month') {
              return {
                monthIndex: "0",
                dateOfSupport: {
                  mm: "1",
                  yyyy: "1111"
                }
              };
            } else if (page === 'support-days') {
              return {
                daysOfSupport: ['1', '4']
              };
            } else if (page === 'support-hours') {
              return {
                  hours: [
                    {
                      dayOfSupport: '1',
                      timeOfSupport: {
                        hoursOfSupport: '1',
                        minutesOfSupport: '15'
                      }
                    },
                    {
                      dayOfSupport: '4',
                      timeOfSupport: {
                        hoursOfSupport: '2',
                        minutesOfSupport: '30'
                      }
                    }
                  ]
              };
            }
            return undefined;
          },
          setDataForPage: setDataForPageStub
        }
      };

      this.result.hooks.prerender(req, res, nextStub);

      expect(res.locals.hours).to
        .deep.equal([{
            dayOfSupport: '1',
            timeOfSupport: {
              hoursOfSupport: '1',
              minutesOfSupport: '15'
            }
          },
            {
              dayOfSupport: '4',
              timeOfSupport: {
                hoursOfSupport: '2',
                minutesOfSupport: '30'
              }
            }]
      );

      expect(res.locals.monthYearOfSupport).to
        .deep
        .equal ({
        mm: "1",
        yyyy: "1111"
      });

    });

  });


  describe('`preredirect` key', () => {
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
              'support-claim-summary?edit=&editorigin=test-origin');

      sandbox.restore();
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

    it('should go to the next page if continue is pressed (support-month, support-days, support-hours populated)', () => {
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
            if (page === 'support-month') {
              return {
                monthIndex: '0',
                dateOfSupport: {
                  mm: '12',
                  yyyy: '2020'
                }
              };
            } else if (page === 'support-days') {
              return {
                daysOfSupport: ['1', '4']
              };
            } else if (page === 'support-hours') {
              return {
                hours: [{
                  timeOfSupport: {
                    hoursOfSupport: '1',
                    minutesOfSupport: '15'
                  }
                },
                  {
                  timeOfSupport: {
                    hoursOfSupport: '2',
                    minutesOfSupport: '30'
                  }
                }]
              }
            }
            return undefined;
          },
          setDataForPage: setDataForPageStub
        }
      };

      req.body = {
        hours:[{
          timeOfSupport: {
            hoursOfSupport: '1',
            minutesOfSupport: '15'
          }
        },
      {
        timeOfSupport: {
          hoursOfSupport: '2',
              minutesOfSupport: '30'
        }
      }]
      }

      this.result.hooks.postvalidate(req, res, nextStub);

      expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();

      sinon.assert.calledThrice(setDataForPageStub);
      sinon.assert.calledWith(setDataForPageStub.secondCall, '__hidden_support_page__', {
        '0': {
          monthYear: {
            mm: '12',
            yyyy: '2020'
          },
          claim: [{
            dayOfSupport: '1',
                timeOfSupport: {
                  hoursOfSupport: '1',
                  minutesOfSupport: '15'
                }
            },
            {
              dayOfSupport: '4',
                timeOfSupport: {
                  hoursOfSupport: '2',
                  minutesOfSupport: '30'
                }
            }]
        }
      });

    });

    it('should go to the next page if continue is pressed (__hidden_support_page__ populated)', () => {
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
            if (page === 'support-month') {
              return {
                monthIndex: '1',
                dateOfSupport: {
                  mm: '12',
                  yyyy: '2021'
                }
              };
            } else if (page === 'support-days') {
              return {
                daysOfSupport: ['1', '4']
              };
            } else if (page === 'support-hours') {
              return {
                hours: [{
                  timeOfSupport: {
                    hoursOfSupport: '1',
                    minutesOfSupport: '15'
                  }
                },
                  {
                    timeOfSupport: {
                      hoursOfSupport: '2',
                      minutesOfSupport: '30'
                    }
                  }]
              }
            }
            return {
              '0': {
                monthYear: {
                  mm: '12',
                  yyyy: '2020'
                },
                claim: [{
                  daysOfSupport: '1',
                  timeOfSupport: {
                    hoursOfSupport: '1',
                    minutesOfSupport: '15'
                  }
                },
                  {
                    daysOfSupport: '4',
                    timeOfSupport: {
                      hoursOfSupport: '2',
                      minutesOfSupport: '30'
                    }
                  }]
              },
              '1': {
                monthYear: {
                  mm: '12',
                  yyyy: '2021'
                },
                claim: [{
                  daysOfSupport: '1',
                  timeOfSupport: {
                    hoursOfSupport: '1',
                    minutesOfSupport: '15'
                  }
                },
                  {
                    daysOfSupport: '4',
                    timeOfSupport: {
                      hoursOfSupport: '2',
                      minutesOfSupport: '30'
                    }
                  }]
              }
            }
          },
          setDataForPage: setDataForPageStub
        }
      };

      req.body = {
        hours:[{
          timeOfSupport: {
            hoursOfSupport: '1',
            minutesOfSupport: '15'
          }
        },
          {
            timeOfSupport: {
              hoursOfSupport: '2',
              minutesOfSupport: '30'
            }
          }]
      }

      this.result.hooks.postvalidate(req, res, nextStub);

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();

      sinon.assert.calledThrice(setDataForPageStub);

      sinon.assert.calledWith(setDataForPageStub.secondCall, '__hidden_support_page__', {
        "0": {
          monthYear: {
            "mm": "12",
            "yyyy": "2020"
          },
          claim: [
            {
              daysOfSupport: "1",
              timeOfSupport: {
                hoursOfSupport: "1",
                minutesOfSupport: "15"
              }
            },
            {
              daysOfSupport: "4",
              timeOfSupport: {
                hoursOfSupport: "2",
                minutesOfSupport: "30"
              }
            }
          ]
        },
        "1": {
          monthYear: {
            mm: "12",
            yyyy: "2021"
          },
          claim: [
            {
              timeOfSupport: {
                hoursOfSupport: "1",
                minutesOfSupport: "15"
              },
              dayOfSupport: "1"
            },
            {
              timeOfSupport: {
                hoursOfSupport: "2",
                minutesOfSupport: "30"
              },
              dayOfSupport: "4"
            }
          ]
        }
      });

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

        req.body.hours = {
          '0': {
            timeOfSupport: {
              hoursOfSupport: '1',
              minutesOfSupport: '15'
            }
          },
          '1': {
            timeOfSupport: {
              hoursOfSupport: '2',
              minutesOfSupport: '30'
            }
          }
        };

        this.result.hooks.pregather(req, res, nextStub);

        expect(req.body.hours)
            .to
            .deep
            .equal({
              '0': {
                timeOfSupport: {
                  hoursOfSupport: '1',
                  minutesOfSupport: '15'
                }
              },
              '1': {
                timeOfSupport: {
                  hoursOfSupport: '2',
                  minutesOfSupport: '30'
                }
              }
            })
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

          req.body.hours = {
            '0': {
              timeOfSupport: {
                hoursOfSupport: '1',
                minutesOfSupport: '15'
              }
            },
            '1': {
              timeOfSupport: {
                hoursOfSupport: '2',
                minutesOfSupport: '30'
              }
            }
          };

          this.result.hooks.pregather(req, res, nextStub);

          expect(req.body.hours)
            .to
            .deep
            .equal({
              '0': {
                timeOfSupport: {
                  hoursOfSupport: '1',
                  minutesOfSupport: '15'
                }
              },
              '1': {
                timeOfSupport: {
                  hoursOfSupport: '2',
                  minutesOfSupport: '30'
                }
              }
            })
        });
      });
    });
  });
})
;

