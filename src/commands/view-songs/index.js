const util = require("util");
const moment = require("moment");
const _ = require("lodash");
const ColorHash = require("color-hash");
const { outputError } = require("@shopkeep/bot-scripts/utils");
const {
  callWithRetry,
  noLocationFound,
  displaySongChoice
} = require("../utils");

const colorHash = new ColorHash();

const getDuration = function(songDuration) {
  if (!songDuration) return "";

  const duration = moment.duration(songDuration);
  const minutes = duration.minutes();
  const seconds = `0${duration.seconds()}`.slice(-2);
  return `Duration - ${minutes}:${seconds}`;
};

const getQueueAttachment = async function(songs, library, location) {
  const topSongs = _.take(songs, 10);
  const ids = _.filter(_.map(topSongs, "id"), id => !id.startsWith("unknown-"));
  const songData = await library.getSongs(location, ids);
  const songDataMapping = _.reduce(
    songData,
    (mapping, songDatum) => _.extend({ [songDatum.id]: songDatum }, mapping),
    {}
  );

  const attachments = _.map(topSongs, function({
    id,
    name,
    artist,
    url,
    position,
    album
  }) {
    const mapping = songDataMapping[id];
    const hasMapping = _.isObject(mapping);

    return {
      fallback: `"${name}" by ${artist}`,
      color: colorHash.hex(artist),
      title: `${position}. "${name}" by ${artist}`,
      title_link: url,
      text: `From "${album.name}"`,
      footer: hasMapping ? getDuration(mapping.duration) : "",
      thumb_url: hasMapping
        ? mapping.album.image.url
        : "https://user-images.githubusercontent.com/635903/43608473-1545142c-9699-11e8-9aa5-f20b9d029c7a.png"
    };
  });

  const count = attachments.length;
  if (count > 0) {
    attachments[0].pretext = `Next ${count} song${
      count > 1 ? "s" : ""
    } (out of ${songs.length} total), in ${location.name}:round_pushpin:`;
    attachments[0].footer = "Currently playing";
  }

  return { attachments };
};

const init = function(listen, library, locations) {
  /*
   * Show currently playing song
   * eg. @djroomba show playing, in Belfast
   */
  const currentlyPlaying = "show playing(?:, in (.+))?";
  listen(currentlyPlaying, function(bot, message) {
    const locationName = message.match[1];
    const pending = `:thinking_face: Checking...`;

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
        song = await callWithRetry(() => location.player.getPlaying());
      } catch (playerErr) {
        outputError(bot, message, playerErr);
        return;
      }

      if (_.isNull(song)) {
        await updateMessage(
          `:mute: Nothing currently playing, in ${location.name}:round_pushpin:`
        );
        return;
      }

      displaySongChoice(
        bot,
        updateMessage,
        message,
        song,
        false,
        location.name,
        "Currently "
      );
    });
  });

  /*
   * Show upcoming songs
   * eg. @djroomba show queue, in Belfast
   */
  const upcomingSongs = "show queue(?:, in (.+))?";
  listen(upcomingSongs, function(bot, message) {
    const locationName = message.match[1];
    const pending = `:thinking_face: Checking...`;

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

      let queue = null;
      try {
        queue = await callWithRetry(() => location.player.getQueue());
      } catch (playerErr) {
        outputError(bot, message, playerErr);
        return;
      }

      if (_.isNull(queue)) {
        await updateMessage(
          `:mute: Nothing currently queued, in ${location.name}:round_pushpin:`
        );
        return;
      }

      const attachment = await getQueueAttachment(queue, library, location);
      await updateMessage(attachment);
    });
  });
};

module.exports = init;
