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
    name: "kick",
    category: "Moderationn",
    description: "Kick a member from the server",
    required: "KICK_MEMBERS",
    usage: "/kick <member ID or @member>"
}

module.exports.data = new SlashCommandBuilder()
.setName("kick")
.setDescription("Kick someone from your server.")
.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
.addUserOption(option => option.setName("person").setDescription("The person to kick.").setRequired(true))
.addStringOption(option => option.setName("reason").setDescription("Reason for kicking."))


module.exports.run = (client,interaction,options) => {
    let permissions = interaction.member.permissions.toArray();
    if(!permissions.includes("KickMembers")) return interaction.editReply({embeds: [new EmbedBuilder().setDescription("<:Cross:1063031834713264128> You need the `KickMembers` permission to use this command.").setColor("#FF9900")]})

let member = options.getMember("person")
let reason = options.getString("reason") ? options.get("reason") : "No reason specified."

member.kick(reason).then(() => {
    interaction.editReply({embeds:[successEmbed(`${member.user.username}#${member.user.discriminator} was kicked.\n**Reason:** ${reason}`)]})
}).catch(error => {
     console.log(error);
     interaction.editReply({embeds:[errorEmbed("An unknown error occured! Please check if i have enough permissions to execute this command")]})
})
}