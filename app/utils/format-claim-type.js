const {
  claimTypesShortName,
} = require('../config/claim-types');

const formatClaimType = (claimType) => {
  if (typeof claimType !== 'string') {
    throw new TypeError(`Expected string got ${typeof claimType}: ${claimType}`);
  }

  if (claimTypesShortName[claimType]) {
    return claimTypesShortName[claimType];
  }
  throw Error(`Invalid Claim got: ${claimType}`);
};
module.exports = formatClaimType;
