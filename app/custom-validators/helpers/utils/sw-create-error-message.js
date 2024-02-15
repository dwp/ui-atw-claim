function createErrorMessage(errorMessages, index, dateData, errorKey, focusSuffix) {
  const errorMessage = {
    inline: `${errorKey}.inline`,
    summary: `${errorKey}.summary`,
    variables: {
      indexKey: index + 1,
      dateKey: dateData[index],
    },
    fieldKeySuffix: focusSuffix,
    focusSuffix: [focusSuffix],
  };

  errorMessages.push(errorMessage);
}

module.exports = createErrorMessage;
