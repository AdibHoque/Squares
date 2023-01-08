const {SlashCommandBuilder} = require("discord.js");
const {EmbedBuilder} = require("discord.js");

module.exports.data = new SlashCommandBuilder()
.setName("serverinfo")
.setDescription("Get info about the server.")

module.exports.run = async(client,interaction,options) => {
    const g = interaction.guild;
    const owner = await interaction.guild.members.fetch(g.ownerId);

    const embed = new EmbedBuilder()
    .setAuthor({name: g.name, iconURL: g.iconURL({ format: 'png', dynamic: true, size: 256 })})
    .setThumbnail(g.iconURL({ format: 'png', dynamic: true, size: 512 }))
    .setColor(`#ffbf00`)
    .addFields([{name: "Owner", value: owner.user.tag}])

    interaction.editReply({embeds: [embed]});
    //.addFields([{name: "Owner", value: owner.user.tag}, {name: "Channels", value: g.channels.channelCountWithoutThreads}, {name: "Roles", value: g.roles.cache.size}, {name: "Emojis", value: g.emojis.cache.size}, {name: "Members", value: g.memberCount}])

}

