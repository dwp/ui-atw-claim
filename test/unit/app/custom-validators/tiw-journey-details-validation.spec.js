const sinon = require('sinon');
const validators = require('../../../../app/custom-validators/tiw-journey-details-validation');
const Request = require("../../../helpers/fakeRequest");

let assert, expect;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('Validators: TiwJourneyDetailsValidation', () => {
  describe('validate - journey details', () => {

    const req = new Request();
    req.headers.referer = '/claims/page';
    const setDataForPageStub = sinon.stub();

    it('Emptty start postcode, end postcode and totalCost', async () => {
      const queue = [];

      const journeyContext = {
        journeyContext: {
          getDataForPage: (page) => {
            let days = [{"indexDay": 1, "journeyNumber": 1}]
            if (page === 'travel-claim-days') {
              return days;
            } else if (page == 'travel-claim-month') {
                return {
                    monthIndex: 0,
                    dateOfTravel: {mm: 1, yyyy:1111}
                };
            }
            return undefined;
          },
          setDataForPage: setDataForPageStub
        }
      };

      queue.push(expect(validators.make()
        .validate([
            [
              {
                "startPostcode": "",
                "endPostcode": "",
                "totalCost": ""
              }
            ]
          ], journeyContext))
        .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
          assert.equal(v.length, 3);
          const errorKey1 = 'journey-details:errors.startPostcode.required';
          const errorKey2 = 'journey-details:errors.endPostcode.required';
          const errorKey3 = 'journey-details:errors.totalCost.required';

          assert.equal(v[0].inline, errorKey1 + '.inline');
          assert.equal(v[0].summary, errorKey1 + '.summary');
          assert.equal(v[1].inline, errorKey2 + '.inline');
          assert.equal(v[1].summary, errorKey2 + '.summary');
          assert.equal(v[2].inline, errorKey3 + '.inline');
          assert.equal(v[2].summary, errorKey3 + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }));
      return Promise.all(queue);
    });

    it('Special characters and non-numeric values entered', async () => {
        const queue = [];

        const journeyContext = {
          journeyContext: {
            getDataForPage: (page) => {
                let days = [{"indexDay": 1, "journeyNumber": 1}]
                if (page === 'travel-claim-days') {
                    return days;
                } else if (page == 'travel-claim-month') {
                    return {
                        monthIndex: 0,
                        dateOfTravel: {mm: 1, yyyy:1111}
                    };
                }
              return undefined;
            },
            setDataForPage: setDataForPageStub
          }
        };

        queue.push(expect(validators.make()
          .validate([
              [
                {
                  "startPostcode": "AA!BB@",
                  "endPostcode": "!!X$$Y",
                  "totalCost": "abc"
                }
              ]
            ], journeyContext))
          .to
          .be
          .rejected
          .eventually
          .satisfy((v) => {
            assert.equal(v.length, 3);
            const errorKey1 = 'journey-details:errors.startPostcode.invalid';
            const errorKey2 = 'journey-details:errors.endPostcode.invalid';
            const errorKey3 = 'journey-details:errors.totalCost.invalid';

            assert.equal(v[0].inline, errorKey1 + '.inline');
            assert.equal(v[0].summary, errorKey1 + '.summary');
            assert.equal(v[1].inline, errorKey2 + '.inline');
            assert.equal(v[1].summary, errorKey2 + '.summary');
            assert.equal(v[2].inline, errorKey3 + '.inline');
            assert.equal(v[2].summary, errorKey3 + '.summary');
            assert.equal(v[0].variables.indexKey, 1);

            return true;
          }));
        return Promise.all(queue);
      });
  });
});
