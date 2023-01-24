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
.setName("resetnick")
.setDescription("Reset nickname of a Member.")
.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
.addUserOption(option => option.setName("member").setDescription("The Member you wanna reset Nickname of.").setRequired(true))

module.exports.help = {
    name: "resetnick",
    category: "Moderationn",
    description: "Reset a members nickname.",
    required: "MANAGE_NICKNAMES",
    usage: "/resetnick <member ID or @member>"
}

module.exports.run = (client,interaction,options) => {
    
let member = options.getMember("member")

member.setNickname(null).then(() => {
    interaction.editReply({embeds:[successEmbed(`Successfully resetted nickname of ${member.user.tag}!`)]})
}).catch(error => {
     console.log(error);
     interaction.editReply({embeds:[errorEmbed("An unknown error occured! Please check if i have enough permissions to execute this command")]})
})

}