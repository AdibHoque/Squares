const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports.data = new SlashCommandBuilder()
.setName("roleinfo")
.setDescription("Get info about a role.")
.addRoleOption(option => option.setName("role").setDescription("The roles info you want.").setRequired(true))

module.exports.run = async(client,interaction,options) => {
    let role = options.getRole("role");
  
    let hoisted = role.hoist ? "Yes" : "No"
    let position = role.rawPosition ? "Yes" : "No"
    let mention = role.mentionable ? "Yes" : "No"
    let color = role.hexColor ? role.hexColor : "None"

    console.log(role.createdAt)
    
    const embed = new MessageEmbed()
    .addField("ID",role.id,true)
    .addField("Name",role.name,true)
    .addField("Color", color, true)
    .addField("Created At", role.createdAt.toLocaleString(), true)
    .addField("Hoisted",hoisted ,true)
    .addField("Position",position ,true)
    .addField("Mention",`<@&${role.id}>`,true)
    .addField("Mentionable",mention ,true)
    .setColor(`#ffbf00`)

    interaction.editReply({embeds: [embed]});

}