const page = require('../../../../../../app/definitions/pages/equipment-or-adaptation/equipment-or-adaptation-summary');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const sinon = require('sinon');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const validators = require('../../../../../../app/definitions/field-validators/equipment-or-adaptation/equipment-or-adaptation-summary');
const {
  expectValidatorToFailWithJourney, 
  expectValidatorToPassWithJourney
} = require('../../../../../helpers/validator-assertions');


let assert, expect;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('definitions/pages/equipment-or-adaptation/equipment-or-adaptation-summary', () => {
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
          assert.equal(this.result.view, 'pages/equipment-or-adaptation/equipment-or-adaptation-summary.njk');
        });
      });
      describe('`fieldValidators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('fieldValidators');
        });

        it('trigger required error when continue clicked', async () => {
          await expectValidatorToFailWithJourney(
            validators,
            'specialist-equipment-summary',
            'addAnother',
            'Required',
            new JourneyContext({
              ['specialist-equipment-summary']: {
                addAnother: ''
              },
              ['remove-specialist-equipment']: {
                otherField: '1'
              },
            }), {
              summary: 'equipment-or-adaptation-summary:required',
              inline: 'equipment-or-adaptation-summary:required'
            }
          )
        });

        it('does not trigger required error when remove clicked', async () => {
          const req = new Request();
          await expectValidatorToPassWithJourney(
            validators,
            'specialist-equipment-summary',
            'addAnother',
            'Required',
            req.query = {
              removeId: '0',
            }
          );
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

          const req = new Request();
          const res = new Response(req);
          const setDataForPageStub = sinon.stub()
          const getDataForPageStub = sinon.stub()
            .returns({
              '0': [{
                'description': 'Item 1',
                'dateOfPurchase': {
                  'dd': '22',
                  'mm': '11',
                  'yyyy': '2020'
                }
              }],
              '1': [{
                'description': 'Item 2',
                'dateOfPurchase': {
                  'dd': '11',
                  'mm': '22',
                  'yyyy': '2023'
                }
              }]
            });
          req.casa = {
            journeyContext: {
              getDataForPage: getDataForPageStub,
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.allData)
            .to
            .deep
            .equal({
              '0': [{
                'description': 'Item 1',
                'dateOfPurchase': {
                  'dd': '22',
                  'mm': '11',
                  'yyyy': '2020'
                }
              }],
              '1': [{
                'description': 'Item 2',
                'dateOfPurchase': {
                  'dd': '11',
                  'mm': '22',
                  'yyyy': '2023'
                }
              }]
            });
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

        it('no changes made if add another was no', () => {
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

          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  addAnother: 'no'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('remove-specialist-equipment',
              { removeId: false });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('loops to your-equipment-or-adaptation if add another was yes', () => {
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
          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === '__hidden_specialist_equipment_page__') {
                  return {
                    '0': [{
                      'description': 'Item 1',
                      'dateOfPurchase': {
                        'dd': '22',
                        'mm': '11',
                        'yyyy': '2020'
                      }
                    }]
                  };
                }
                if (page === 'your-equipment-or-adaptation') {
                  return {
                    some: 'data'
                  }
                }
                return {
                  addAnother: 'yes'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };
          this
            .result.hooks.postvalidate(req, res, nextStub);

          sinon
            .assert.calledWith(setDataForPageStub.firstCall, 'remove-specialist-equipment', {
            removeId: false,
          });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

      })
    });
  });
});
