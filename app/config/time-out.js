const { PUBLIC_URL } = require('./uri');
const config = require("./config-mapping");

const timeOutConfig = {
  totalSessionTimeInSeconds: config.TIMEOUT_PERIOD,
  timeAfterWhichToShowWarningInSeconds: config.TIMEOUT_PERIOD / 2,
  signOutUrl: `${PUBLIC_URL}/time-out`,
};

module.exports = timeOutConfig;
