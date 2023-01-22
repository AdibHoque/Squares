const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

function errorEmbed(text) {
    const embed = new EmbedBuilder().setDescription("<:Cross:1063031834713264128> "+text).setColor("#FF9900")
    return embed;
}

function successEmbed(text) {
    const embed = new EmbedBuilder().setDescription("<:Check:1063031741482291220> "+text).setColor("#FF9900")
    return embed;
}

module.exports.help = {
    name: "unban",
    category: "Moderationn",
    description: "Unban a member.",
    required: "BAN_MEMBERS",
    usage: "/unban <member ID>"
}

module.exports.data = new SlashCommandBuilder()
.setName("unban")
.setDescription("Unban a banned member.")
.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
.addStringOption(option => option.setName("member").setDescription("User ID of the banned Member").setRequired(true))


module.exports.run = (client,interaction,options) => {
    let permissions = interaction.member.permissions.toArray();
    if(!permissions.includes("BanMembers")) return interaction.editReply({embeds: [new EmbedBuilder().setDescription("<:Cross:1063031834713264128> **You need the `ModerateMembers` permission to use this command.**").setColor("#FF9900")]})

let member = options.getString("member")

interaction.guild.members.unban(member).then(() => {
    interaction.editReply({embeds:[successEmbed(`**<@${member}> was successfully unbanned.**`)]})
}).catch(error => {
    console.log(error);
    return interaction.editReply({embeds:[errorEmbed("**Invalid Member ID.**")]})
})


}

// guild.members.unban('84484653687267328')
//   .then(user => console.log(`Unbanned ${user.username} from ${guild.name}`))
//   .catch(console.error);