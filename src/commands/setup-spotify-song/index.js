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
    const locationName = message.match[3];

    actOnSpotifySong(
      library,
      locations,
      displaySongChoice,
      action,
      isDryRun,
      spotifyTrackId,
      locationName,
      message
    );
  });
};
