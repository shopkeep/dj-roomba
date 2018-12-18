const outputSongDetails = ({ artist, name }, isDryRun) => {
  const songDetails = `playing "${name}" by ${artist} :notes:`;
  if (!isDryRun) return songDetails;
  return `if this hadn't been a dry run :beach_with_umbrella: I'd be ${songDetails}`;
};

const displaySongChoice = async function(
  bot,
  updateMessage,
  message,
  song,
  isDryRun,
  locationName = "your location",
  prefixOverride
) {
  const prefix = prefixOverride || `Thanks <@${message.user}>, `;
  await updateMessage(
    `${prefix}${outputSongDetails(
      song,
      isDryRun
    )}, in ${locationName}:round_pushpin:`
  );
  bot.reply(message, song.url);
};

module.exports = displaySongChoice;
