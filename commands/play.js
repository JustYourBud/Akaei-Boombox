const { SlashCommandBuilder } = require("@discordjs/builders");
const { Player } = require("discord-player");

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
  async execute(interaction, client) {
    const player = new Player(client);
    player.on("trackStart", (queue, track) =>
      queue.metadata.channel.send(`🎶💜 | Now playing **${track.title}**!`)
    );

    if (!interaction.member.voice.channelId)
      return await interaction.reply({
        content: "You are not in a voice channel, silly!",
        ephemeral: true,
      });
    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    )
      return await interaction.reply({
        content: "We need to be in the same voice channel!",
        ephemeral: true,
      });
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
      return await interaction.reply({
        content: "I can't seem to be able to join that voice channel!",
        ephemeral: true,
      });
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
