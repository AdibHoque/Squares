const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const l = require("../models/log");

module.exports.help = {
  name: "logs",
  category: "Moderation",
  description: "See Moderation logs of a member.",
  required: "MODERATE_MEMBERS",
  usage: "/logs <@member or member ID> [Filter]",
};

module.exports.data = new SlashCommandBuilder()
  .setName("logs")
  .setDescription("See Moderation logs of a member.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((option) =>
    option
      .setName("member")
      .setDescription("The members logs you want to see.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("filter")
      .setDescription("Filter out certain logs.")
      .setChoices(
        { name: "WARN", value: "WARN" },
        { name: "MUTE", value: "MUTE" },
        { name: "UNMUTE", value: "UNMUTE" },
        { name: "KICK", value: "KICK" },
        { name: "BAN", value: "BAN" },
        { name: "UNBAN", value: "UNBAN" }
      )
  );

module.exports.run = async (client, interaction, options) => {
  let person = options.getUser("member");
  let filter = options.getString("filter")
    ? options.getString("filter")
    : false;
  //const member = await interaction.guild.members.fetch(person.id);
  const userid = person.id;
  const guildid = interaction.guildId;

  if (filter) {
    l.findOne({ GuildID: guildid, UserID: userid }, async (err, data) => {
      if (err) throw err;
      if (data) {
        let fields = [];
        data.Content.forEach((d) => {
          if (d.Type == filter)
            fields.push({
              name: `${d.Type} [${d.UID}]`,
              value: `**Moderator:** ${d.ModTag} (${d.ModID})\n**Reason:** ${d.Reason}\n**Date:** ${d.Date}`,
            });
        });
        if (!fields.length == 0) {
          const embed = new EmbedBuilder()
            .setColor(`#F3BA2F`)
            .setDescription(`**Filtered Logs:** ${filter}`)
            .addFields(fields)
            .setTimestamp()
            .setAuthor({ name: person.tag, iconURL: person.avatarURL() });
          return interaction.editReply({ embeds: [embed] });
        }
        if (fields.length == 0) {
          const embed = new EmbedBuilder()
            .setColor(`#F3BA2F`)
            .setDescription(`No \`${filter}\` logs found for this member.`);
          return interaction.editReply({ embeds: [embed] });
        }
      } else {
        const embed = new EmbedBuilder()
          .setColor(`#F3BA2F`)
          .setDescription("No logs found for this member.");
        interaction.editReply({ embeds: [embed] });
      }
    });
    return;
  }

  l.findOne({ GuildID: guildid, UserID: userid }, async (err, data) => {
    if (err) throw err;
    if (data) {
      let fields = [];
      data.Content.forEach((d) => {
        fields.push({
          name: `${d.Type} [${d.UID}]`,
          value: `**Moderator:** ${d.ModTag} (${d.ModID})\n**Reason:** ${d.Reason}\n**Date:** ${d.Date}`,
        });
      });
      const embed = new EmbedBuilder()
        .setColor(`#F3BA2F`)
        .setTimestamp()
        .setAuthor({ name: person.tag, iconURL: person.avatarURL() });
      if (fields.length == 0) {
        const embed = new EmbedBuilder()
          .setColor(`#F3BA2F`)
          .setDescription("No logs found for this member.");
        return interaction.editReply({ embeds: [embed] });
      }
      if (fields.length > 25) {
        fields.splice(25, fields.length - 25);
        embed.setDescription(
          "This member has over 25 logs, kindly delete older logs using `/deletelog` to see newer logs as maximum logs this coammnd will show is 25."
        );
      }
      embed.addFields(fields);
      interaction.editReply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setColor(`#F3BA2F`)
        .setDescription("No logs found for this member.");
      interaction.editReply({ embeds: [embed] });
    }
  });
};
