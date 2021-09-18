const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVoiceConnection } = require("@discordjs/voice");
const { errorSend, successSend } = require("../templates/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Removes me from the voice channel"),
  async execute(interaction) {
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

    if (!interaction.guild.me.voice.channelId) {
      return await errorSend(
        interaction,
        "How rude!",
        "I can't leave the VC if I haven't even joined it!"
      );
    }

    const voiceChannel = interaction.member.voice.channel;
    const connection = getVoiceConnection(voiceChannel.guild.id);
    connection.destroy();

    goodbyeMsgs = [
      "I had fun listening with you!",
      "Hope to do this again sometime soon!",
      "I hope you enjoyed that as much as I did!",
      "Have a nice day! Hopefully this made it even better!",
      "I'll see you again soon!",
    ];

    let ranMsg = goodbyeMsgs[Math.floor(Math.random() * goodbyeMsgs.length)];

    return await successSend(interaction, "Goodbye!", ranMsg);
  },
};
