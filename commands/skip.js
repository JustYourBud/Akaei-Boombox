const { SlashCommandBuilder } = require("@discordjs/builders");
const { errorSend, successSend } = require("../templates/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips to the next song in the queue"),
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
