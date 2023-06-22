function filterGrantsForActiveOnly(grants) {
  const yearAgoDate = new Date();
  yearAgoDate.setFullYear(yearAgoDate.getFullYear() - 1);
  const dateOneYearAgo = yearAgoDate.toJSON()
    .slice(0, 10);

  return grants.filter((grant) => Date.parse(grant.endDate) > Date.parse(dateOneYearAgo));
}

module.exports = filterGrantsForActiveOnly;
