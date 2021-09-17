const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config.json");
const { Player } = require("discord-player");
const { errorSend } = require("./templates/error.js");

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
player.on("trackStart", (queue, track) =>
  queue.metadata.channel.send(`🎶💜 | Now playing **${track.title}**!`)
);

client.once("ready", () => {
  console.log("Ready!");
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

client.login(token);
