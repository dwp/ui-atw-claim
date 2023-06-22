/* eslint-disable no-param-reassign */
function mapClaimData(claim, key, cleanedData, mappings) {
  const show = mappings[key]?.showInJson;
  if (show) {
    const { group } = mappings[key];
    const { outputFieldName } = mappings[key];
    if (group !== undefined && claim[group] === undefined) {
      claim[group] = {};
    }
    if (mappings[key].showSingleField) {
      if (group) {
        claim[group][outputFieldName] = cleanedData[mappings[key].showSingleField];
      } else {
        claim[outputFieldName] = cleanedData[mappings[key].showSingleField];
      }
    } else if (group && !mappings[key].addAllPageFieldsToGroup) {
      claim[group][outputFieldName] = cleanedData;
    } else if (group && mappings[key].addAllPageFieldsToGroup) {
      claim[group] = { ...cleanedData, ...claim[group] };
    } else {
      claim[outputFieldName] = cleanedData;
    }
  }
}

module.exports = (claim, key, cleanedData, mappings) => mapClaimData(
  claim,
  key,
  cleanedData,
  mappings,
);
