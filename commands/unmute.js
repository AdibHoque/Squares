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
    name: "unmute",
    category: "Moderationn",
    description: "Unmute a previously muted member.",
    required: "MODERATE_MEMBERS",
    usage: "/unmute <member ID or @member>"
}

module.exports.data = new SlashCommandBuilder()
.setName("unmute")
.setDescription("Remove mute of a member.")
.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
.addUserOption(option => option.setName("member").setDescription("The member to unmute.").setRequired(true))
.addStringOption(option => option.setName("reason").setDescription("Reason for the unmute."))


module.exports.run = (client,interaction,options) => {
    let permissions = interaction.member.permissions.toArray();
    if(!permissions.includes("ModerateMembers")) return interaction.editReply({embeds: [new EmbedBuilder().setDescription("<:Cross:1063031834713264128> **You need the `ModerateMembers` permission to use this command.**").setColor("#FF9900")]})

let member = options.getMember("member")
let reason = options.getString("reason") ? options.getString("reason") : `No reason provided.`

member.timeout(null, `${reason} Moderator: ${interaction.user.username}#${interaction.user.discriminator}`).then(() => {
    interaction.editReply({embeds:[successEmbed(`**<@${member.id}> was successfully unmuted.**`)]})
}).catch(error => {
     console.log(error);
     interaction.editReply({embeds:[errorEmbed("**An unknown error occured! Please check if I have the required permissions to execute this command.**")]})
})
}