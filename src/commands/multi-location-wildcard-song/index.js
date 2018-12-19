const _ = require("lodash");
const { actOnWildcardSong } = require("../utils");

module.exports = function(
  listen,
  library,
  locations,
  displaySongChoice,
  wildcardSong,
  action
) {
  listen(wildcardSong, function(bot, message) {
    const isDryRun = !!message.match[1];
    const query = message.match[2].trim();

    _.forEach(locations, function(location) {
      const locationName = location.name;
      actOnWildcardSong(
        library,
        locations,
        displaySongChoice,
        action,
        isDryRun,
        query,
        locationName,
        bot,
        message
      );
    });
  });
};
