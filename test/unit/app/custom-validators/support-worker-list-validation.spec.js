const validators = require('../../../../app/custom-validators/support-worker-list-validation');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
chai.use(chaiAsPromised);
const {
  expect,
  assert
} = chai;

describe('Validators: SupportWorkerListValidation', () => {
  const getDataForPageStub =
    sinon
      .stub()
      .returns({
        dateOfSupport: {
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
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '1',
            'minutesOfSupport': '25'
          }
        }, {
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '1',
            'minutesOfSupport': '30'
          }
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
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '1',
            'minutesOfSupport': '35'
          },
          'nameOfSupport': 'Name of Support 1',
        }, {
          'dayOfSupport': '2',
          'timeOfSupport': {
            'hoursOfSupport': '3',
            'minutesOfSupport': '15'
          },
          'nameOfSupport': 'Name of Support 2',
        }]
      }.day, journeyContext))
      .to.be.fulfilled
    );
    return Promise.all(queue);
  });

  it('I populate hour field but not minutes field', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '20',
            'minutesOfSupport': ''
          },
          'nameOfSupport': 'Name of Support 1',
        }, {
          'dayOfSupport': '2',
          'timeOfSupport': {
            'hoursOfSupport': '23',
            'minutesOfSupport': ''
          },
          'nameOfSupport': 'Name of Support 2',
        }]
      }.day, journeyContext))
      .to.be.fulfilled
    );
    return Promise.all(queue);
  });

  it('I only enter 0 in the date field and click continue' +
    '\n', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '0',
          'timeOfSupport': {
            'hoursOfSupport': '0',
            'minutesOfSupport': '30'
          },
          'nameOfSupport': 'Name of Support 1',
        }, {
          'dayOfSupport': '0',
          'timeOfSupport': {
            'hoursOfSupport': '5',
            'minutesOfSupport': '0'
          },
          'nameOfSupport': 'Name of Support 2',
        }]
      }.day, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 2);
          const errorKey1 = 'date-field-validation:dayOfSupportValidation.invalid.date';

          assert.equal(v[0].inline, errorKey1 + '.inline');
          assert.equal(v[0].summary, errorKey1 + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          assert.equal(v[1].inline, errorKey1 + '.inline');
          assert.equal(v[1].summary, errorKey1 + '.summary');
          assert.equal(v[1].variables.indexKey, 2);

          return true;
        }
      ));
    return Promise.all(queue);
  });
});



