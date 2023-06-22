const getErorrMessageConstructor = (validationFileName) => ({
  constructErrorMessage: (jsonNodeInValidationFile, itemIndex, fieldKey) => Object.assign(
    Object.create(null),
    {
      inline: `${validationFileName}:validation.${fieldKey}.${jsonNodeInValidationFile}.inline`,
      summary: `${validationFileName}:validation.${fieldKey}.${jsonNodeInValidationFile}.summary`,
      variables: {
        indexKey: itemIndex + 1,
      },
      fieldKeySuffix: `[${itemIndex}][${fieldKey}]`,
    },
  ),
});

module.exports = getErorrMessageConstructor;
