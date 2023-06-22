const rewire = require('rewire');
const page = rewire('../../../../../../app/definitions/pages/travel-to-work/how-did-you-travel-for-work');
const {
  assert,
  expect
} = require('chai');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const sinon = require('sinon');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

const axiosStub = sinon.stub();
page.__set__('deleteFile', axiosStub);

const responseData = {
  status: 200,
}

describe('definitions/pages/travel-to-work/how-did-you-travel-for-work', () => {
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
          assert.equal(this.result.view, 'pages/travel-to-work/how-did-you-travel-for-work.njk');
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
      describe('postvalidate', () => {
        it('do not clear journey data if same answer given', () => {
          const req = new Request();
          const res = new Response(req);
          const setDataForPageStub = sinon.stub();
          const setValidationErrorsForPageStub = sinon.stub();
          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  howDidYouTravelForWork: 'taxi'
                };
              },
              setDataForPage: setDataForPageStub,
              setValidationErrorsForPage: setValidationErrorsForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, sinon.stub());

          sinon.assert.callCount(setDataForPageStub, 0);
          sinon.assert.callCount(setValidationErrorsForPageStub, 0);

        });
        it('set journey-or-mileage to undefined if on taxi journey', () => {
          const req = new Request();
          const res = new Response(req);
          const setDataForPageStub = sinon.stub();
          const setValidationErrorsForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === 'how-did-you-travel-for-work') {
                  return {
                    howDidYouTravelForWork: 'taxi'
                  };
                }
              },
              setDataForPage: setDataForPageStub,
              setValidationErrorsForPage: setValidationErrorsForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, sinon.stub());

          sinon.assert.callCount(setValidationErrorsForPageStub, 2);
          sinon.assert.calledWith(setValidationErrorsForPageStub.getCall(0), 'month-claiming-travel-for-work');
          sinon.assert.calledWith(setValidationErrorsForPageStub.getCall(1), 'days-you-travelled-for-work');

          sinon.assert.callCount(setDataForPageStub, 7);
          sinon.assert.calledWith(setDataForPageStub.getCall(0), 'month-claiming-travel-for-work', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(1), 'days-you-travelled-for-work', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(2), 'journey-or-mileage', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(3), 'cost-of-taxi-journeys', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(4), 'remove-month-of-travel', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(5), '__hidden_travel_page__', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(6), '__hidden_how_did_you_travel_for_work__', { howDidYouTravelForWork: 'taxi' });

        });

        it('set journey-or-mileage to undefined if on taxi journey and they have evidence to delete in sessions', async () => {
          const req = new Request();
          const res = new Response(req);
          const setDataForPageStub = sinon.stub();
          const setValidationErrorsForPageStub = sinon.stub();
          const sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext').callsFake();

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === 'how-did-you-travel-for-work') {
                  return {
                    howDidYouTravelForWork: 'taxi'
                  };
                }else if (page === '__hidden_uploaded_files__') {
                  return {
                    files: [
                      { fileName: "files1", fileId : '123456789'},
                      { fileName: "files2", fileId : '123456788'},
                      { fileName: "files3", fileId : '123456787'}
                    ]
                  };
                }
              },
              setDataForPage: setDataForPageStub,
              setValidationErrorsForPage: setValidationErrorsForPageStub
            }
          };
          axiosStub.resolves(Promise.resolve(responseData));

          await this.result.hooks.postvalidate(req, res, sinon.stub());

          sinon.assert.callCount(setValidationErrorsForPageStub, 2);
          sinon.assert.calledWith(setValidationErrorsForPageStub.getCall(0), 'month-claiming-travel-for-work');
          sinon.assert.calledWith(setValidationErrorsForPageStub.getCall(1), 'days-you-travelled-for-work');

          sinon.assert.callCount(setDataForPageStub, 8);
          sinon.assert.calledWith(setDataForPageStub.getCall(0), 'month-claiming-travel-for-work', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(1), 'days-you-travelled-for-work', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(2), 'journey-or-mileage', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(3), 'cost-of-taxi-journeys', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(4), 'remove-month-of-travel', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(5), '__hidden_travel_page__', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(6), '__hidden_how_did_you_travel_for_work__', { howDidYouTravelForWork: 'taxi' });
          sinon.assert.calledWith(setDataForPageStub.getCall(7), '__hidden_uploaded_files__', undefined);

          sandbox.restore();
        });

        it('do not set journey-or-mileage to undefined if not on taxi journey', () => {
          const req = new Request();
          const res = new Response(req);
          const setDataForPageStub = sinon.stub();
          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  howDidYouTravelForWork: 'lift'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, sinon.stub());

          sinon.assert.notCalled(setDataForPageStub);

        });
      });
    });
  });
});
