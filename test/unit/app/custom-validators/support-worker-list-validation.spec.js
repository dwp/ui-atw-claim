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

  it('I populate minutes field but not hour field', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '',
            'minutesOfSupport': '30'
          },
          'nameOfSupport': 'Name of Support 1',
        }, {
          'dayOfSupport': '2',
          'timeOfSupport': {
            'hoursOfSupport': '',
            'minutesOfSupport': '45'
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

  it('I enter non-numbers into the date field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': 'test',
          'timeOfSupport': {
            'hoursOfSupport': '1',
            'minutesOfSupport': '30'
          },
          'nameOfSupport': 'Name of Support 1',
        }]
      }.day, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'date-field-validation:dayOfSupportValidation.nonNumeric.dd';

          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);
          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter non-numbers into the hours field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '2',
          'timeOfSupport': {
            'hoursOfSupport': 'test',
            'minutesOfSupport': '30'
          },
          'nameOfSupport': 'Name of Support 1',
        }]
      }.day, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'days-you-had-support:validation.nonNumeric.hoursOfSupport';

          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter non-numbers into the minutes field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '2',
          'timeOfSupport': {
            'hoursOfSupport': '2',
            'minutesOfSupport': 'test'
          },
          'nameOfSupport': 'Name of Support 1',
        }]
      }.day, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'days-you-had-support:validation.nonNumeric.minutesOfSupport';

          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter a numerical value higher than 31 in date field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '32',
          'timeOfSupport': {
            'hoursOfSupport': '1',
            'minutesOfSupport': '30'
          },
          'nameOfSupport': 'Name of Support 1',
        }, {
          'dayOfSupport': '-1',
          'timeOfSupport': {
            'hoursOfSupport': '15',
            'minutesOfSupport': '30'
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
          const errorKey = 'date-field-validation:dayOfSupportValidation.invalid.dd';
          const errorKey2 = 'date-field-validation:dayOfSupportValidation.invalid.date';
          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          assert.equal(v[1].inline, errorKey2 + '.inline');
          assert.equal(v[1].summary, errorKey2 + '.summary');
          assert.equal(v[1].variables.indexKey, 2);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter a numerical value that is not an integer in date field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '1.5',
          'timeOfSupport': {
            'hoursOfSupport': '1',
            'minutesOfSupport': '30'
          },
          'nameOfSupport': 'Name of Support 1',
        }, {
          'dayOfSupport': '-1.5',
          'timeOfSupport': {
            'hoursOfSupport': '2',
            'minutesOfSupport': '20'
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
          const errorKey = 'date-field-validation:dayOfSupportValidation.nonNumeric.dd';
          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          assert.equal(v[1].inline, errorKey + '.inline');
          assert.equal(v[1].summary, errorKey + '.summary');
          assert.equal(v[1].variables.indexKey, 2);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter a numerical value higher than 24 in hour field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '25',
            'minutesOfSupport': '0'
          },
          'nameOfSupport': 'Name of Support 1',
        }]
      }.day, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'days-you-had-support:validation.tooLarge.hoursOfSupport';
          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter a numerical value of 24 in hour, and enter any value larger than 0 in the minutes field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '24',
            'minutesOfSupport': '5'
          },
          'nameOfSupport': 'Name of Support 1',
        }]
      }.day, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'days-you-had-support:validation.tooLarge.hoursOfSupport';
          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter a numerical value higher than 60 in minutes field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '1',
            'minutesOfSupport': '75'
          },
          'nameOfSupport': 'Name of Support 1',
        }]
      }.day, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'days-you-had-support:validation.tooLarge.minutesOfSupport';
          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
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

  it('I leave day of support field blank and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '',
          'timeOfSupport': {
            'hoursOfSupport': '1',
            'minutesOfSupport': '30'
          },
          'nameOfSupport': 'Name of Support 1',
        }, {
          'dayOfSupport': '',
          'timeOfSupport': {
            'hoursOfSupport': '7',
            'minutesOfSupport': '30'
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
          const errorKey = 'date-field-validation:dayOfSupportValidation.required';
          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          assert.equal(v[1].inline, errorKey + '.inline');
          assert.equal(v[1].summary, errorKey + '.summary');
          assert.equal(v[1].variables.indexKey, 2);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave hour field and minutes field blank and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '',
            'minutesOfSupport': ''
          },
          'nameOfSupport': 'Name of Support 1',
        }]
      }.day, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'days-you-had-support:validation.required';
          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter future date of support (not include current date) and click continue ', async () => {
    const journeyContextOverride = {
      journeyContext: {
        getDataForPage: sinon
          .stub()
          .returns({
            dateOfSupport: {
              mm: '11',
              yyyy: '2030'
            }
          }),
      }
    };

    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '1',
            'minutesOfSupport': '30'
          },
          'nameOfSupport': 'Name of Support 1',
        }, {
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '1',
            'minutesOfSupport': '50'
          },
          'nameOfSupport': 'Name of Support 2',
        }]
      }.day, journeyContextOverride))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 2);
          const errorKey = 'date-field-validation:dayOfSupportValidation.invalid.future';
          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          assert.equal(v[1].inline, errorKey + '.inline');
          assert.equal(v[1].summary, errorKey + '.summary');
          assert.equal(v[1].variables.indexKey, 2);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter decimal value for hour field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '2.5',
            'minutesOfSupport': '30'
          },
          'nameOfSupport': 'Name of Support 1',
        }]
      }.day, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'days-you-had-support:validation.improperDecimalValue.hoursOfSupport';

          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter decimal value for minutes field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '6',
            'minutesOfSupport': '30.55'
          },
          'nameOfSupport': 'Name of Support 1',
        }]
      }.day, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'days-you-had-support:validation.improperDecimalValue.minutesOfSupport';

          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter invalid value for hours field and minutes field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        day: [{
          'dayOfSupport': '1',
          'timeOfSupport': {
            'hoursOfSupport': '-6',
            'minutesOfSupport': '75'
          },
          'nameOfSupport': 'Name of Support 1',
        },{
          'dayOfSupport': '2',
          'timeOfSupport': {
            'hoursOfSupport': '25',
            'minutesOfSupport': '0.9'
          },
          'nameOfSupport': 'Name of Support 2',
        },
      ]
      }.day, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 2);
          const errorKey = 'days-you-had-support:validation.invalid';

          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          assert.equal(v[1].inline, errorKey + '.inline');
          assert.equal(v[1].summary, errorKey + '.summary');
          assert.equal(v[1].variables.indexKey, 2);

          return true;
        }
      ));
    return Promise.all(queue);
  });
});



