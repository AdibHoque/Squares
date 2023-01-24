const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const uuid = require("shortid");
const l = require("../models/log")

function errorEmbed(text) {
    const embed = new EmbedBuilder().setDescription("<:Cross:1063031834713264128> "+text).setColor("#FF9900")
    return embed;
}

function successEmbed(text) {
    const embed = new EmbedBuilder().setDescription("<:Check:1063031741482291220> "+text).setColor("#FF9900")
    return embed;
}

module.exports.help = {
    name: "warn",
    category: "Moderationn",
    description: "Warn a member for rules violation.",
    required: "MODERATE_MEMBERS",
    usage: "/warn <member ID or @member> <Reason>"
}

module.exports.data = new SlashCommandBuilder()
.setName("warn")
.setDescription("Warn a member for rules violation.")
.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
.addUserOption(option => option.setName("person").setDescription("The Member to Warn.").setRequired(true))
.addStringOption(option => option.setName("reason").setDescription("Warn reason.").setRequired(true))


module.exports.run = (client,interaction,options) => {

let member = options.getMember("person")
let reason = options.getString("reason") 
let guildid = interaction.guildId
let userid = member.user.id
let usertag = member.user.tag
let modid = interaction.user.id 
let modtag = interaction.user.tag
let date = new Date().toUTCString()
let type = "WARN"
let uid = uuid.generate().toUpperCase()

l.findOne({ GuildID: guildid, UserID: userid }, async (err, data) => {
    if(err) throw err;
    if(!data) {
        data = new l({
            GuildID: guildid,
            UserID: userid,
            Content: [{
                Type: type,
                UID: uid,
                Reason: reason,
                Date: date,
                UserID: userid,
                UserTag: usertag,
                ModID: modid,
                ModTag: modtag
            }]
        })
    } else {
        const logobj = {
            Type: type,
            UID: uid,
            Reason: reason,
            Date: date,
            UserID: userid,
            UserTag: usertag,
            ModID: modid,
            ModTag: modtag
        }
        data.Content.push(logobj)
    }
    data.save()
})
const embed = new EmbedBuilder().setTitle(`You were warned in ${interaction.guild.name}`).setDescription(reason).setColor("FF9900").setFooter({text: date})
member.send({embeds: [embed]}).then(() => {
    interaction.editReply({embeds:[successEmbed(`${usertag} was successfully warned!`)]})
}).catch(() => {
    interaction.editReply({embeds:[successEmbed(`${usertag} has DMs disabled. Successfully added warn to logs!`)]})
})

}