const {SlashCommandBuilder} = require("discord.js");
const {EmbedBuilder} = require("discord.js");

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  module.exports.help = {
    name: "help",
    category: "Help",
    description: "See the list of bot commands.",
    required: "None",
    usage: "/help [command name]"
}

module.exports.data = new SlashCommandBuilder()
.setName("help")
.setDescription("See the command list of the bot.")
.addStringOption(option => option.setName("command").setDescription("The command you wanna learn anout."))

module.exports.run = (client,interaction,options) => {
    let cmd = options.getString("command") ? options.getString("command") : false;
    
    if(cmd) {
    const command = require(`../commands/${cmd}.js`);
    const c = command.help
    return interaction.editReply({embeds:[new EmbedBuilder().setTitle("Command Help").setDescription(`<:Name:1066716238216187975> **Name:** ${capitalize(c.name)}\n<:Description:1066716273821622303> **Description:** \`${c.description}\`\n<:Commands:1066347425465380924> **Category:** \`${c.category}\`\n<:Permissions:1066716314946773062> **Required Permissions:** \`${c.required}\`\n<:Usage:1066717996325814282> **Usage:** \`${c.usage}\``).setColor("#FF9900").setFooter({text:"Syntax [] = Optional | <> = Required"})]})
    }

    const embed = new EmbedBuilder()
    .setAuthor({name: "ELECTRON"})
    .setTitle(`<:Commands:1066347425465380924> HELP MENU`)
    .setDescription(`To get detailed help on a command, use \`/help [command name]\`!`)
    .setThumbnail("https://cdn.discordapp.com/attachments/678539559570767872/1063130454930239489/20230112_222006.gif")
    .addFields([{name: "General", value:"`ping`, `avatar`, `define`, `color`, `math`, `winratecalc`, `userinfo`, `serverinfo`, `roleinfo`"}, {name: "Moderation", value:"`kick`, `ban`, `nickname`, `role`"}, {name: "Entertainment", value:"`wordchain`, `tictactoe`"}, {name: "Giveaway", value:"`gstart`, `greroll`, `gend`, `gedit`, `gdelete`"}])
    .setColor(`#FF9900`)

    interaction.editReply({embeds: [embed]});
}