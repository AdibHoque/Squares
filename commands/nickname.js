const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

function errorEmbed(text) {
    const embed = new EmbedBuilder().setDescription("<:Cross:1063031834713264128> "+text).setColor("#FF9900")
    return embed;
}

function successEmbed(text) {
    const embed = new EmbedBuilder().setDescription("<:Check:1063031741482291220> "+text).setColor("#FF9900")
    return embed;
}

module.exports.data = new SlashCommandBuilder()
.setName("nickname")
.setDescription("Change nickname of a Member.")
.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
.addUserOption(option => option.setName("member").setDescription("The Member you wanna change Nickname of.").setRequired(true))
.addStringOption(option => option.setName("nickname").setDescription("The new Nickname.").setRequired(true))

module.exports.help = {
    name: "nickname",
    category: "Moderationn",
    description: "Change a members nickname.",
    required: "MANAGE_NICKNAMES",
    usage: "/nickname <member ID or @member> <nickname>"
}

module.exports.run = (client,interaction,options) => {
    let permissions = interaction.member.permissions.toArray();
    if(!permissions.includes("ManageNicknames")) return interaction.editReply({embeds: [new EmbedBuilder().setDescription("<:Cross:1063031834713264128> You need the `ManageNicknames` permission to use this command.").setColor("#FF9900")]})

let member = options.getMember("member")
let nickname = options.getString("nickname")

try {
    member.setNickname(nickname);
    return interaction.editReply({embeds:[successEmbed(`Successfully changed nickname of ${member.user.tag}!`)]})
}
catch {
    return interaction.editReply({embeds:[errorEmbed(`An unknown error occured. Kindly chceck if I have enough permissions to execute this command`)]})
}

}