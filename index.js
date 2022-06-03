const Discord = require('discord.js');
const env = require('dotenv');
env.config()

const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILDS]});

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
    else if (interaction.isButton()) console.log(interaction.id);
    //     let button_id = interaction.customId;
    //     let [command, user_id, action, id] = button_id.split("-");
    //     let guild = interaction.guild;
    //     let member = guild.members.cache.get(id);

    //     if(member.id !== user_id) return;

    //     let buttonCallback = commands.get(command);
    //     if(!buttonCallback) return;
    //     buttonCallback.button(client, interaction, member, action)
    // }
})

client.login(process.env.TOKEN)
