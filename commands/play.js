const { SlashCommandBuilder } = require("@discordjs/builders");
const { errorSend, loadSend } = require("../templates/embeds.js");

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
      return await errorSend(
        interaction,
        "Can you even hear me?",
        "You need to be in a voice channel to use this command, silly!"
      );
    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    )
      return await errorSend(
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
      return await errorSend(
        interaction,
        "Let me in!",
        "I'm not able to join the voice channel you're in! Make sure I have the proper permissions."
      );
    }

    await interaction.deferReply();
    const searchResult = await player.search(query, {
      requestedBy: interaction.user,
    });

    if (!searchResult || !searchResult.tracks.length) {
      return await errorSend(
        interaction,
        "I can't find it!",
        "I'm sorry, but I can't seem to find what you're searching for. Please try using a different query."
      );
    }

    let loadedName;

    if (searchResult.playlist) {
      queue.addTracks(searchResult.tracks);
      loadedName = searchResult.playlist.title;
    } else {
      queue.addTrack(searchResult.tracks[0]);
      loadedName = searchResult.tracks[0].title;
    }

    if (!queue.playing) await queue.play();
    console.log(searchResult.tracks[0].title);
    return await loadSend(interaction, loadedName);
  },
};
