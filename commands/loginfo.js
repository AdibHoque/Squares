const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const l = require("../models/log")

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  };

function errorEmbed(text) {
    const embed = new EmbedBuilder().setDescription("<:Cross:1063031834713264128> "+text).setColor("#FF9900")
    return embed;
}

function successEmbed(text) {
    const embed = new EmbedBuilder().setDescription("<:Check:1063031741482291220> "+text).setColor("#FF9900")
    return embed;
}

module.exports.help = {
    name: "loginfo",
    category: "Moderation",
    description: "Log information with the attachment evidence, if any.",
    required: "MODERATE_MEMBERS",
    usage: "/loginfo <Log ID>"
}

module.exports.data = new SlashCommandBuilder()
.setName("loginfo")
.setDescription("Log information with the attachment evidence, if any.")
.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
.addStringOption(option => option.setName("log_id").setDescription("The ID of the Log.").setRequired(true))


module.exports.run = (client,interaction,options) => {

let logID = options.getString("log_id")
let guildid = interaction.guildId

if(logID.includes("[")) logID = logID.replace("WARN ", "").replace("MUTE ", "").replace("UNMUTE ", "").replace("KICK ", "").replace("BAN ", "").replace("UNBAN ", "").replace("[", "").replace("]", "")

l.findOne({ GuildID: guildid, "Content.UID": logID}, async (err, data) => {
    if(err) throw err;
    if(!data) {
        return interaction.editReply({embeds:[errorEmbed(`Could not find a valid log with that ID!`)]})
    } else {
        let d = data.Content.find(o => o.UID === logID)
        let fields = [{name: `${d.Type} [${d.UID}]`, value: `**Member:** ${d.UserTag} (${d.UserID})\n**Moderator:** ${d.ModTag} (${d.ModID})\n**Reason:** ${d.Reason}`}]
        const embed = new EmbedBuilder().setColor(`#FF9900`).addFields(fields).setFooter({text: d.Date})
        if(isValidURL(d.Proof)) embed.setImage(d.Proof)
        interaction.editReply({embeds:[embed]})
    } 
})

}