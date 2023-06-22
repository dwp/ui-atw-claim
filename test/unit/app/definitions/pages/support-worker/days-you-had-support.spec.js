const page = require('../../../../../../app/definitions/pages/support-worker/days-you-had-support');
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

describe('definitions/pages/support-worker/days-you-had-support', () => {
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
          assert.equal(this.result.view, 'pages/support-worker/days-you-had-support.njk');
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
            if (page === 'month-claiming-support-worker-costs') {
              return {
                dateOfSupport: {
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

      expect(setDataForPageStub)
        .to
        .be
        .calledOnceWithExactly('days-you-had-support', {
          day: [{
            dayOfSupport: '',
            timeOfSupport: {
              hoursOfSupport: '',
              minutesOfSupport: ''
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
        day: [{
          dayOfSupport: '1',
          timeOfSupport: {
            hoursOfSupport: '4',
            minutesOfSupport: '45'
          },
          nameOfSupport: 'Name',
        }, {
          dayOfSupport: '2',
          timeOfSupport: {
            hoursOfSupport: '4',
            minutesOfSupport: '50'
          },
          nameOfSupport: 'Name',
        }],
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

      req.query =
        {
          changeMonthYear: '0'
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
          '0': {
            monthYear: {
              mm: '12',
              yyyy: '2020',
            },
            claim: [{
              dayOfSupport: '1',
              timeOfSupport: {
                hoursOfSupport: '1',
                minutesOfSupport: '45'
              },
              nameOfSupport: 'Name1',
            }, {
              dayOfSupport: '2',
              timeOfSupport: {
                hoursOfSupport: '4',
                minutesOfSupport: '30'
              },
              nameOfSupport: 'Name2',
            }],
          }
        }
      ;

      const setDataForPageStub = sinon.stub();
      const nextStub = sinon.stub();
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__hidden_support_page__') {
              return pageData;
            } else {
              return {
                mm: '12',
                yyyy: '2020',
              };
            }
          },
          setDataForPage: setDataForPageStub
        }
      };

      this.result.hooks.prerender(req, res, nextStub);

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();

      sinon.assert.calledTwice(setDataForPageStub);
      sinon.assert.calledWith(setDataForPageStub.firstCall, 'month-claiming-support-worker-costs', {
        monthIndex: '0',
        dateOfSupport: {
          mm: '12',
          yyyy: '2020'
        }
      });
      sinon.assert.calledWith(setDataForPageStub.secondCall, 'days-you-had-support', {
        day: [
          {
            dayOfSupport: '1',
            timeOfSupport: {
              hoursOfSupport: '1',
              minutesOfSupport: '45'
            },
            nameOfSupport: 'Name1'
          },
          {
            dayOfSupport: '2',
            timeOfSupport: {
              hoursOfSupport: '4',
              minutesOfSupport: '30'
            },
            nameOfSupport: 'Name2'
          }
        ]
      });

    });
  });
  describe('`prevalidate` key', () => {
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
        .includes('prevalidate');

    });
    it('should go to the next page if continue is pressed', () => {
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
        day: [{
          dayOfSupport: '1',
          timeOfSupport: {
            hoursOfSupport: '4',
            minutesOfSupport: '55'
          },
          nameOfSupport: 'Name',
        }, {
          dayOfSupport: '2',
          timeOfSupport: {
            hoursOfSupport: '3',
            minutesOfSupport: '30'
          },
          nameOfSupport: 'Name',
        }],
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
        .calledOnceWithExactly('days-you-had-support');

      const newItemList = {
        day: [{
          dayOfSupport: '1',
          timeOfSupport: {
            hoursOfSupport: '4',
            minutesOfSupport: '55'
          },
          nameOfSupport: 'Name',
        }, {
          dayOfSupport: '2',
          timeOfSupport: {
            hoursOfSupport: '3',
            minutesOfSupport: '30'
          },
          nameOfSupport: 'Name',
        }, {
          dayOfSupport: '',
          timeOfSupport: {
            hoursOfSupport: '',
            minutesOfSupport: ''
          },
        }],
      };

      expect(setDataForPageStub)
        .to
        .be
        .calledOnceWithExactly('days-you-had-support', newItemList);

      expect(redirectStub)
        .to
        .be
        .calledOnceWithExactly(`days-you-had-support#f-day[2][dayOfSupport]`);

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
        day: [{
          dayOfSupport: '1',
          timeOfSupport: {
            hoursOfSupport: '2',
            minutesOfSupport: '15'
          },
          nameOfSupport: 'Name',
        }, {
          dayOfSupport: '2',
          timeOfSupport: {
            hoursOfSupport: '',
            minutesOfSupport: '35'
          },
          nameOfSupport: 'Name',
        }],
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
        .calledOnceWithExactly('days-you-had-support');

      const newItemList = {
        day: [{
          dayOfSupport: '1',
          timeOfSupport: {
            hoursOfSupport: '2',
            minutesOfSupport: '15'
          },
          nameOfSupport: 'Name',
        }, {
          dayOfSupport: '2',
          timeOfSupport: {
            hoursOfSupport: '',
            minutesOfSupport: '35'
          },
          nameOfSupport: 'Name',
        }, {
          dayOfSupport: '',
          timeOfSupport: {
            hoursOfSupport: '',
            minutesOfSupport: ''
          }
        }],
      };

      expect(setDataForPageStub)
        .to
        .be
        .calledOnceWithExactly('days-you-had-support', newItemList);

      expect(redirectStub)
        .to
        .be
        .calledOnceWithExactly(`days-you-had-support?edit=&editorigin=test-origin#f-day[2][dayOfSupport]`);

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
        day: [{
          dayOfSupport: '1',
          timeOfSupport: {
            hoursOfSupport: '2',
            minutesOfSupport: '10'
          },
          nameOfSupport: 'Name',
        }, {
          dayOfSupport: '2',
          timeOfSupport: {
            hoursOfSupport: '12',
            minutesOfSupport: '20'
          },
          nameOfSupport: 'Name',
        }],
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
        .calledOnceWithExactly('days-you-had-support');

      const newItemList = {
        day: [{
          dayOfSupport: '2',
          timeOfSupport: {
            hoursOfSupport: '12',
            minutesOfSupport: '20'
          },
          nameOfSupport: 'Name',
        }],
      };

      expect(setDataForPageStub)
        .to
        .be
        .calledOnceWithExactly('days-you-had-support', newItemList);

      expect(redirectStub)
        .to
        .be
        .calledOnceWithExactly(`days-you-had-support#f-day[0][dayOfSupport]`);

    });

    it('should remove row and reload in edit mode', () => {
      expect(Object.keys(this.result))
        .to
        .includes('hooks');
      expect(Object.keys(this.result.hooks))
        .to
        .includes('prevalidate');

      const req = new Request();
      const res = new Response(req);

      const pageData = {
        day: [{
          dayOfSupport: '1',
          timeOfSupport: {
            hoursOfSupport: '1',
            minutesOfSupport: '45'
          },
          nameOfSupport: 'Name',
        }, {
          dayOfSupport: '2',
          timeOfSupport: {
            hoursOfSupport: '4',
            minutesOfSupport: '45'
          },
          nameOfSupport: 'Name',
        }],
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
        .calledOnceWithExactly('days-you-had-support');

      const newItemList = {
        day: [{
          dayOfSupport: '2',
          timeOfSupport: {
            hoursOfSupport: '4',
            minutesOfSupport: '45'
          },
          nameOfSupport: 'Name',
        }],
      };

      expect(setDataForPageStub)
        .to
        .be
        .calledOnceWithExactly('days-you-had-support', newItemList);

      expect(redirectStub)
        .to
        .be
        .calledOnceWithExactly(`days-you-had-support?edit=&editorigin=test-origin#f-day[0][dayOfSupport]`);

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
        day: [{
          dayOfSupport: '1',
          timeOfSupport: {
            hoursOfSupport: '4',
            minutesOfSupport: '45'
          },
          nameOfSupport: 'Name',
        }, {
          dayOfSupport: '2',
          timeOfSupport: {
            hoursOfSupport: '',
            minutesOfSupport: '45'
          },
          nameOfSupport: 'Name',
        }],
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
        .calledOnceWithExactly('days-you-had-support');

      const newItemList = {
        day: [{
          dayOfSupport: '1',
          timeOfSupport: {
            hoursOfSupport: '4',
            minutesOfSupport: '45'
          },
          nameOfSupport: 'Name',
        }]
      };

      expect(setDataForPageStub)
        .to
        .be
        .calledOnceWithExactly('days-you-had-support', newItemList);

      expect(redirectStub)
        .to
        .be
        .calledOnceWithExactly(`days-you-had-support#f-day[0][dayOfSupport]`);
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
    it('should go to the next page if continue is pressed (__hidden_support_page__ empty)', () => {
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
            if (page === 'month-claiming-support-worker-costs') {
              return {
                monthIndex: 0,
                dateOfSupport: {
                  'mm': 11,
                  'yyyy': 2020,
                }
              };
            } else if (page === 'days-you-had-support') {

              return {
                day: [{
                  dayOfSupport: '1',
                  timeOfSupport: {
                    hoursOfSupport: '4',
                    minutesOfSupport: '45'
                  },
                  nameOfSupport: 'Name',
                }, {
                  dayOfSupport: '2',
                  timeOfSupport: {
                    hoursOfSupport: '2',
                    minutesOfSupport: '50'
                  },
                  nameOfSupport: 'Name',
                }],
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
      sinon.assert.calledWith(setDataForPageStub.firstCall, '__hidden_support_page__', {
        '0': {
          monthYear: {
            'mm': 11,
            'yyyy': 2020
          },
          claim: [{
            dayOfSupport: '1',
            timeOfSupport: {
              hoursOfSupport: 4,
              minutesOfSupport: 45
            },
            nameOfSupport: 'Name',
          }, {
            dayOfSupport: '2',
            timeOfSupport: {
              hoursOfSupport: 2,
              minutesOfSupport: 50
            },
            nameOfSupport: 'Name',
          }]
        }
      });

      sinon.assert.calledWith(setDataForPageStub.secondCall, 'support-claim-summary', undefined);

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
            if (page === 'month-claiming-support-worker-costs') {
              return {
                monthIndex: 1,
                dateOfSupport: {
                  'mm': 1,
                  'yyyy': 2020,
                }
              };
            } else if (page === 'days-you-had-support') {

              return {
                day: [{
                  dayOfSupport: '4',
                  timeOfSupport: {
                    hoursOfSupport: '1',
                    minutesOfSupport: '15'
                  },
                  nameOfSupport: 'Extra support',
                }],
              };

            }
            return {
              '0': {
                monthYear: {
                  'mm': 11,
                  'yyyy': 2020
                },
                claim: [{
                  dayOfSupport: '1',
                  timeOfSupport: {
                    hoursOfSupport: 3,
                    minutesOfSupport: 15
                  },
                  nameOfSupport: 'Name',
                },
                {
                  dayOfSupport: '2',
                  timeOfSupport: {
                    hoursOfSupport: 3,
                    minutesOfSupport: 20
                  },
                  nameOfSupport: 'Name',
                }]
              }
            };
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
      sinon.assert.calledWith(setDataForPageStub.firstCall, '__hidden_support_page__', {
        '0': {
          monthYear: {
            'mm': 11,
            'yyyy': 2020
          },
          claim: [{
            dayOfSupport: '1',
            timeOfSupport: {
              hoursOfSupport: 3,
              minutesOfSupport: 15
            },
            nameOfSupport: 'Name',
          }, {
            dayOfSupport: '2',
            timeOfSupport: {
              hoursOfSupport: 3,
              minutesOfSupport: 20
            },
            nameOfSupport: 'Name',
          }]
        },
        '1': {
          monthYear: {
            'mm': 1,
            'yyyy': 2020
          },
          claim: [{
            dayOfSupport: '4',
            timeOfSupport: {
              hoursOfSupport: 1,
              minutesOfSupport: 15
            },
            nameOfSupport: 'Extra support',
          }]
        }
      });

      sinon.assert.calledWith(setDataForPageStub.secondCall, 'support-claim-summary', undefined);

    });

    it('should roll up data if day of support is listed more than once', () => {
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
            if (page === 'month-claiming-support-worker-costs') {
              return {
                monthIndex: 0,
                dateOfSupport: {
                  'mm': 1,
                  'yyyy': 2020,
                }
              };
            } if (page === 'days-you-had-support') {
              return {
                day: [{
                  dayOfSupport: '4',
                  timeOfSupport: {
                    hoursOfSupport: '4',
                    minutesOfSupport: '20'
                  },
                  nameOfSupport: 'Extra support',
                },
                {
                  dayOfSupport: '4',
                  timeOfSupport: {
                    hoursOfSupport: '5',
                    minutesOfSupport: '20'
                  },
                  nameOfSupport: 'Extra support',
                }],
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
      sinon.assert.calledWith(setDataForPageStub.firstCall, '__hidden_support_page__', {
        '0': {
          monthYear: {
            'mm': 1,
            'yyyy': 2020
          },
          claim: [{
            dayOfSupport: '4',
            timeOfSupport: {
              hoursOfSupport: 9,
              minutesOfSupport: 40
            },
            nameOfSupport: 'Extra support',
          }]
        }
      });

      // sinon.assert.calledWith(setDataForPageStub.secondCall, 'support-claim-summary', undefined);

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
          day: [{
            dayOfSupport: ' 5 ',
            timeOfSupport: {
              hoursOfSupport: ' 1 ',
              minutesOfSupport: ' 3 ',
            },
          }]
        };

        this.result.hooks.pregather(req, res, nextStub);

        expect(req.body.day.map(e=>e.dayOfSupport))
            .to
            .include
            .deep
            .members(['5'])
        expect(req.body.day.map(e=>e.timeOfSupport))
            .to
            .include
            .deep
            .members([{hoursOfSupport: '1', minutesOfSupport: '3'}])
      });
    });
  });
})
;

