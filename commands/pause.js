const { SlashCommandBuilder } = require("@discordjs/builders");
const { errorSend, successSend } = require("../templates/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song"),
  async execute(interaction, player) {
    await interaction.deferReply();

    const queue = player.getQueue(interaction.guild.id);
    if (!queue || !queue.playing) {
      return await errorSend(
        interaction,
        "I can't pause nothing!",
        "You have no music playing right now!"
      );
    }

    queue.setPaused(true);
    return await successSend(
      interaction,
      "Song paused!",
      `**${queue.current.title}** has been paused.`
    );
  },
};
