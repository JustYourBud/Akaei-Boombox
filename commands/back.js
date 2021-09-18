const { SlashCommandBuilder } = require("@discordjs/builders");
const { errorSend, successSend } = require("../templates/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("back")
    .setDescription("Plays the previous song"),
  async execute(interaction, player) {
    await interaction.deferReply();

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return await errorSend(
        interaction,
        "There's nothing to go back to!",
        "You have no music playing right now!"
      );
    }

    queue.back();
    return await successSend(
      interaction,
      "We've gotta go back!",
      `Here's the previous song that you wanted!`
    );
  },
};
