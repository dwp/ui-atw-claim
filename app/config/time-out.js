const { PUBLIC_URL } = require('./uri');

const timeOutConfig = {
  totalSessionTimeInSeconds: 3600,
  timeAfterWhichToShowWarningInSeconds: 1800,
  signOutUrl: `${PUBLIC_URL}/time-out`,
};

module.exports = timeOutConfig;
