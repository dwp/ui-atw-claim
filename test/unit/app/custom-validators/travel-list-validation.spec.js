const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const validators = require('../../../../app/custom-validators/travel-list-validation');

chai.use(chaiAsPromised);
const {
  expect,
  assert,
} = chai;

describe('Validators: TravelListValidation', () => {
  const getDataForPageStub = sinon.stub().returns({
    dateOfTravel: {
      mm: '11',
      yyyy: '2020',
    },
  });
  const journeyContext = {
    journeyContext: {
      getDataForPage: getDataForPageStub,
    },
  };

  it('I populate only required fields', async () => {
    const queue = [];
    queue.push(expect(validators.make().validate({
      day: [
        {
          dayOfTravel: '1',
          totalTravel: '1',
        }, {
          dayOfTravel: '2',
          totalTravel: '2',
        }],
    }.day, journeyContext)).to.be.fulfilled);
    return Promise.all(queue);
  });

  it('I populate all fields including optional', async () => {
    const queue = [];
    queue.push(expect(validators.make().validate({
      day: [
        {
          dayOfTravel: '1',
          totalTravel: '1',
        }, {
          dayOfTravel: '2',
          totalTravel: '2',
        }],
    }.day, journeyContext)).to.be.fulfilled);
    return Promise.all(queue);
  });

  it(
    'I enter non-numbers into the date field or total travel (journeys) field and click continue',
    async () => {
      const queue = [];
      queue.push(expect(validators.make().validate({
        day: [
          {
            dayOfTravel: 'test',
            totalTravel: 'tester',
          }, {
            dayOfTravel: 'test',
            totalTravel: 'tester',
          }],
      }.day, journeyContext)).to.be.rejected.eventually.satisfy((v) => {
        assert.equal(v.length, 4);
        const errorKey = 'days-you-travelled-for-work:validation.dayOfTravel.nonNumeric';
        const errorKey2 = 'days-you-travelled-for-work:validation.totalTravel.journeys.invalid';
        assert.equal(v[0].inline, `${errorKey}.inline`);
        assert.equal(v[0].summary, `${errorKey}.summary`);
        assert.equal(v[0].variables.indexKey, 1);

        assert.equal(v[1].inline, `${errorKey2}.inline`);
        assert.equal(v[1].summary, `${errorKey2}.summary`);
        assert.equal(v[1].variables.indexKey, 1);

        assert.equal(v[2].inline, `${errorKey}.inline`);
        assert.equal(v[2].summary, `${errorKey}.summary`);
        assert.equal(v[2].variables.indexKey, 2);

        assert.equal(v[3].inline, `${errorKey2}.inline`);
        assert.equal(v[3].summary, `${errorKey2}.summary`);
        assert.equal(v[3].variables.indexKey, 2);

        return true;
      }));
      return Promise.all(queue);
    },
  );

  it(
    'I enter non-numbers into the date field or total travel (miles) field and click continue',
    async () => {
      const queue = [];
      queue.push(expect(validators.make().validate({
        day: [
          {
            dayOfTravel: 'test',
            totalTravel: 'tester',
          }, {
            dayOfTravel: 'test',
            totalTravel: '2.5',
          }],
      }.day, {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === 'journey-or-mileage') {
              return {
                journeysOrMileage: 'mileage',
              };
            }
            return {
              dateOfTravel: {
                mm: '11',
                yyyy: '2020',
              },
            };
          },
        },
      })).to.be.rejected.eventually.satisfy((v) => {
        assert.equal(v.length, 3);
        const errorKey = 'days-you-travelled-for-work:validation.dayOfTravel.nonNumeric';
        const errorKey2 = 'days-you-travelled-for-work:validation.totalTravel.mileage.invalid';
        assert.equal(v[0].inline, `${errorKey}.inline`);
        assert.equal(v[0].summary, `${errorKey}.summary`);
        assert.equal(v[0].variables.indexKey, 1);

        assert.equal(v[1].inline, `${errorKey2}.inline`);
        assert.equal(v[1].summary, `${errorKey2}.summary`);
        assert.equal(v[1].variables.indexKey, 1);

        assert.equal(v[2].inline, `${errorKey}.inline`);
        assert.equal(v[2].summary, `${errorKey}.summary`);
        assert.equal(v[2].variables.indexKey, 2);

        return true;
      }));
      return Promise.all(queue);
    },
  );

  it('I enter a numerical value higher than 31 in date field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make().validate({
      day: [
        {
          dayOfTravel: '-1',
          totalTravel: '1',
        }, {
          dayOfTravel: '32',
          totalTravel: '2',
        }],
    }.day, journeyContext)).to.be.rejected.eventually.satisfy((v) => {
      assert.equal(v.length, 2);
      const errorKey = 'days-you-travelled-for-work:validation.dayOfTravel.nonNumeric';
      const errorKey2 = 'days-you-travelled-for-work:validation.dayOfTravel.invalid';
      assert.equal(v[0].inline, `${errorKey}.inline`);
      assert.equal(v[0].summary, `${errorKey}.summary`);
      assert.equal(v[0].variables.indexKey, 1);

      assert.equal(v[1].inline, `${errorKey2}.inline`);
      assert.equal(v[1].summary, `${errorKey2}.summary`);
      assert.equal(v[1].variables.indexKey, 2);

      return true;
    }));
    return Promise.all(queue);
  });
  
  it('I enter a numerical that is not an integer in date field and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make().validate({
      day: [
        {
          dayOfTravel: '-1.5',
          totalTravel: '1',
        }, {
          dayOfTravel: '1.5',
          totalTravel: '2',
        }],
    }.day, journeyContext)).to.be.rejected.eventually.satisfy((v) => {
      assert.equal(v.length, 2);
      const errorKey = 'days-you-travelled-for-work:validation.dayOfTravel.nonNumeric';
      assert.equal(v[0].inline, `${errorKey}.inline`);
      assert.equal(v[0].summary, `${errorKey}.summary`);
      assert.equal(v[0].variables.indexKey, 1);

      assert.equal(v[1].inline, `${errorKey}.inline`);
      assert.equal(v[1].summary, `${errorKey}.summary`);
      assert.equal(v[1].variables.indexKey, 2);

      return true;
    }));
    return Promise.all(queue);
  });

  it(
    'I only enter 0 in the date field and I only enter 0 in the total travel field and click continue',
    async () => {
      const queue = [];
      queue.push(expect(validators.make().validate({
        day: [
          {
            dayOfTravel: '0',
            totalTravel: '0',
          }, {
            dayOfTravel: '0',
            totalTravel: '0',
          }],
      }.day, journeyContext)).to.be.rejected.eventually.satisfy((v) => {
        assert.equal(v.length, 4);
        const errorKey1 = 'days-you-travelled-for-work:validation.dayOfTravel.invalid';
        const errorKey2 = 'days-you-travelled-for-work:validation.totalTravel.journeys.tooSmall';

        assert.equal(v[0].inline, `${errorKey1}.inline`);
        assert.equal(v[0].summary, `${errorKey1}.summary`);
        assert.equal(v[0].variables.indexKey, 1);

        assert.equal(v[1].inline, `${errorKey2}.inline`);
        assert.equal(v[1].summary, `${errorKey2}.summary`);
        assert.equal(v[1].variables.indexKey, 1);

        assert.equal(v[2].inline, `${errorKey1}.inline`);
        assert.equal(v[2].summary, `${errorKey1}.summary`);
        assert.equal(v[2].variables.indexKey, 2);
        assert.equal(v[3].inline, `${errorKey2}.inline`);
        assert.equal(v[3].summary, `${errorKey2}.summary`);
        assert.equal(v[3].variables.indexKey, 2);

        return true;
      }));
      return Promise.all(queue);
    },
  );

  it('I leave date field blank and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make().validate({
      day: [
        {
          dayOfTravel: '',
          totalTravel: '1',
        }, {
          dayOfTravel: '',
          totalTravel: '2',
        }],
    }.day, journeyContext)).to.be.rejected.eventually.satisfy((v) => {
      assert.equal(v.length, 2);
      const errorKey = 'days-you-travelled-for-work:validation.dayOfTravel.required';
      assert.equal(v[0].inline, `${errorKey}.inline`);
      assert.equal(v[0].summary, `${errorKey}.summary`);
      assert.equal(v[0].variables.indexKey, 1);

      assert.equal(v[1].inline, `${errorKey}.inline`);
      assert.equal(v[1].summary, `${errorKey}.summary`);
      assert.equal(v[1].variables.indexKey, 2);

      return true;
    }));
    return Promise.all(queue);
  });
  it('I leave total travel field blank and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make().validate({
      day: [
        {
          dayOfTravel: '1',
          totalTravel: '',
        }, {
          dayOfTravel: '2',
          totalTravel: '',
        }],
    }.day, journeyContext)).to.be.rejected.eventually.satisfy((v) => {
      assert.equal(v.length, 2);
      const errorKey = 'days-you-travelled-for-work:validation.totalTravel.journeys.required';
      assert.equal(v[0].inline, `${errorKey}.inline`);
      assert.equal(v[0].summary, `${errorKey}.summary`);
      assert.equal(v[0].variables.indexKey, 1);

      assert.equal(v[1].inline, `${errorKey}.inline`);
      assert.equal(v[1].summary, `${errorKey}.summary`);
      assert.equal(v[1].variables.indexKey, 2);

      return true;
    }));
    return Promise.all(queue);
  });

  it('I enter future date of travel (not include current date) and click continue ', async () => {
    const journeyContextOverride = {
      journeyContext: {
        getDataForPage: sinon.stub().returns({
          dateOfTravel: {
            mm: '11',
            yyyy: '2030',
          },
        }),
      },
    };

    const queue = [];
    queue.push(expect(validators.make().validate({
      day: [
        {
          dayOfTravel: '1',
          totalTravel: '1',
        }, {
          dayOfTravel: '1',
          totalTravel: '1',
        }],
    }.day, journeyContextOverride)).to.be.rejected.eventually.satisfy((v) => {
      assert.equal(v.length, 2);
      const errorKey = 'days-you-travelled-for-work:validation.dayOfTravel.future';
      assert.equal(v[0].inline, `${errorKey}.inline`);
      assert.equal(v[0].summary, `${errorKey}.summary`);
      assert.equal(v[0].variables.indexKey, 1);

      assert.equal(v[1].inline, `${errorKey}.inline`);
      assert.equal(v[1].summary, `${errorKey}.summary`);
      assert.equal(v[1].variables.indexKey, 2);

      return true;
    }));
    return Promise.all(queue);
  });

  it(
    'I enter decimal number with more than 1 decimal place in total travel (miles) field and click continue',
    async () => {
      const queue = [];
      queue.push(expect(validators.make().validate({
        day: [
          {
            dayOfTravel: '1',
            totalTravel: '1.234',
          }],
      }.day, {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === 'journey-or-mileage') {
              return {
                journeysOrMileage: 'mileage',
              };
            }
            return {
              dateOfTravel: {
                mm: '11',
                yyyy: '2020',
              },
            };
          },
        },
      })).to.be.rejected.eventually.satisfy((v) => {
        assert.equal(v.length, 1);
        const errorKey = 'days-you-travelled-for-work:validation.totalTravel.mileage.improperDecimalValue';
        assert.equal(v[0].inline, `${errorKey}.inline`);
        assert.equal(v[0].summary, `${errorKey}.summary`);
        assert.equal(v[0].variables.indexKey, 1);

        return true;
      }));
      return Promise.all(queue);
    },
  );

  it(
    'I enter decimal number in total travel (journeys) field and click continue',
    async () => {
      const queue = [];
      queue.push(expect(validators.make().validate({
        day: [
          {
            dayOfTravel: '1',
            totalTravel: '1.5',
          }],
      }.day, {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === 'journey-or-mileage') {
              return {
                journeysOrMileage: 'journeys',
              };
            }
            return {
              dateOfTravel: {
                mm: '11',
                yyyy: '2020',
              },
            };
          },
        },
      })).to.be.rejected.eventually.satisfy((v) => {
        assert.equal(v.length, 1);
        const errorKey = 'days-you-travelled-for-work:validation.totalTravel.journeys.improperDecimalValue';
        assert.equal(v[0].inline, `${errorKey}.inline`);
        assert.equal(v[0].summary, `${errorKey}.summary`);
        assert.equal(v[0].variables.indexKey, 1);

        return true;
      }));
      return Promise.all(queue);
    },
  );
});
