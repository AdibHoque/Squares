const {SlashCommandBuilder} = require("discord.js");
const {EmbedBuilder} = require("discord.js");

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
    
    const embed = new EmbedBuilder()
    .addFields([{name: "ID", value: role.id}, {name: "Name", value: role.name}, {name: "Color", value: color}, {name: "Created At", value:role.createdAt.toLocaleString()}, {name: "Hoisted", value: hoisted}, {name: "Position", value: position}, {name: "Mention", value: `<@&${role.id}>`}, {name: "Mentionable", value: mention}])
    .setColor(`#ffbf00`)
    interaction.editReply({embeds: [embed]});

}