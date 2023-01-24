const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const ms = require("ms");
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
let guildid = interaction.guildId
let userid = member.user.id
let usertag = member.user.tag
let modid = interaction.user.id 
let modtag = interaction.user.tag
let date = new Date().toUTCString()
let type = "MUTE"
let uid = uuid.generate().toUpperCase()

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
    const embed = new EmbedBuilder().setTitle(`You were muted in ${interaction.guild.name}`).setDescription(`**Reason:** `+reason+`\n**Duration:** ${text}`).setColor("FF9900").setFooter({text: date})
    member.send({embeds: [embed]}).catch(() => {
        interaction.channel.send({embeds:[errorEmbed(`${usertag} has DMs disabled.\nCould not DM them about the Mute.`)]})
    })
    l.findOne({ GuildID: guildid, UserID: userid }, async (err, data) => {
        if(err) throw err;
        if(!data) {
            data = new l({
                GuildID: guildid,
                UserID: userid,
                Content: [{
                    Type: type,
                    UID: uid,
                    Reason: reason+`\n**Duration:** ${text}`,
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
                Reason: reason+`\n**Duration:** ${text}`,
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
}).catch(error => {
     console.log(error);
     return interaction.editReply({embeds:[errorEmbed("I cannot Mute this Member!\nPlease check if I have the required permissions to execute this command.")]})
})
}