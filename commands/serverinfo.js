const {SlashCommandBuilder} = require("discord.js");
const {EmbedBuilder} = require("discord.js");

module.exports.help = {
    name: "serverinfo",
    category: "General",
    description: "Get information about the server.",
    required: "None",
    usage: "/serverinfo"
}

module.exports.data = new SlashCommandBuilder()
.setName("serverinfo")
.setDescription("Get info about the server.")

module.exports.run = async(client,interaction,options) => {
    const g = interaction.guild;
    let fields = [
    {name: "Owner", value: `<@${g.ownerId}>`, inline:true}, 
    {name: "Channels", value: `${g.channels.cache.size}`, inline:true}, 
    {name: "Roles", value: `${g.roles.cache.size}`, inline:true}, 
    {name: "Emojis", value: `${g.emojis.cache.size}`, inline:true}, 
    {name: "Members", value: `${g.memberCount}`, inline:true},
    {name: "Boosts", value: `${g.premiumSubscriptionCount}`, inline:true}
]
        console.log(g.createdAt.toLocaleString())
    const embed = new EmbedBuilder()
    .setAuthor({name: g.name, iconURL: g.iconURL({ format: 'png', dynamic: true, size: 256 })})
    .setThumbnail(g.iconURL({ format: 'png', dynamic: true, size: 512 }))
    .setColor(`#FF9900`)
    .addFields(fields)
    .setFooter({text: `ID: ${g.id} | Created: ${g.createdAt.toLocaleString()}`})

    interaction.editReply({embeds: [embed]});
    
}

