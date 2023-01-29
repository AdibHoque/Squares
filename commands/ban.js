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
    name: "ban",
    category: "Moderationn",
    description: "Ban a member from the server",
    required: "BAN_MEMBERS",
    usage: "/ban <member ID or @member>"
}

module.exports.data = new SlashCommandBuilder()
.setName("ban")
.setDescription("Ban a member from your server.")
.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
.addUserOption(option => option.setName("member").setDescription("The member to ban.").setRequired(true))
.addStringOption(option => option.setName("reason").setDescription("Reason for banning."))
.addAttachmentOption(option => option.setName('proof').setDescription('Attachment for evidence.'))
.addIntegerOption(option => option.setName("duration").setDescription("Duration of the ban").setChoices(
    { name: 'Permanent', value: 0 },
    { name: '1 day', value: 1 },
    { name: '2 days', value: 2 },
    { name: '3 days', value: 3 },
    { name: '4 days', value: 4 },
    { name: '5 days', value: 5 },
    { name: '6 days', value: 6 },
    { name: '7 days', value: 7 },
))


module.exports.run = async(client,interaction,options) => {
    let permissions = interaction.member.permissions.toArray();
    if(!permissions.includes("BanMembers")) return interaction.editReply({embeds: [new EmbedBuilder().setDescription("<:Cross:1063031834713264128> You need the `BanMembers` permission to use this command.").setColor("#FF9900")]})


let member = options.getMember("member") ? options.getMember("member") : false;
let reason = options.getString("reason") ? options.getString("reason") : "No reason specified."
let duration = options.getInteger("duration") ? options.getInteger("duration") : 0;
let guildid = interaction.guildId
if(!member) return interaction.editReply({embeds:[errorEmbed("Invalid Member!")]})
let userid = member.user.id
let usertag = member.user.tag
let modid = interaction.user.id 
let modtag = interaction.user.tag
let date = new Date().toUTCString()
let type = "BAN"
let uid = uuid.generate().toUpperCase()
let proof = options.getAttachment('proof') ? options.getAttachment('proof').url : "";


if(member.bannable) {
    const embed = new EmbedBuilder().setTitle(`You were banned from ${interaction.guild.name}`).setDescription(reason).setColor("FF9900").setFooter({text: date})
    if(isValidURL(proof)) embed.setImage(proof);
    member.send({embeds: [embed]}).catch((err) => {
    console.log(err)
    interaction.channel.send({embeds:[errorEmbed(`${usertag} has DMs disabled.\nCould not DM them about the Ban.`)]})
})
}

await member.ban({days: duration, reason: `${reason} Moderator: ${interaction.user.username}#${interaction.user.discriminator}`}).then(() => {
    interaction.editReply({embeds:[successEmbed(`${member.user.username}#${member.user.discriminator} was banned.\n**Reason:** ${reason}`)]})
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
        
            c.send({embeds:[logEmbed("MEMBER BANNED", usertag, userid, modtag, modid, reason, uid, proof)]})
        })
    })
}).catch(error => {
     return interaction.editReply({embeds:[errorEmbed("I cannot ban that member!\nPlease check if i have enough permissions to execute this command")]})
})
}