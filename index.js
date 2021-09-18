const fs = require("fs");
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
// const { token } = require("./config.json");
const { Player } = require("discord-player");
const { errorSend } = require("./templates/embeds.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const player = new Player(client);
player.on("trackStart", (queue, track) => {
  let playEmbed = new MessageEmbed()
    .setThumbnail(track.thumbnail)
    .setColor("#73a9ff")
    .addField(
      `<:pageright:819655631501656125> Now playing`,
      `${track.title}\n[View song](${track.url})`
    )
    .setFooter(`Requested by ${track.requestedBy.username}`);

  queue.metadata.channel.send({
    embeds: [playEmbed],
  });
});

player.on("error", (queue) => {
  let errorEmbed = new MessageEmbed()
    .setColor("#FF7A90")
    .addField(
      `<:no:785336733696262154> Oops!`,
      `Looks like something went wrong! You don't have to worry about it though. You aren't the developer.`
    );

  queue.metadata.channel.send({
    embeds: [errorEmbed],
  });
});

client.once("ready", () => {
  console.log("Time to listen!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, player);
  } catch (error) {
    console.error(error);
    return errorSend(
      interaction,
      "Oops!",
      "Looks like something went wrong while executing that command!"
    );
  }
});

client.login(process.env.AB_TOKEN);
