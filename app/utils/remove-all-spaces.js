const spaces = /\s+/g;
const leadingZero = /^0/gm;

const removeAllSpaces = (string) => string.replace(spaces, '');
const removeLeadingZero = (string) => string.replace(leadingZero, '');


module.exports = {
  removeAllSpaces,
  removeLeadingZero,
}

