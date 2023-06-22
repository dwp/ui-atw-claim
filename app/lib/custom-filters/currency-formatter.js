/*
 * Converts the input to a currency string.
 *
 * @example
 * // foo = 102432.56
 * {{ foo | currency('$') }}
 * // => $102,432.56
 *
 * @param  {Number} input The input to convert.
 * @return {String}
 */
const logger = require('../../logger/logger');

module.exports = function formatCurrency(toFormat) {
  const log = logger('app:custom-filters.currency-formatter');

  const digitsRegex = /(\d{3})(?=\d)/g;

  let value;
  if (typeof toFormat === 'string') {
    value = parseFloat(toFormat);
    if (Number.isNaN(value)) {
      log.error('Invalid input to currency formatter', toFormat);
      value = 0;
    }
  } else if (toFormat == null || !Number.isFinite(toFormat)) {
    log.error('Invalid input to currency formatter', toFormat);
    value = 0;
  } else {
    value = toFormat;
  }

  const sign = '£';
  const input = parseFloat(value);

  const strVal = Math.floor(Math.abs(input))
    .toString();
  const mod = strVal.length % 3;
  const h = mod > 0
    ? (strVal.slice(0, mod) + (strVal.length > 3 ? ',' : ''))
    : '';
  const v = Math.abs(parseInt((input * 100) % 100, 10));
  const float = `.${v < 10 ? (`0${v}`) : v}`;

  return (input < 0 ? '-' : '')
    + sign + h + strVal.slice(mod)
    .replace(digitsRegex, '$1,') + float;
};
