/**
 * Format a given date.
 *
 *   String - 2022-02-14T19:52:44.694.
 *
 * @param  {string} date Date (see supported formats above).
 * @param  {string} locale  Locale from Casa (en or cy).
 * @returns {string} Formatted date.
 */
module.exports = function formatLocalDateTime(date, locale) {
  if (!date) {
    return '';
  }
  let localesForDate = 'en-GB';
  if (locale === 'cy') {
    localesForDate = 'cy-GB';
  }
  return new Date(date).toLocaleDateString(localesForDate, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
