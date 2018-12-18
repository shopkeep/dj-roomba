const _ = require("lodash");

const convertToSongObject = require("./convert-to-song-object");

const createPlayer = function(device, { defaultVolume }) {
  return {
    getPlaying: async function() {
      logger.debug("Checking currently playing");
      const state = await device.getCurrentState();

      logger.debug("Sonos state", { state });
      if (state !== "playing") return null;

      const song = await device.currentTrack();
      logger.debug("Current sonos song", { song });
      return convertToSongObject(song);
    },

    getQueue: async function() {
      logger.debug("Checking queue");
      const state = await device.getCurrentState();

      logger.debug("Sonos state", { state });
      if (state !== "playing") return null;

      const song = await device.currentTrack();
      logger.debug("Current sonos song", { song });

      const queue = await device.getQueue();
      logger.debug("Current sonos queue", { queue });

      const upcoming = queue.items.slice(Math.max(song.queuePosition - 1, 0));
      logger.debug("Upcoming songs", { upcoming });

      if (upcoming.length === 0) return null;

      logger.debug("Upcoming sonos songs", { upcoming });
      return _.map(upcoming, (upcomingSong, index) =>
        convertToSongObject(_.extend({ position: index + 1 }, upcomingSong))
      );
    },

    play: async function(song) {
      logger.debug("Adding song to queue to play", { song, defaultVolume });
      await device.setVolume(defaultVolume);
      await device.queue(`spotify:track:${song.id}`);

      const queue = await device.getQueue();
      const lastIndex = queue.items.length - 1;
      const lastSong = queue.items[lastIndex];

      if (!lastSong) {
        logger.error("Queue is empty but a track was just added to it");
        return new Error("Failed to add song to queue - empty queue");
      }

      if (!lastSong.uri.includes(song.id)) {
        logger.error(
          "The last track in the queue does not match the track that was just added",
          { expectedSong: song, lastSong }
        );
        return new Error("Failed to add song to queue - song mismatch");
      }

      await device.selectTrack(lastIndex + 1); // Indexed from 1
      logger.debug("Playing song on device", {
        queueIndex: lastIndex + 1,
        song
      });
      return device.play();
    },

    queue: async function(song) {
      logger.debug("Adding song to queue", { song });
      await device.queue(`spotify:track:${song.id}`);

      const queue = await device.getQueue();
      const lastIndex = queue.items.length - 1;
      const lastSong = queue.items[lastIndex];

      if (!lastSong) {
        logger.error("Queue is empty but a track was just added to it");
        return new Error("Failed to add song to queue - empty queue");
      }

      if (!lastSong.uri.includes(song.id)) {
        logger.error(
          "The last track in the queue does not match the track that was just added",
          { expectedSong: song, lastSong }
        );
        return new Error("Failed to add song to queue - song mismatch");
      }

      return true;
    },

    pause() {
      logger.debug("Pausing playback");
      return device.pause();
    }
  };
};

module.exports = createPlayer;
