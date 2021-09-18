const { MessageEmbed } = require("discord.js");

// Error embed
const errorSend = async (interaction, errorTitle, errorDesc) => {
  let errorEmbed = new MessageEmbed()
    .setColor("#FF7A90")
    .addField(`<:no:785336733696262154> ${errorTitle}`, `${errorDesc}`);

  try {
    return await interaction.reply({
      embeds: [errorEmbed],
      ephemeral: true,
    });
  } catch {
    return await interaction.editReply({
      embeds: [errorEmbed],
      ephemeral: true,
    });
  }
};

// Success embed
const successSend = async (interaction, successTitle, successDesc) => {
  let successEmbed = new MessageEmbed()
    .setColor("#80DBB5")
    .addField(`<:yes:785336714566172714>  ${successTitle}`, `${successDesc}`);

  try {
    return await interaction.reply({
      embeds: [successEmbed],
    });
  } catch {
    return await interaction.editReply({
      embeds: [successEmbed],
    });
  }
};

// Load embed
const loadSend = async (interaction, loadedName) => {
  let loadEmbed = new MessageEmbed()
    .setColor("#73a9ff")
    .addField(
      `<:menu:844073816962891826> Added to queue!`,
      `**${loadedName}** has been added to the queue.`
    );

  try {
    return await interaction.reply({
      embeds: [loadEmbed],
    });
  } catch {
    return await interaction.editReply({
      embeds: [loadEmbed],
    });
  }
};

exports.errorSend = errorSend;
exports.successSend = successSend;
exports.loadSend = loadSend;
