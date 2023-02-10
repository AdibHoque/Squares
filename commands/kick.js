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
    name: "kick",
    category: "Moderation",
    description: "Kick a member from the server",
    required: "KICK_MEMBERS",
    usage: "/kick <member ID or @member>"
}

module.exports.data = new SlashCommandBuilder()
.setName("kick")
.setDescription("Kick someone from your server.")
.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
.addUserOption(option => option.setName("member").setDescription("The member to kick.").setRequired(true))
.addStringOption(option => option.setName("reason").setDescription("Reason for kicking."))
.addAttachmentOption(option => option.setName('proof').setDescription('Attachment for evidence.'))


module.exports.run = async(client,interaction,options) => {

let member = options.getMember("member") ? options.getMember("member") : false;
let reason = options.getString("reason") ? options.getString("reason") : "No reason specified."
let guildid = interaction.guildId
let userid = member.user.id
let usertag = member.user.tag
let modid = interaction.user.id 
let modtag = interaction.user.tag
let date = new Date().toUTCString()
let type = "KICK"
let uid = uuid.generate().toUpperCase()
let proof = options.getAttachment('proof') ? options.getAttachment('proof').url : "";


if(member.kickable) {
    const embed = new EmbedBuilder().setTitle(`You were kicked from ${interaction.guild.name}`).setDescription(reason).setColor("FF9900").setFooter({text: date})
    if(isValidURL(proof)) embed.setImage(proof);
    member.send({embeds: [embed]}).catch((err) => {
    console.log(err)
    interaction.channel.send({embeds:[errorEmbed(`${usertag} has DMs disabled.\nCould not DM them about the Ban.`)]})
})
}

await member.kick({reason: `${reason} Moderator: ${interaction.user.username}#${interaction.user.discriminator}`}).then(() => {
    interaction.editReply({embeds:[successEmbed(`${member.user.username}#${member.user.discriminator} was kicked.\n**Reason:** ${reason}`)]})
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
        g.findOne({GuildID: guildid}, async (err, data) => {
            if(err) throw err;
            if(!data) return;
            if(!data.LogChannel) return;
            const c = interaction.guild.channels.cache.get(data.LogChannel);
            if(!c) return;
        
            c.send({embeds:[logEmbed("MEMBER KICKED", usertag, userid, modtag, modid, reason, uid, proof)]})
        })
    })
}).catch(error => {
     return interaction.editReply({embeds:[errorEmbed("I cannot kick that member!\nPlease check if i have enough permissions to execute this command.")]})
})
}