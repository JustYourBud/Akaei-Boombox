const { SlashCommandBuilder } = require("@discordjs/builders");
const { errorSend } = require("../templates/embeds.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("View the current queue of songs")
    .addIntegerOption((option) =>
      option
        .setName("page")
        .setDescription("View a specific page within the queue")
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
    let page = interaction.options.getInteger("page");

    if (!queue || !queue.playing) {
      return await errorSend(
        interaction,
        "Nothing to see!",
        "There is currently no music being played."
      );
    }

    if (!page) page = 1;
    const pageStart = 10 * (page - 1);
    const pageEnd = pageStart + 10;
    const track = queue.current;
    const tracks = queue.tracks.slice(pageStart, pageEnd).map((m, i) => {
      return `${i + pageStart + 1}. **${m.title}** ([View](${m.url}))`;
    });

    let queueEmbed = new MessageEmbed()
      .setTitle("Song Queue")
      .setDescription(
        `${tracks.join("\n")}${
          queue.tracks.length > pageEnd
            ? `\n...${queue.tracks.length - pageEnd} more track(s)`
            : ""
        }`
      )
      .setColor("#73a9ff")
      .addField(
        "<:pageright:819655631501656125> Now Playing",
        `**${track.title}** ([View](${track.url}))`
      );

    return await interaction.editReply({
      embeds: [queueEmbed],
      ephemeral: true,
    });
  },
};
