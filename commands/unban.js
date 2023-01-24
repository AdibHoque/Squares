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
    name: "unban",
    category: "Moderationn",
    description: "Unban a member.",
    required: "BAN_MEMBERS",
    usage: "/unban <member ID>"
}

module.exports.data = new SlashCommandBuilder()
.setName("unban")
.setDescription("Unban a banned member.")
.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
.addStringOption(option => option.setName("member").setDescription("User ID of the banned Member").setRequired(true))
.addStringOption(option => option.setName("reason").setDescription("Reason for banning."))


module.exports.run = (client,interaction,options) => {
    let permissions = interaction.member.permissions.toArray();
    if(!permissions.includes("BanMembers")) return interaction.editReply({embeds: [new EmbedBuilder().setDescription("<:Cross:1063031834713264128> **You need the `ModerateMembers` permission to use this command.**").setColor("#FF9900")]})

let member = options.getString("member")

let reason = options.getString("reason") ? options.getString("reason") : "No reason specified."
let guildid = interaction.guildId
let modid = interaction.user.id 
let modtag = interaction.user.tag
let date = new Date().toUTCString()
let type = "UNBAN"
let uid = uuid.generate().toUpperCase()

let userid;
let usertag;
client.users.fetch(member).then(u => {
    userid = u.id;
    usertag = u.tag;
}).catch((err) => console.log(err))

interaction.guild.members.unban(member).then(() => {
    interaction.editReply({embeds:[successEmbed(`**<@${member}> was successfully unbanned.**`)]})
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
}).catch(error => {
    console.log(error);
    return interaction.editReply({embeds:[errorEmbed("**Invalid Member ID.**")]})
})
}
