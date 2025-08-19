 
const { DateTime } = require('luxon');

/**
 * Format a given date.
 *
 *   Object - { mm:'', yyyy:''}.
 *
 * @param  {object} date Date (see supported formats above).
 * @param  {Function} t translates numeric month value into equivalent locale value.
 * @returns {string} Formatted date.
 */
module.exports = function formatMonthYear(date, t) {
  if (
    Object.prototype.toString.call(date) === '[object Object]'
    && 'yyyy' in date
    && 'mm' in date
  ) {
    const month = DateTime.fromObject({
      year: Math.max(0, parseInt(date.yyyy, 10)),
      month: Math.max(0, parseInt(date.mm, 10)),
    })
      .setLocale('en')
      .toFormat('M');

    const year = DateTime.fromObject({
      year: Math.max(0, parseInt(date.yyyy, 10)),
      month: Math.max(0, parseInt(date.mm, 10)),
    })
      .setLocale('en')
      .toFormat('yyyy');

    return t('common:monthsYear.' + month, year);
  }
  return 'INVALID DATE OBJECT';
};
