const page = require('../../../../../../app/definitions/pages/support-worker/days-you-had-support');
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

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
    it('should create checkboxes for month', () => {
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
            if (page === 'support-month') {
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
        .calledOnceWithExactly('support-days', {
          daysOfSupport: []
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
      req.query.changeMonthYear = '0';

      const setDataForPageStub = sinon.stub();
      const nextStub = sinon.stub();
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__hidden_support_page__') {
              return {
                '0': {
                  monthYear: {
                    mm: '12',
                    yyyy: '2020',
                  },
                  claim: [{
                    'dayOfSupport': 1,
                    'timeOfSupport': {
                      'hoursOfSupport': 4,
                      'minutesOfSupport': 5
                    },
                  }]
                }
              }
            }
            if (page === 'support-month') {
              return {
                monthIndex: "0",
                dateOfSupport: {
                  mm: "12",
                  yyyy: "2020"
                }
              };
            } else if (page === 'support-days') {
              return {
                daysOfSupport: ['1']
              };
            }
            return undefined;
          },
          setDataForPage: setDataForPageStub
        }
      };

      this.result.hooks.prerender(req, res, nextStub);

      expect(res.locals.days).to
          .deep.equal([
            1
          ]
      );

      expect(res.locals.monthYearOfSupport).to
          .deep
          .equal ({
            mm: "12",
            yyyy: "2020"
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
              'support-hours?edit=&editorigin=test-origin');

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
    it('should go to the next page if continue is pressed (support-days populated)', () => {
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
                dateOfSupport: {
                  mm: '12',
                  yyyy: '2020'
                }
              };
            } else if (page === 'support-days') {

              return {
                daysOfSupport: ['1', '4'],
              };

            }
            return undefined;
          },
          setDataForPage: setDataForPageStub
        }
      };

      this.result.hooks.postvalidate(req, res, nextStub);

      expect(setDataForPageStub)
        .to
        .be
        .calledOnceWithExactly('support-days', {
          daysOfSupport: ['1', '4']
        });

    });

  });
})
;

