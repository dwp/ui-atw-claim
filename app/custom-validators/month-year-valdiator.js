/* eslint-disable class-methods-use-this */
/**
 * Month Year object format:
 *  {
 *    mm: <string>,
 *    yyyy: <string>
 *  }.
 *
 * Note that the time part of any injected "DateTime" objects will be zero'ed, as
 * we are only interested in the date component (minimum day resolution).
 *
 * Config options:
 *   string|object errorMsg = Error message to use on validation failure
 *   luxon.DateTime now = Override the notion of "now" (useful for testing).
 */
const { DateTime } = require('luxon');
const ValidationError = require('@dwp/govuk-casa/lib/validation/ValidationError');
const ValidatorFactory = require('@dwp/govuk-casa/lib/validation/ValidatorFactory');
const {
  isObjectType,
  stringifyInput,
} = require('@dwp/govuk-casa/lib/Util');
const regex = require('../config/regex-definitions');
const { claimTypesFullName } = require('../config/claim-types');

class MonthYearObject extends ValidatorFactory {
  validate(value, dataContext = {}) {
    const journeyType = dataContext.journeyContext.getDataForPage('__journey_type__')?.journeyType;

    let baseErrorKey = '';
    if (journeyType === claimTypesFullName.SW) {
      baseErrorKey = 'month-claiming-support-worker-costs';
    } else if (journeyType === claimTypesFullName.TW) {
      baseErrorKey = 'month-claiming-travel-for-work';
    } else if (journeyType === claimTypesFullName.TIW) {
      baseErrorKey = 'travel-claim-month';
    }

    const config = {
      errorMsg: {
        inline: `${baseErrorKey}:validation.invalid`,
        summary: `${baseErrorKey}:validation.invalid`,
      },
      now: DateTime.local(),
      ...this.config,
    };

    let valid = true;
    let { errorMsg } = config;
    let luxonDate;
    const NOW = config.now.startOf('day');

    // Accepted formats
    const formats = ['M-yyyy', 'MM-yyyy'];

    if (typeof value === 'object') {
      if (value.mm) {
        if (regex.NON_NUMERIC.test(value.mm)) {
          valid = false;

          errorMsg = {
            summary: `${baseErrorKey}:validation.nanMonth`,
            inline: `${baseErrorKey}:validation.nanMonth`,
            focusSuffix: ['[mm]'],
          };
        }
      }

      if (value.yyyy) {
        if (regex.NON_NUMERIC.test(value.yyyy)) {
          valid = false;

          errorMsg = {
            summary: `${baseErrorKey}:validation.nanYear`,
            inline: `${baseErrorKey}:validation.nanYear`,
            focusSuffix: ['[yyyy]'],
          };
        }
      }

      if (value.mm && value.yyyy) {
        formats.find((format) => {
          luxonDate = DateTime.fromFormat(
            [value.mm, value.yyyy].join('-'),
            format,
          )
            .startOf('month');

          valid = luxonDate.isValid;

          return valid;
        });

        if (luxonDate) {
          // Check date is before the specified duration from now
          // Need to use UTC() otherwise DST shifts can affect the calculated offset
          const offsetDate = NOW.startOf('month');
          if (luxonDate > offsetDate) {
            valid = false;
            errorMsg = config.errorMsgBeforeOffset;
          }
        }

        // Check presence of each object component (mm, yyyy) in order to log
        // which specific parts are in error
        errorMsg.focusSuffix = [];
        if (!Object.prototype.hasOwnProperty.call(value, 'mm') || !value.mm) {
          errorMsg.focusSuffix.push('[mm]');
        }
        if (!Object.prototype.hasOwnProperty.call(value, 'yyyy') || !value.yyyy) {
          errorMsg.focusSuffix.push('[yyyy]');
        }

        // If the date is invalid, but not specific parts have been highlighted in
        // error, then highlight all inputs, focusing on the [mm] first
        if (!valid && !errorMsg.focusSuffix.length) {
          errorMsg.focusSuffix = [
            '[mm]',
            '[yyyy]',
          ];
        }
        if (regex.NON_NUMERIC.test(value.mm)) {
          errorMsg = {
            summary: `${baseErrorKey}:validation.nonNumericMonth`,
            inline: `${baseErrorKey}:validation.nonNumericMonth`,
            focusSuffix: ['[mm]'],
          };
        }
        if (regex.NON_NUMERIC.test(value.yyyy)) {
          errorMsg = {
            summary: `${baseErrorKey}:validation.nonNumericYear`,
            inline: `${baseErrorKey}:validation.nonNumericYear`,
            focusSuffix: ['[yyyy]'],
          };
        }
      } else {
        valid = false;

        // Either MM or YYY are empty
        if (!value.mm) {
          errorMsg = {
            summary: `${baseErrorKey}:validation.requiredMonth`,
            inline: `${baseErrorKey}:validation.requiredMonth`,
            focusSuffix: ['[mm]'],
          };
        } else if (!value.yyyy) {
          errorMsg = {
            summary: `${baseErrorKey}:validation.requiredYear`,
            inline: `${baseErrorKey}:validation.requiredYear`,
            focusSuffix: ['[yyyy]'],
          };
        }
      }
    }

    return valid ? Promise.resolve() : Promise.reject(ValidationError.make({
      errorMsg,
      dataContext,
    }));
  }

  sanitise(value) {
    if (value !== undefined) {
      return isObjectType(value) ? {
        mm: stringifyInput(value.mm),
        yyyy: stringifyInput(value.yyyy),
      } : Object.create(null);
    }
    return undefined;
  }
}

module.exports = MonthYearObject;
