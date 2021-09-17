const { SlashCommandBuilder } = require("@discordjs/builders");
const { errorSend } = require("../templates/error.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song of your choosing in a voice channel")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("A search input or a link")
        .setRequired(true)
    ),
  async execute(interaction, player) {
    if (!interaction.member.voice.channelId)
      return errorSend(
        interaction,
        "Can you even hear me?",
        "You need to be in a voice channel to use this command, silly!"
      );
    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    )
      return errorSend(
        interaction,
        "Don't be shy!",
        "Looks like we'll need to be in the same voice channel for this to work."
      );
    const query = interaction.options.get("query").value;
    const queue = player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel,
      },
    });

    // verify vc connection
    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch {
      queue.destroy();
      return errorSend(
        interaction,
        "Let me in!",
        "I'm not able to join the voice channel you're in! Make sure I have the proper permissions."
      );
    }

    await interaction.deferReply();
    const track = await player
      .search(query, {
        requestedBy: interaction.user,
      })
      .then((x) => x.tracks[0]);
    if (!track)
      return await interaction.followUp({
        content: `❌ | Track **${query}** not found!`,
      });

    queue.play(track);

    return await interaction.followUp({
      content: `⏱️ | Loading track **${track.title}**!`,
    });
  },
};
