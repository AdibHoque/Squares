const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const uuid = require("shortid");
const l = require("../models/log")
const g = require("../models/guild")

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

function logEmbed(title, membertag, memberid, modtag, modid, reason, uid, proof){
    const embed = new EmbedBuilder().setTitle(title).setColor("#FF9900").addFields([{name:`Member`, value:`${membertag} (${memberid})`}, {name:`Moderator`, value:`${modtag} (${modid})`}, {name:`Reason`, value:reason}]).setTimestamp().setFooter({text:`LOG ID: ${uid}`})
    if(isValidURL(proof)) embed.setImage(proof);
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
.addUserOption(option => option.setName("member").setDescription("The Member to Warn.").setRequired(true))
.addStringOption(option => option.setName("reason").setDescription("Warn reason.").setRequired(true))
.addAttachmentOption(option => option.setName('proof').setDescription('Attachment for evidence.'))


module.exports.run = (client,interaction,options) => {

let member = options.getMember("member")
let reason = options.getString("reason") 
let guildid = interaction.guildId
let userid = member.user.id
let usertag = member.user.tag
let modid = interaction.user.id 
let modtag = interaction.user.tag
let date = new Date().toUTCString()
let type = "WARN"
let uid = uuid.generate().toUpperCase()
let proof = options.getAttachment('proof') ? options.getAttachment('proof').url : "";

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
                ModTag: modtag,
                Proof: proof
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
            ModTag: modtag,
            Proof: proof
        }
        data.Content.push(logobj)
    }
    data.save()
})
const embed = new EmbedBuilder().setTitle(`You were warned in ${interaction.guild.name}`).setDescription(reason).setColor("FF9900").setFooter({text: date})
if(isValidURL(proof)) embed.setImage(proof);
member.send({embeds: [embed]}).then(() => {
    interaction.editReply({embeds:[successEmbed(`${usertag} was successfully warned!`)]})
}).catch(() => {
    interaction.editReply({embeds:[successEmbed(`${usertag} has DMs disabled. Successfully added warn to logs!`)]})
})

g.findOne({GuildID: guildid}, async (err, data) => {
    if(err) throw err;
    if(!data) return;
    if(!data.LogChannel) return;
    const c = interaction.guild.channels.cache.get(data.LogChannel);
    if(!c) return;

    c.send({embeds:[logEmbed("MEMBER WARNED", usertag, userid, modtag, modid, reason, uid, proof)]})
})

}