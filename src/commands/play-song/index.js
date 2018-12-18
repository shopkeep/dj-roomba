const util = require("util");
const _ = require("lodash");
const { outputError } = require("@shopkeep/bot-scripts/utils");
const {
  callWithRetry,
  displaySongChoice,
  noLocationFound
} = require("../utils");
const setupSpecificSong = require("../setup-specific-song");
const setupSpotifySong = require("../setup-spotify-song");
const setupWildcardSong = require("../setup-wildcard-song");

const init = function(listen, library, locations) {
  /*
   * Random track search command, to play song
   * eg. @djroomba I'm feeling lucky, in Belfast
   */
  const randomSong = "(dry run )?.+ feel(?:ing)? lucky(?:, in (.+))?";
  listen(randomSong, function(bot, message) {
    const isDryRun = !!message.match[1];
    const locationName = message.match[2];
    const pending = `:thinking_face: Searching for a random song...`;

    bot.replyAndUpdate(message, pending, async function(replyErr, src, update) {
      const updateMessage = util.promisify(update);

      if (replyErr) {
        outputError(bot, message, replyErr);
        return;
      }

      const location = await locations.getLocation(bot, message, locationName);
      if (
        await noLocationFound(message, updateMessage, location, locationName)
      ) {
        return;
      }

      let song = null;
      try {
        song = await callWithRetry(() => library.random(location));
      } catch (libraryErr) {
        outputError(bot, message, libraryErr);
        return;
      }

      if (_.isNull(song)) {
        await updateMessage(
          `Sorry <@${message.user}>, I wasn't able to find any songs to play!`
        );
        return;
      }

      try {
        if (!isDryRun) {
          await callWithRetry(() => location.player.play(song));
        }
      } catch (playerErr) {
        outputError(bot, message, playerErr);
        return;
      }

      displaySongChoice(
        bot,
        updateMessage,
        message,
        song,
        isDryRun,
        location.name
      );
    });
  });

  /*
   * Specific track search command, to play song
   * eg. @djroomba play Under the Bridge by Red Hot Chili Peppers, in Belfast
   * eg. @djroomba play "Hold on Hope" by "Guided by Voices", in Belfast
   */
  const playSpecificSong =
    '(dry run )?play(?: me)? "?([^"]+)"? by "?([^"]+?)"?(?:, in (.+))?';
  setupSpecificSong(
    listen,
    library,
    locations,
    displaySongChoice,
    playSpecificSong,
    "play"
  );

  /*
   * Spotify track search command, to play song
   * eg. @djroomba play spotify:track:3d9DChrdc6BOeFsbrZ3Is0, in Belfast
   */
  const playSpotifySong =
    "(dry run )?play(?: me)? ['`\"]?<spotify:track:([^>]+)>['`\"]?(?:, in (.+))?";
  setupSpotifySong(
    listen,
    library,
    locations,
    displaySongChoice,
    playSpotifySong,
    "play"
  );

  /*
   * Wildcard track search command, to play song
   * eg. @djroomba play Under the Bridge, in Belfast
   */
  const playWildcardSong =
    "(dry run )?play(?: me)?(?: some)? (.+?)(?:, in (.+))?";
  setupWildcardSong(
    listen,
    library,
    locations,
    displaySongChoice,
    playWildcardSong,
    "play"
  );
};

module.exports = init;
