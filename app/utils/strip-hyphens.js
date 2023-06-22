const hyphens = /-+/g;

const stripHyphens = (string) => string.replace(hyphens, '');

module.exports = stripHyphens;
