const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const ms = require("ms");

function errorEmbed(text) {
    const embed = new EmbedBuilder().setDescription("<:Cross:1063031834713264128> "+text).setColor("#FF9900")
    return embed;
}

function successEmbed(text) {
    const embed = new EmbedBuilder().setDescription("<:Check:1063031741482291220> "+text).setColor("#FF9900")
    return embed;
}

module.exports.help = {
    name: "mute",
    category: "Moderationn",
    description: "Mute a member.",
    required: "MODERATE_MEMBERS",
    usage: "/mute <member ID or @member>"
}

module.exports.data = new SlashCommandBuilder()
.setName("mute")
.setDescription("Mute a member.")
.addUserOption(option => option.setName("member").setDescription("The member to mute.").setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
.addStringOption(option => option.setName("time").setDescription("1d = 1 Day, 1h = 1 Hour & 1m = 1 Minute.").setRequired(true))
.addStringOption(option => option.setName("reason").setDescription("Reason for the mute."))


module.exports.run = (client,interaction,options) => {
    let permissions = interaction.member.permissions.toArray();
    if(!permissions.includes("ModerateMembers")) return interaction.editReply({embeds: [new EmbedBuilder().setDescription("<:Cross:1063031834713264128> You need the `ModerateMembers` permission to use this command.").setColor("#FF9900")]})

let member = options.getMember("member")
let time = options.getString("time")
let reason = options.getString("reason") ? options.getString("reason") : `No reason provided.`

let timeInMs;
let text; 
try {
    timeInMs = ms(time);
    text = ms(timeInMs, {long:true})
} catch (e) {
  return interaction.editReply({embeds: [errorEmbed("Invalid Time Provided.")]})
}

member.timeout(timeInMs, `${reason} Moderator: ${interaction.user.username}#${interaction.user.discriminator}`).then(() => {
    interaction.editReply({embeds:[successEmbed(`<@${member.id}> was successfully muted.\n**Duration:** ${text}\n**Reason:** ${reason}`)]})
}).catch(error => {
     console.log(error);
     interaction.editReply({embeds:[errorEmbed("An unknown error occured! Please check if I have the required permissions to execute this command.")]})
})
}