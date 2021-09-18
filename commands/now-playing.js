const { SlashCommandBuilder } = require("@discordjs/builders");
const { errorSend } = require("../templates/embeds.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("now")
    .setDescription("View what song is currently playing")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playing")
        .setDescription("View what song is currently playing")
    ),
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

    await interaction.deferReply({ ephemeral: true });

    const queue = player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing) {
      return await errorSend(
        interaction,
        "Nothing to see!",
        "There is currently no music being played."
      );
    }

    const track = queue.current;
    const bar = queue.createProgressBar();

    let nowPlayingEmbed = new MessageEmbed()
      .setTitle("Now Playing")
      .setDescription(
        `<:pageright:819655631501656125> ${track.title} ([View](${track.url}))`
      )
      .setThumbnail(track.thumbnail)
      .setColor("#73a9ff")
      .addField("\u200b", bar);

    return await interaction.editReply({
      embeds: [nowPlayingEmbed],
      ephemeral: true,
    });
  },
};
