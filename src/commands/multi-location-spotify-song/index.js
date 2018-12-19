const _ = require("lodash");
const { actOnSpotifySong } = require("../utils");

module.exports = function(
  listen,
  library,
  locations,
  displaySongChoice,
  spotifySong,
  action
) {
  listen(spotifySong, function(bot, message) {
    const isDryRun = !!message.match[1];
    const spotifyTrackId = message.match[2].trim();

    _.forEach(locations, function(location) {
      const locationName = location.name;
      actOnSpotifySong(
        library,
        locations,
        displaySongChoice,
        action,
        isDryRun,
        spotifyTrackId,
        locationName,
        bot,
        message
      );
    });
  });
};
