const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const uuid = require("shortid");
const l = require("../models/log");
const g = require("../models/guild");

function errorEmbed(text) {
  const embed = new EmbedBuilder()
    .setDescription("<:Cross:1063031834713264128> " + text)
    .setColor("#F3BA2F");
  return embed;
}

function successEmbed(text) {
  const embed = new EmbedBuilder()
    .setDescription("<:Check:1063031741482291220> " + text)
    .setColor("#F3BA2F");
  return embed;
}

function logEmbed(title, membertag, memberid, modtag, modid, reason, uid) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor("#F3BA2F")
    .addFields([
      { name: `Member`, value: `${membertag} (${memberid})` },
      { name: `Moderator`, value: `${modtag} (${modid})` },
      { name: `Reason`, value: reason },
      { name: `Duration`, value: `${duration}` },
    ])
    .setTimestamp()
    .setFooter({ text: `LOG ID: ${uid}` });
  return embed;
}

module.exports.help = {
  name: "unmute",
  category: "Moderation",
  description: "Unmute a previously muted member.",
  required: "MODERATE_MEMBERS",
  usage: "/unmute <member ID or @member>",
};

module.exports.data = new SlashCommandBuilder()
  .setName("unmute")
  .setDescription("Remove mute of a member.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((option) =>
    option
      .setName("member")
      .setDescription("The member to unmute.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("reason").setDescription("Reason for the unmute.")
  );

module.exports.run = (client, interaction, options) => {
  let permissions = interaction.member.permissions.toArray();
  if (!permissions.includes("ModerateMembers"))
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            "<:Cross:1063031834713264128> **You need the `ModerateMembers` permission to use this command.**"
          )
          .setColor("#F3BA2F"),
      ],
    });

  let member = options.getMember("member");
  let reason = options.getString("reason")
    ? options.getString("reason")
    : `No reason provided.`;
  let guildid = interaction.guildId;
  let userid = member.user.id;
  let usertag = member.user.tag;
  let modid = interaction.user.id;
  let modtag = interaction.user.tag;
  let date = new Date().toUTCString();
  let type = "UNMUTE";
  let uid = uuid.generate().toUpperCase();

  member
    .timeout(
      null,
      `${reason} Moderator: ${interaction.user.username}#${interaction.user.discriminator}`
    )
    .then(() => {
      interaction.editReply({
        embeds: [successEmbed(`**<@${member.id}> was successfully unmuted.**`)],
      });
      const embed = new EmbedBuilder()
        .setTitle(`You were unmuted in ${interaction.guild.name}`)
        .setDescription(`**Reason:** ` + reason)
        .setColor("F3BA2F")
        .setFooter({ text: date });
      member.send({ embeds: [embed] }).catch((e) => console.log(e));
      l.findOne({ GuildID: guildid, UserID: userid }, async (err, data) => {
        if (err) throw err;
        if (!data) {
          data = new l({
            GuildID: guildid,
            UserID: userid,
            Content: [
              {
                Type: type,
                UID: uid,
                Reason: reason,
                Date: date,
                UserID: userid,
                UserTag: usertag,
                ModID: modid,
                ModTag: modtag,
              },
            ],
          });
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
          };
          data.Content.push(logobj);
        }
        data.save();
        g.findOne({ GuildID: guildid }, async (err, data) => {
          if (err) throw err;
          if (!data) return;
          if (!data.LogChannel) return;
          const c = interaction.guild.channels.cache.get(data.LogChannel);
          if (!c) return;

          c.send({
            embeds: [
              logEmbed(
                "MEMBER UNMUTED",
                usertag,
                userid,
                modtag,
                modid,
                reason,
                uid
              ),
            ],
          });
        });
      });
    })
    .catch((error) => {
      console.log(error);
      interaction.editReply({
        embeds: [
          errorEmbed(
            "**An unknown error occured! Please check if I have the required permissions to execute this command.**"
          ),
        ],
      });
    });
};
