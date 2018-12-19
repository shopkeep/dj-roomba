const initPlaySongCommands = require("./play-song");
const initQueueSongCommands = require("./queue-song");
const initPauseSongCommands = require("./pause-song");
const initViewSongsCommands = require("./view-songs");
const initDeployChoonCommands = require("./deploy-choon");

const init = function({ listen }, library, locations) {
  logger.debug("Setting up commands");

  initPlaySongCommands(listen, library, locations);
  initQueueSongCommands(listen, library, locations);
  initPauseSongCommands(listen, library, locations);
  initViewSongsCommands(listen, library, locations);
  initDeployChoonCommands(listen, library, locations);
};

module.exports = init;
