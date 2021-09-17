const { MessageEmbed } = require("discord.js");

const errorSend = async (interaction, errorTitle, errorDesc) => {
  let errorEmbed = new MessageEmbed()
    .setColor("#FF7A90")
    .addField(`<:no:785336733696262154> ${errorTitle}`, `${errorDesc}`);

  return await interaction.reply({
    embeds: [errorEmbed],
    ephemeral: true,
  });
};

exports.errorSend = errorSend;
