function getAllDates(year,  month) {
  let startDate = new Date(year, month -1, 1);
  let endDate = new Date(year, month, 1);

  let dates = [];
  let months = {month: 'long'};
  let day = {day: 'numeric'};
  while (startDate < endDate) {
    const dayOfWeek = startDate.getDay();

    let m = {
      'day': new Date(startDate).toLocaleDateString('en-GB', day).replace(',', ''),
      'weekday' : dayOfWeek,
      'month' : new Date(startDate).toLocaleDateString('en-GB', months).replace(',', '')
    }
    dates.push(m);


    startDate.setDate(startDate.getDate() +1)
  }

  return dates ;
}

module.exports = getAllDates;
