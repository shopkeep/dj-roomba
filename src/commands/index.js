const initPlaySongCommands = require("./play-song");
const initQueueSongCommands = require("./queue-song");
const initPauseSongCommands = require("./pause-song");
const initViewSongsCommands = require("./view-songs");

const init = function({ listen }, library, locations) {
  logger.debug("Setting up commands");

  initPlaySongCommands(listen, library, locations);
  initQueueSongCommands(listen, library, locations);
  initPauseSongCommands(listen, library, locations);
  initViewSongsCommands(listen, library, locations);
};

module.exports = init;
