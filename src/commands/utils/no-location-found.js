const _ = require("lodash");

const noLocationFound = async function(
  message,
  updateMessage,
  location,
  locationName
) {
  if (
    !_.isString(locationName) &&
    message.user.toLowerCase().includes("slackbot")
  ) {
    logger.info("Reminder has been set up with specifying location");
    await updateMessage(":x:  No location specified in reminder");
    return true;
  }

  if (_.isObject(location)) return false;

  logger.debug("No location found for command", { locationName });
  const there = _.isString(locationName)
    ? `in \`${locationName.replace(/\.$/, "")}\``
    : "where you are";
  await updateMessage(
    `Sorry <@${message.user}>, there doesn't seem to be a speaker ${there}!`
  );
  return true;
};

module.exports = noLocationFound;
