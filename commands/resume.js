const { SlashCommandBuilder } = require("@discordjs/builders");
const { errorSend } = require("../templates/embeds.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the current song"),
  async execute(interaction, player) {
    await interaction.deferReply();

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return await errorSend(
        interaction,
        "I can't resume nothing!",
        "You have no music playing right now!"
      );
    }

    const track = queue.current;

    queue.setPaused(false);
    let playEmbed = new MessageEmbed()
      .setThumbnail(track.thumbnail)
      .setColor("#73a9ff")
      .addField(
        `<:pageright:819655631501656125> Song resumed!`,
        `**${track.title}** has resumed playing.`
      );

    return await interaction.editReply({
      embeds: [playEmbed],
    });
  },
};
