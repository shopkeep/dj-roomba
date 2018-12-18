const _ = require("lodash");
const library = require("./spotify");
const locations = require("./locations");
const setupCommands = require("./commands");

const customEmojis = {
  "I'm feeling lucky": ":saxophone:",
  "play `song title` by `artist`": ":female-singer:",
  "play `song title or artist`": ":male-singer:",
  "play `spotify:track:spotify-track-uuid`": ":microphone:",
  "queue `song title` by `artist`": ":woman-with-bunny-ears-partying:",
  "queue `song title or artist`": ":man-with-bunny-ears-partying:",
  "queue `spotify:track:spotify-track-uuid`": ":dancers:",
  pause: ":double_vertical_bar:",
  "show playing": ":speaking_head_in_silhouette:",
  "show queue": ":bouquet:"
};

const botname = "djroomba";

module.exports = function(setupBot) {
  logger.debug("Starting up bot");

  const locationsHelper = locations();
  const statusData = {
    locations: _.map(locationsHelper.getLocations(), location =>
      _.omit(location, "device")
    )
  };

  const { bot, listen } = setupBot({ botname, customEmojis, statusData });
  setupCommands({ bot, listen }, library(), locationsHelper);
};
