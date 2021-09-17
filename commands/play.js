const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song of your choosing in a voice channel")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("A search input or a link")
        .setRequired(true)
    ),
  async execute(interaction) {
    const input = interaction.options.getString("input");

    const voiceChannel = interaction.member.voice.channel;
    // console.log(voiceChannel);

    if (!voiceChannel) {
      return await interaction.reply({
        content: "You aren't in a voice channel, silly!",
        ephemeral: true,
      });
    }

    const permissions = voiceChannel.permissionsFor(interaction.client.user);

    if (!permissions.has("CONNECT")) {
      return await interaction.reply({
        content: "I can't join the voice channel you're in!",
        ephemeral: true,
      });
    }

    if (!permissions.has("SPEAK")) {
      return await interaction.reply({
        content: "I can't speak in the voice channel you're in!",
        ephemeral: true,
      });
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const videoFinder = async (query) => {
      const videoResult = await ytSearch(query);
      return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
    };

    const video = await videoFinder(input);
    if (video) {
      const stream = ytdl(video.url, { filter: "audioonly" });

      const player = createAudioPlayer();
      const resource = createAudioResource(stream);

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        player.stop();
        connection.destroy();
      });

      return await interaction.reply(
        `:blue_heart: Now playing ***${video.title}***`
      );
    } else {
      return await interaction.reply({
        content: "I'm sorry, I couldn't find any results for your search!",
        ephemeral: true,
      });
    }
  },
};
