const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVoiceConnection } = require("@discordjs/voice");
const { successSend } = require("../templates/embeds.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Removes me from the voice channel"),
  async execute(interaction) {
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
