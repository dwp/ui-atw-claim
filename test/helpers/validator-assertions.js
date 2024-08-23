const { JourneyContext } = require('@dwp/govuk-casa');
const { validationProcessor } = require('@dwp/govuk-casa');
const logger = require('../../app/logger/logger');
const log = logger('test:helpers.validation-assertions');

let expect;
(async() => {
  chai = await import ('chai');
  expect = (await import ('chai')).expect;
})();
/**
 * Expect a validator to fail.
 *
 * @param {Object} fieldValidators List of field-validators to test
 * @param {string} waypointId Waypoint of page being validated
 * @param {string} fieldName Name of field to vextract from page data context
 * @param {string} validatorName Validator expected to have failed in errors
 * @param {mixed} journeyContext Value to pass into processor to trigger validation fail
 * @param {object} errorObj Expected partial error object to be returned
 * @returns {Promise} Pending processor
 */
async function expectValidatorToFailWithJourney(
  fieldValidators,
  waypointId,
  fieldName,
  validatorName,
  journeyContext = new JourneyContext({}),
  errorObj = {},
) {
  try {
    await validationProcessor({
      pageMeta: {
        fieldValidators,
      },
      waypointId,
      journeyContext,
      reduceErrors: true,
    });
    throw new Error('UNEXPECTED_PASS');
  } catch (errors) {
    log.debug(errors);

    const result = (errors[fieldName] || []).filter((r) => (r.validator === validatorName))[0];
    /* eslint-disable-next-line no-unused-expressions */
    expect(result).to.not.be.undefined;
    expect(result)
      .to
      .deep
      .include(errorObj);
  }
}

/**
 * Expect a validator to fail.
 *
 * @param {Object} fieldValidators List of field-validators to test
 * @param {string} fieldName Name of field to vextract from page data context
 * @param {string} validatorName Validator expected to have failed in errors
 * @param {mixed} pageDataContext Value to pass into processor to trigger validation fail
 * @param {object} errorObj Expected partial error object to be returned
 * @returns {Promise} Pending processor
 */
async function expectValidatorToFail(
  fieldValidators,
  fieldName,
  validatorName,
  pageDataContext = {},
  errorObj = {},
) {
  const fakeWaypoint = 'test';
  const journeyContext = new JourneyContext({ [fakeWaypoint]: pageDataContext });
  await expectValidatorToFailWithJourney(
    fieldValidators,
    fakeWaypoint,
    fieldName,
    validatorName,
    journeyContext,
    errorObj,
  );
}

/**
 * Expect a validator to pass.
 *
 * @param {Object} fieldValidators List of field-validators to test
 * @param {string} waypointId Waypoint of page being validated
 * @param {string} fieldName Name of field to vextract from page data context
 * @param {string} validatorName Validator expected to not to be present
 * @param {mixed} journeyContext Value to pass into processor
 * @returns {Promise} Pending processor
 */
async function expectValidatorToPassWithJourney(
  fieldValidators,
  waypointId,
  fieldName,
  validatorName,
  journeyContext = new JourneyContext({}),
) {
  try {
    await validationProcessor({
      pageMeta: {
        fieldValidators,
      },
      waypointId,
      journeyContext,
      reduceErrors: true,
    });
  } catch (errors) {
    const result = (errors[fieldName] || []).filter((r) => (r.validator === validatorName))[0];
    /* eslint-disable-next-line no-unused-expressions */
    expect(result).to.be.undefined;
  }
}

/**
 * Expect a validator to fail.
 *
 * @param {Object} fieldValidators List of field-validators to test
 * @param {string} fieldName Name of field to vextract from page data context
 * @param {string} validatorName Validator expected to have failed in errors
 * @param {mixed} pageDataContext Value to pass into processor to trigger validation fail
 * @returns {Promise} Pending processor
 */
async function expectValidatorToPass(
  fieldValidators,
  fieldName,
  validatorName,
  pageDataContext = {},
) {
  const fakeWaypoint = 'test';
  const journeyContext = new JourneyContext({ [fakeWaypoint]: pageDataContext });
  await expectValidatorToPassWithJourney(
    fieldValidators,
    fakeWaypoint,
    fieldName,
    validatorName,
    journeyContext,
  );
}

module.exports = {
  expectValidatorToFailWithJourney,
  expectValidatorToFail,
  expectValidatorToPassWithJourney,
  expectValidatorToPass,
};
