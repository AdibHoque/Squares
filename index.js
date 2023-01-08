const { Client, GatewayIntentBits, Partials } = require('discord.js');
const env = require('dotenv');
env.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel] });

require("./slash-register")(updateCommands=true)
let commands = require("./slash-register").commands;


client.on("ready", () => {
    console.log("Bot is online")
    let commands = client.application.commands;
});

client.on("error", e => {
    return console.log(e);
});

client.on('interactionCreate', async interaction => {
    if(interaction.user.bot) return;
    if(interaction.isCommand()) {
    await interaction.deferReply();
    let name = interaction.commandName;
    let options = interaction.options;
    
    let commandMethod = commands.get(name);
    if(!commandMethod) return;

    commandMethod.run(client, interaction, options)
    }
})

client.login(process.env.TOKEN)
