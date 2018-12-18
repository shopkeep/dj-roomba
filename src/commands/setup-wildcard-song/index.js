const util = require("util");
const _ = require("lodash");
const { outputError } = require("@shopkeep/bot-scripts/utils");
const { callWithRetry, noLocationFound } = require("../utils");

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
    const locationName = message.match[3];
    const pending = `:thinking_face: Searching for \`${query}\`...`;

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
        song = await callWithRetry(() => library.blindSearch(location, query));
      } catch (libraryErr) {
        outputError(bot, message, libraryErr);
        return;
      }

      if (_.isNull(song)) {
        await updateMessage(
          `Sorry <@${message.user}>, ` +
            `I wasn't able to find anything matching \`${query}\`. ` +
            "Please try another search, or `I'm feeling lucky` if you can't decide!"
        );
        return;
      }

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
