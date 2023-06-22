const removeAllSpaces = require('./remove-all-spaces');

const formatPostcode = (postcode) => {
  if (typeof postcode !== 'string') {
    throw new TypeError(`Expected string got ${typeof postcode}: ${postcode}`);
  }

  const withoutSpaces = removeAllSpaces(postcode);
  return `${withoutSpaces.slice(0, -3)} ${withoutSpaces.slice(-3)}`.toUpperCase();
};

module.exports = formatPostcode;
