const {SlashCommandBuilder} = require("discord.js");
const {EmbedBuilder} = require("discord.js");

module.exports.help = {
    name: "roleinfo",
    category: "Utility",
    description: "Get information about a role.",
    required: "None",
    usage: "/roleinfo <role>"
}

module.exports.data = new SlashCommandBuilder()
.setName("roleinfo")
.setDescription("Get info about a role.")
.addRoleOption(option => option.setName("role").setDescription("The roles info you want.").setRequired(true))

module.exports.run = async(client,interaction,options) => {
    let role = options.getRole("role");
  
    let hoisted = role.hoist ? "Yes" : "No"
    let position = role.position ? role.position : "No"
    let mention = role.mentionable ? "Yes" : "No"
    let color = role.hexColor ? role.hexColor : "None"
    
    const embed = new EmbedBuilder()
    .addFields([{name: "ID", value: role.id, inline:true}, {name: "Name", value: role.name, inline:true}, {name: "Color", value: color, inline:true}, {name: "Created At", value:role.createdAt.toLocaleString(), inline:true}, {name: "Hoisted", value: hoisted, inline:true}, {name: "Position", value: `${position}`, inline:true}, {name: "Mention", value: `<@&${role.id}>`, inline:true}, {name: "Mentionable", value: mention, inline:true}])
    .setColor(`#FF9900`)
    interaction.editReply({embeds: [embed]});

}