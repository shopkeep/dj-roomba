const util = require("util");
const { outputError } = require("@shopkeep/bot-scripts/utils");
const { callWithRetry, noLocationFound } = require("../utils");

const init = function(listen, library, locations) {
  /*
   * Pause command
   * eg. @djroomba pause, in Belfast
   */
  const pauseSong = "(:?pause|stop|halt|kill|abort|lights up)(?:, in (.+))?";
  listen(pauseSong, function(bot, message) {
    const locationName = message.match[2];
    const pending = ":thinking_face: Pausing music...";

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

      try {
        await callWithRetry(() => location.player.pause());
      } catch (playerErr) {
        outputError(bot, message, playerErr);
        return;
      }

      updateMessage("Music paused :face_with_hand_over_mouth:");
    });
  });
};

module.exports = init;
