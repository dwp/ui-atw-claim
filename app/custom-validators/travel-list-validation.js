/* eslint-disable class-methods-use-this */

const ValidationError = require('@dwp/govuk-casa/lib/validation/ValidationError');
const ValidatorFactory = require('@dwp/govuk-casa/lib/validation/ValidatorFactory');
const { DateTime } = require('luxon');
const logger = require('../logger/logger');
const regex = require('../config/regex-definitions');
const { isDayNumberInteger } = require('./helpers/utils/date-validator-helpers');
const { constructErrorMessage } = require('../helpers/custom-validator-helper')('days-you-travelled-for-work');

const log = logger('custom-validation:travel-list-validation');

/**
 *
 * @param {object} items - Object of items entered.
 * @returns {Promise} Validate other income.
 */
class TravelListValidation extends ValidatorFactory {
  validate(items, dataContext) {
    const monthData = dataContext.journeyContext
      .getDataForPage('month-claiming-travel-for-work').dateOfTravel;

    const showMileageErrors = dataContext.journeyContext
      .getDataForPage('journey-or-mileage')?.journeysOrMileage === 'mileage';

    const errorKey = showMileageErrors ? 'mileage' : 'journeys';

    let valid = true;
    const errorMsgs = [];
    for (const [indexAsAString, day] of Object.entries(items)) {
      const index = parseInt(indexAsAString, 10);

      if (day.dayOfTravel) {
        const enteredData = DateTime.local(
          parseInt(monthData.yyyy, 10),
          parseInt(monthData.mm, 10),
          parseInt(day.dayOfTravel, 10),
        )
          .startOf('day');

        const dayIsNumeric = isDayNumberInteger(day.dayOfTravel);
        if (dayIsNumeric === false) {
          valid = false;
          errorMsgs.push(constructErrorMessage('nonNumeric', index, 'dayOfTravel'));
        } else if ((!enteredData.isValid && regex.NUMBER_REGEX.test(day.dayOfTravel)) || day.dayOfTravel.toString().includes('.')) {
          valid = false;
          errorMsgs.push(constructErrorMessage('invalid', index, 'dayOfTravel'));
        } else if (enteredData > DateTime.now()
          .startOf('day')) {
          valid = false;
          errorMsgs.push(constructErrorMessage('future', index, 'dayOfTravel'));
        }
      } else {
        log.debug('dayOfTravel empty');

        valid = false;
        errorMsgs.push(constructErrorMessage('required', index, 'dayOfTravel'));
      }

      if (day.totalTravel) {
        const regexToUse = showMileageErrors
          ? regex.NUMBER_ONE_DECIMAL_REGEX
          : regex.NUMBER_REGEX;

        if (regexToUse.test(day.totalTravel)) {
          log.debug('is number');
          if (parseInt(day.totalTravel, 10) <= 0) {
            log.debug('Too small');
            valid = false;

            errorMsgs.push(constructErrorMessage(`${errorKey}.tooSmall`, index, 'totalTravel'));
          }
        } else if (showMileageErrors && regex.MORE_THAN_ONE_DECIMAL_REGEX.test(day.totalTravel)) {
          valid = false;
          errorMsgs.push(constructErrorMessage(`${errorKey}.improperDecimalValue`, index, 'totalTravel'));
        } else if (!showMileageErrors && regex.DECIMAL_REGEX.test(day.totalTravel)) {
          valid = false;
          errorMsgs.push(constructErrorMessage(`${errorKey}.improperDecimalValue`, index, 'totalTravel'));
        } else {
          log.debug('letters founds');
          valid = false;
          errorMsgs.push(constructErrorMessage(`${errorKey}.invalid`, index, 'totalTravel'));
        }
      } else {
        log.debug('totalTravel empty');

        valid = false;
        errorMsgs.push(constructErrorMessage(`${errorKey}.required`, index, 'totalTravel'));
      }
    }

    const buildValidationErrorGroup = () => errorMsgs.map((err) => (
      ValidationError.make({
        errorMsg: err,
        dataContext,
      })));

    return valid ? Promise.resolve() : Promise.reject(
      buildValidationErrorGroup(),
    );
  }
}

module.exports = TravelListValidation;
