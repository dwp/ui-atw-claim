const validators = require('../../../../app/custom-validators/ttw-day-list-validation');
const sinon = require('sinon');

let assert, expect;
(async() => {
    chai = await import ('chai');
    assert = (await import ('chai')).assert;
    expect = (await import ('chai')).expect;
    chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('Validators: TravelListValidation', () => {
  const getDataForPageStub =
    sinon
      .stub()
      .returns({
        dateOfTravel: {
          mm: '11',
          yyyy: '2020'
        }
      })
  ;

  const journeyContext = {
    journeyContext: {
      getDataForPage: getDataForPageStub,
    }
  };

  it('I populate only required fields', async () => {

    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
            "dateOfTravel": "1"
        },
            {
                "dateOfTravel": ""
            }]
      }.day, journeyContext))
      .to.be.fulfilled
    );
    return Promise.all(queue);
  });

  it('I populate all fields including optional', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
            "dateOfTravel": "1"
        },
            {
                "dateOfTravel": "2"
            }]
      }.day, journeyContext))
      .to.be.fulfilled
    );
    return Promise.all(queue);
  });

  it('I enter decimal value into a field', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
            "dateOfTravel": "1.5"
        }]
      }.day, journeyContext))
      .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
            assert.equal(v.length, 1);
            const errorKey1 = 'days-you-travelled-for-work:validation.totalTravel.taxi.improperDecimalValue';

            assert.equal(v[0].inline, errorKey1 + '.inline');
            assert.equal(v[0].summary, errorKey1 + '.summary');
            assert.equal(v[0].variables.indexKey, 1);

            return true;
        }
    ));
    return Promise.all(queue);
  });



  it('No information put into any fields ' +
    '\n', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: []
      }.day, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey1 = 'days-you-travelled-for-work:validation.totalTravel.taxi.required';

          assert.equal(v[0].inline, errorKey1 + '.inline');
          assert.equal(v[0].summary, errorKey1 + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });
});



