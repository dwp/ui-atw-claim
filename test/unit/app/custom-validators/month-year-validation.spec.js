const { DateTime } = require('luxon');
const sinon = require('sinon');
const validators = require('../../../../app/custom-validators/month-year-valdiator');
const { claimTypesFullName } = require('../../../../app/config/claim-types');

let assert, expect;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('Validators: monthYearValidation', () => {
  describe('validate - support worker', () => {
    const getDataForPageStub = sinon
      .stub()
      .returns({
        journeyType: claimTypesFullName.SW,
      });

    const journeyContext = {
      journeyContext: {
        getDataForPage: getDataForPageStub,
      },
    };

    it('I populate the description field blank and date and click continue', async () => {
      const queue = [];
      queue.push(expect(validators.make()
        .validate({
          mm: '11',
          yyyy: '2020',
        }, journeyContext))
        .to.be.fulfilled);
      return Promise.all(queue);
    });

    it('leave month empty but populate year', async () => {
      const queue = [];
      queue.push(expect(validators.make()
        .validate({
          mm: '',
          yyyy: '20202',
        }, journeyContext))
        .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
          assert.equal(v.inline, 'month-claiming-support-worker-costs:validation.requiredMonth');
          assert.equal(v.summary, 'month-claiming-support-worker-costs:validation.requiredMonth');
          assert.equal(v.focusSuffix.length, 1);
          assert.equal(v.focusSuffix[0], '[mm]');

          return true;
        }));
      return Promise.all(queue);
    });
    it('leave year empty but populate month', async () => {
      const queue = [];
      queue.push(expect(validators.make()
        .validate({
          mm: '12',
          yyyy: '',
        }, journeyContext))
        .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
          assert.equal(v.inline, 'month-claiming-support-worker-costs:validation.requiredYear');
          assert.equal(v.summary, 'month-claiming-support-worker-costs:validation.requiredYear');
          assert.equal(v.focusSuffix.length, 1);
          assert.equal(v.focusSuffix[0], '[yyyy]');

          return true;
        }));
      return Promise.all(queue);
    });

    // This scenario should not happen as the required check that is chained will alert for both empty
    it('leave all fields empty', async () => {
      const queue = [];
      queue.push(expect(validators.make()
        .validate({
          mm: '',
          yyyy: '',
        }, journeyContext))
        .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
          assert.equal(v.inline, 'month-claiming-support-worker-costs:validation.requiredMonth');
          assert.equal(v.summary, 'month-claiming-support-worker-costs:validation.requiredMonth');
          assert.equal(v.focusSuffix.length, 1);
          assert.equal(v.focusSuffix[0], '[mm]');
          return true;
        }));
      return Promise.all(queue);
    });

    it('invalid format data', async () => {
      const queue = [];
      queue.push(expect(validators.make()
        .validate({
          mm: 'cat',
          yyyy: 'dog',
        }, journeyContext))
        .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
          assert.equal(v.inline, 'month-claiming-support-worker-costs:validation.nonNumericYear');
          assert.equal(v.summary, 'month-claiming-support-worker-costs:validation.nonNumericYear');
          assert.equal(v.focusSuffix.length, 1);
          assert.equal(v.focusSuffix[0], '[yyyy]');
          return true;
        }));
      return Promise.all(queue);
    });

    it('month in the future', async () => {
      const queue = [];
      queue.push(expect(validators.make({
        errorMsgBeforeOffset: {
          summary: 'month-claiming-support-worker-costs:validation.future',
          inline: 'month-claiming-support-worker-costs:validation.future',
          focusSuffix: '[mm]',
        },
        now: DateTime.utc(
          2021,
          10,
          1,
        ),
      })
        .validate({
          mm: '11',
          yyyy: '2021',
        }, journeyContext))
        .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
          assert.equal(v.inline, 'month-claiming-support-worker-costs:validation.future');
          assert.equal(v.summary, 'month-claiming-support-worker-costs:validation.future');
          assert.equal(v.focusSuffix.length, 2);
          assert.equal(v.focusSuffix[0], '[mm]');
          assert.equal(v.focusSuffix[1], '[yyyy]');
          return true;
        }));
      return Promise.all(queue);
    });

    it('current month is acceptable as day of month not known yet', async () => {
      const queue = [];
      queue.push(expect(validators.make({
        errorMsgBeforeOffset: {
          summary: 'month-claiming-support-worker-costs:validation.future',
          inline: 'month-claiming-support-worker-costs:validation.future',
          focusSuffix: '[mm]',
        },
        now: DateTime.utc(
          2021,
          10,
          1,
        ),
      })
        .validate({
          mm: '10',
          yyyy: '2021',
        }, journeyContext))
        .to.be.fulfilled);
      return Promise.all(queue);
    });
  });

  describe('validate - travel to work', () => {
    const getDataForPageStub = sinon
      .stub()
      .returns({
        journeyType: claimTypesFullName.TW,
      });

    const journeyContext = {
      journeyContext: {
        getDataForPage: getDataForPageStub,
      },
    };

    it('I populate the description field blank and date and click continue', async () => {
      const queue = [];
      queue.push(expect(validators.make()
        .validate({
          mm: '11',
          yyyy: '2020',
        }, journeyContext))
        .to.be.fulfilled);
      return Promise.all(queue);
    });

    it('leave month empty but populate year', async () => {
      const queue = [];
      queue.push(expect(validators.make()
        .validate({
          mm: '',
          yyyy: '20202',
        }, journeyContext))
        .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
          assert.equal(v.inline, 'month-claiming-travel-for-work:validation.requiredMonth');
          assert.equal(v.summary, 'month-claiming-travel-for-work:validation.requiredMonth');
          assert.equal(v.focusSuffix.length, 1);
          assert.equal(v.focusSuffix[0], '[mm]');

          return true;
        }));
      return Promise.all(queue);
    });
    it('leave year empty but populate month', async () => {
      const queue = [];
      queue.push(expect(validators.make()
        .validate({
          mm: '12',
          yyyy: '',
        }, journeyContext))
        .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
          assert.equal(v.inline, 'month-claiming-travel-for-work:validation.requiredYear');
          assert.equal(v.summary, 'month-claiming-travel-for-work:validation.requiredYear');
          assert.equal(v.focusSuffix.length, 1);
          assert.equal(v.focusSuffix[0], '[yyyy]');

          return true;
        }));
      return Promise.all(queue);
    });

    // This scenario should not happen as the required check that is chained will alert for both empty
    it('leave all fields empty', async () => {
      const queue = [];
      queue.push(expect(validators.make()
        .validate({
          mm: '',
          yyyy: '',
        }, journeyContext))
        .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
          assert.equal(v.inline, 'month-claiming-travel-for-work:validation.requiredMonth');
          assert.equal(v.summary, 'month-claiming-travel-for-work:validation.requiredMonth');
          assert.equal(v.focusSuffix.length, 1);
          assert.equal(v.focusSuffix[0], '[mm]');
          return true;
        }));
      return Promise.all(queue);
    });

    it('non-numeric year data', async () => {
      const queue = [];
      queue.push(expect(validators.make()
        .validate({
          mm: 'cat',
          yyyy: 'dog',
        }, journeyContext))
        .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
          assert.equal(v.inline, 'month-claiming-travel-for-work:validation.nonNumericYear');
          assert.equal(v.summary, 'month-claiming-travel-for-work:validation.nonNumericYear');
          assert.equal(v.focusSuffix.length, 1);
          assert.equal(v.focusSuffix[0], '[yyyy]');
          return true;
        }));
      return Promise.all(queue);
    });

    it('month in the future', async () => {
      const queue = [];
      queue.push(expect(validators.make({
        errorMsgBeforeOffset: {
          summary: 'month-claiming-travel-for-work:validation.future',
          inline: 'month-claiming-travel-for-work:validation.future',
          focusSuffix: '[mm]',
        },
        now: DateTime.utc(
          2021,
          10,
          1,
        ),
      })
        .validate({
          mm: '11',
          yyyy: '2021',
        }, journeyContext))
        .to
        .be
        .rejected
        .eventually
        .satisfy((v) => {
          assert.equal(v.inline, 'month-claiming-travel-for-work:validation.future');
          assert.equal(v.summary, 'month-claiming-travel-for-work:validation.future');
          assert.equal(v.focusSuffix.length, 2);
          assert.equal(v.focusSuffix[0], '[mm]');
          assert.equal(v.focusSuffix[1], '[yyyy]');
          return true;
        }));
      return Promise.all(queue);
    });

    it('current month is acceptable as day of month not known yet', async () => {
      const queue = [];
      queue.push(expect(validators.make({
        errorMsgBeforeOffset: {
          summary: 'month-claiming-travel-for-work:validation.future',
          inline: 'month-claiming-travel-for-work:validation.future',
          focusSuffix: '[mm]',
        },
        now: DateTime.utc(
          2021,
          10,
          1,
        ),
      })
        .validate({
          mm: '10',
          yyyy: '2021',
        }, journeyContext))
        .to.be.fulfilled);
      return Promise.all(queue);
    });
  });

  describe('sanitise', () => {
    it('return object when sanitising completes', () => {
      assert.deepEqual(validators.make()
        .sanitise({
          mm: '11',
          yyyy: '2020',
        }), {
        mm: '11',
        yyyy: '2020',
      });
    });

    it('return empty object as not object', () => {
      assert.deepEqual(validators.make()
        .sanitise('STRING'), {});
    });

    it('return undefined when object is undefined', () => {
      assert.deepEqual(validators.make()
        .sanitise(undefined), undefined);
    });
  });
});
