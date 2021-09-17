const { SlashCommandBuilder } = require("@discordjs/builders");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Removes me from the voice channel"),
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    const connection = getVoiceConnection(voiceChannel.guild.id);
    connection.destroy();
    await interaction.reply("I enjoyed listening with you!");
  },
};
