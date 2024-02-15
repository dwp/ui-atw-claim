const validators = require('../../../../app/custom-validators/support-worker-time-validation');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
chai.use(chaiAsPromised);
const {
  expect,
  assert
} = chai;

describe('Validators: SupportWorkerTimeValidation', () => {
  const getDataForPageStub =
    sinon
      .stub()
      .returns({
        dateOfSupport: {
          mm: '11',
          yyyy: '2020'
        },
          daysOfSupport : ['Sunday 5 May']
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
          hours: [{
          'timeOfSupport': {
            'hoursOfSupport': '1',
            'minutesOfSupport': '35'
          },
        }, {
          'timeOfSupport': {
            'hoursOfSupport': '3',
            'minutesOfSupport': '15'
          },
        }]
      }.hours, journeyContext))
      .to.be.fulfilled
    );
    return Promise.all(queue);
  });

  it('I populate hour field but not minutes field', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
          hours: [{
          'timeOfSupport': {
            'hoursOfSupport': '20',
            'minutesOfSupport': ''
          },
        }, {
          'timeOfSupport': {
            'hoursOfSupport': '23',
            'minutesOfSupport': ''
          },
        }]
      }.hours, journeyContext))
      .to.be.fulfilled
    );
    return Promise.all(queue);
  });

  it('I enter non-numbers into the hours field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        hours: [
            {
              'timeOfSupport': {
                  'hoursOfSupport': 'test',
                  'minutesOfSupport': '30'
            },
        }]
      }.hours, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'hours-you-had-support:validation.nonNumeric.hoursOfSupport';

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
        hours: [{
          'timeOfSupport': {
            'hoursOfSupport': '2',
            'minutesOfSupport': 'test'
          },
        }]
      }.hours, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'hours-you-had-support:validation.nonNumeric.minutesOfSupport';

          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter a numerical value higher than 24 in hour field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
          hours: [{
          'timeOfSupport': {
            'hoursOfSupport': '25',
            'minutesOfSupport': '0'
          },
        }]
      }.hours, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'hours-you-had-support:validation.tooLarge.hoursOfSupport';
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
          hours: [{
          'timeOfSupport': {
            'hoursOfSupport': '24',
            'minutesOfSupport': '5'
          },
        }]
      }.hours, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'hours-you-had-support:validation.tooLarge.hoursOfSupport';
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
          hours: [{
          'timeOfSupport': {
            'hoursOfSupport': '1',
            'minutesOfSupport': '75'
          },
        }]
      }.hours, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'hours-you-had-support:validation.tooLarge.minutesOfSupport';
          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave hour field and minutes field blank and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
          hours: [{
          'timeOfSupport': {
            'hoursOfSupport': '',
            'minutesOfSupport': ''
          },
        }]
      }.hours, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'hours-you-had-support:validation.required.hoursOfSupport';
          assert.equal(v[0].inline, errorKey + '.inline');
          assert.equal(v[0].summary, errorKey + '.summary');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter decimal value for hour field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
          hours: [{
          'timeOfSupport': {
            'hoursOfSupport': '2.5',
            'minutesOfSupport': '30'
          },
        }]
      }.hours, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'hours-you-had-support:validation.improperDecimalValue.hoursOfSupport';

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
          hours: [{
          'timeOfSupport': {
            'hoursOfSupport': '6',
            'minutesOfSupport': '30.55'
          },
        }]
      }.hours, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          const errorKey = 'hours-you-had-support:validation.improperDecimalValue.minutesOfSupport';

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
          hours: [{
          'timeOfSupport': {
            'hoursOfSupport': '-6',
            'minutesOfSupport': '75'
          },
        },{
          'timeOfSupport': {
            'hoursOfSupport': '25',
            'minutesOfSupport': '0.9'
          },
        },
      ]
      }.hours, journeyContext))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 2);
          const errorKey = 'hours-you-had-support:validation.invalid';

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



