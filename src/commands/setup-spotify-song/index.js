const util = require("util");
const _ = require("lodash");
const { outputError } = require("@shopkeep/bot-scripts/utils");
const { callWithRetry, noLocationFound } = require("../utils");

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
    const pending = `:thinking_face: Searching for Spotify track \`${spotifyTrackId}\`...`;

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

      let songs = null;
      try {
        songs = await callWithRetry(() =>
          library.getSongs(location, [spotifyTrackId])
        );
      } catch (libraryErr) {
        outputError(bot, message, libraryErr);
        return;
      }

      if (!_.isArray(songs) || songs.length === 0) {
        await updateMessage(
          `Sorry <@${message.user}>, ` +
            `I wasn't able to find a Spotify track matching \`${spotifyTrackId}\`. ` +
            "Please try another search, or `I'm feeling lucky` if you can't decide!"
        );
        return;
      }

      const song = _.first(songs);

      try {
        if (!isDryRun) {
          await callWithRetry(() => location.player[action](song));
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
};
