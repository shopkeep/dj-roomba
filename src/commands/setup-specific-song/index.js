const { actOnSpecificSong } = require("../utils");

module.exports = function(
  listen,
  library,
  locations,
  displaySongChoice,
  specificSong,
  action
) {
  listen(specificSong, function(bot, message) {
    const isDryRun = !!message.match[1];
    const track = message.match[2].trim();
    const artist = message.match[3].trim();
    const locationName = message.match[4];

    actOnSpecificSong(
      library,
      locations,
      displaySongChoice,
      action,
      isDryRun,
      track,
      artist,
      locationName,
      bot,
      message
    );
  });
};
