const { SlashCommandBuilder } = require("@discordjs/builders");
const { errorSend } = require("../templates/embeds.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the current song"),
  async execute(interaction, player) {
    if (!interaction.member.voice.channelId) {
      return await errorSend(
        interaction,
        "Can you even hear me?",
        "You need to be in a voice channel to use this command, silly!"
      );
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    ) {
      return await errorSend(
        interaction,
        "Don't be shy!",
        "Looks like we'll need to be in the same voice channel for this to work."
      );
    }

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
