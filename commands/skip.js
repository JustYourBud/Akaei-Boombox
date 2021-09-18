const { SlashCommandBuilder } = require("@discordjs/builders");
const { errorSend, successSend } = require("../templates/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips to the next song in the queue"),
  async execute(interaction, player) {
    await interaction.deferReply();

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return await errorSend(
        interaction,
        "I can't skip nothing!",
        "You have no music playing right now!"
      );
    }

    const track = queue.current;

    queue.skip();
    return await successSend(
      interaction,
      "Song skipped!",
      `**${track.title}** has been skipped.`
    );
  },
};
