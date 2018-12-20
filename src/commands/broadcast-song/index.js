const multiLocationSpecificSong = require("../multi-location-specific-song");
const multiLocationSpotifySong = require("../multi-location-spotify-song");
const multiLocationWildcardSong = require("../multi-location-wildcard-song");

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
   * Specific track search command, to queue song.  Queues the song in ALL locations.
   * eg. @djroomba broadcast Under the Bridge by Red Hot Chili Peppers
   * eg. @djroomba broadcast "Me and Julio down by the schoolyard" by "Paul Simon"
   */
  const broadcastSpecificSong =
    '(dry run )?broadcast "?([^"]+)"? by "?([^"]+?)"?';
  multiLocationSpecificSong(
    listen,
    library,
    locations,
    displaySongChoice,
    broadcastSpecificSong,
    "queue"
  );

  /*
   * Spotify track search command, to queue song.  Queues the song in ALL locations.
   * eg. @djroomba broadcast spotify:track:3d9DChrdc6BOeFsbrZ3Is0
   */
  const broadcastSpotifySong =
    "(dry run )?broadcast ['`\"]?<spotify:track:([^>]+)>['`\"]?";
  multiLocationSpotifySong(
    listen,
    library,
    locations,
    displaySongChoice,
    broadcastSpotifySong,
    "queue"
  );

  /*
   * Wildcard track search command, to queue song in ALL locations.
   * eg. @djroomba broadcast Under the Bridge
   */
  const broadcastWildcardSong = "(dry run )?broadcast (.+?)";
  multiLocationWildcardSong(
    listen,
    library,
    locations,
    displaySongChoice,
    broadcastWildcardSong,
    "queue"
  );
};

module.exports = init;
