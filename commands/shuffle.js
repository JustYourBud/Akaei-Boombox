const { SlashCommandBuilder } = require("@discordjs/builders");
const { errorSend, successSend } = require("../templates/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffles the songs in the queue"),
  async execute(interaction, player) {
    await interaction.deferReply();

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return await errorSend(
        interaction,
        "There's nothing to shuffle!",
        "You have no music playing right now!"
      );
    }

    queue.shuffle();
    return await successSend(
      interaction,
      "Shuffling!",
      `The queue has been shuffled successfully!`
    );
  },
};
