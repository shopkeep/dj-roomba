const _ = require("lodash");
const moment = require("moment-timezone");
const { getUser } = require("@shopkeep/bot-scripts/utils");
const { sanitiseInput } = require("../utils");
const { getLocations, createPlayer } = require("./utils");

const findLocationByName = function(locations, inputName) {
  return (
    _.find(
      locations,
      ({ name }) => sanitiseInput(name) === sanitiseInput(inputName)
    ) || null
  );
};

const findLocationByTimezone = function(locations, userTimezone) {
  return (
    _.find(locations, function({ timezone }) {
      return moment
        .tz("2010-06-15", userTimezone)
        .isSame(moment.tz("2010-06-15", timezone), "hour");
    }) || null
  );
};

const findLocationFor = function(locations, user, locationName) {
  if (_.isString(locationName)) {
    logger.debug("Matching location on provided name", locationName);
    return findLocationByName(locations, locationName);
  }

  logger.debug("Matching location on users timezone", user.tz);
  return findLocationByTimezone(locations, user.tz);
};

const init = function() {
  logger.debug("Setting up locations");

  const locations = getLocations();
  logger.debug("Provided locations", locations);

  return {
    getLocations: () => locations,
    getLocation: async function(bot, message, locationName) {
      const user = await getUser(bot, message.user);
      const location = findLocationFor(locations, user, locationName);
      logger.debug("Location matched", location);

      if (!_.isObject(location)) return null;

      const { name, spotifyMarket, device, defaultVolume } = location;
      return {
        name,
        spotifyMarket,
        player: createPlayer(device, { defaultVolume })
      };
    }
  };
};

module.exports = init;
