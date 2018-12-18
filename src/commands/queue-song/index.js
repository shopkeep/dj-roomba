const setupSpecificSong = require("../setup-specific-song");
const setupSpotifySong = require("../setup-spotify-song");
const setupWildcardSong = require("../setup-wildcard-song");

const displaySongChoice = async function(
  bot,
  updateMessage,
  message,
  { artist, name },
  isDryRun,
  locationName
) {
  const dryRunPrefix = isDryRun
    ? "if this hadn't been a dry run :beach_with_umbrella: I'd have "
    : "";

  await updateMessage(
    `Thanks <@${message.user}>, ` +
      dryRunPrefix +
      `queued "${name}" by ${artist} :man-with-bunny-ears-partying:,` +
      ` in ${locationName}:round_pushpin:`
  );
};

const init = function(listen, library, locations) {
  /*
   * Specific track search command, to queue song
   * eg. @djroomba queue Under the Bridge by Red Hot Chili Peppers, in Belfast
   * eg. @djroomba queue "Hold on Hope" by "Guided by Voices", in Belfast
   */
  const queueSpecificSong =
    '(dry run )?queue "?([^"]+)"? by "?([^"]+?)"?(?:, in (.+))?';
  setupSpecificSong(
    listen,
    library,
    locations,
    displaySongChoice,
    queueSpecificSong,
    "queue"
  );

  /*
   * Spotify track search command, to queue song
   * eg. @djroomba queue spotify:track:3d9DChrdc6BOeFsbrZ3Is0, in Belfast
   */
  const queueSpotifySong =
    "(dry run )?queue ['`\"]?<spotify:track:([^>]+)>['`\"]?(?:, in (.+))?";
  setupSpotifySong(
    listen,
    library,
    locations,
    displaySongChoice,
    queueSpotifySong,
    "queue"
  );

  /*
   * Wildcard track search command, to queue song
   * eg. @djroomba queue Under the Bridge, in Belfast
   */
  const queueWildcardSong = "(dry run )?queue (.+?)(?:, in (.+))?";
  setupWildcardSong(
    listen,
    library,
    locations,
    displaySongChoice,
    queueWildcardSong,
    "queue"
  );
};

module.exports = init;
