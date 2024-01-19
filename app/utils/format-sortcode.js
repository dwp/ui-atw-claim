const { removeAllSpaces } = require('./remove-all-spaces');
const stripHyphens = require('./strip-hyphens');

const formatSortCode = (sortCode) => {
  if (typeof sortCode !== 'string') {
    throw new TypeError(`Expected string got ${typeof sortCode}: ${sortCode}`);
  }
  const withoutSpaces = removeAllSpaces(sortCode);
  return stripHyphens(withoutSpaces);
};
module.exports = formatSortCode;
