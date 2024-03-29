const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const uuid = require("shortid");
const l = require("../models/log");

function errorEmbed(text) {
  const embed = new EmbedBuilder()
    .setDescription("<:Cross:1081542318462599168> " + text)
    .setColor("#F3BA2F");
  return embed;
}

function successEmbed(text) {
  const embed = new EmbedBuilder()
    .setDescription("<:Check:1081542275680698499> " + text)
    .setColor("#F3BA2F");
  return embed;
}

function removeObjectWithId(arr, id) {
  const objWithIdIndex = arr.findIndex((obj) => obj.UID == id);

  if (objWithIdIndex > -1) {
    arr.splice(objWithIdIndex, 1);
  }
  return arr;
}

module.exports.help = {
  name: "deletelog",
  category: "Moderationn",
  description: "Delete a single log using the LOG ID.",
  required: "MODERATE_MEMBERS",
  usage: "/deletelog <Log ID>",
};

module.exports.data = new SlashCommandBuilder()
  .setName("deletelog")
  .setDescription("Delete a single log using the LOG ID")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addStringOption((option) =>
    option
      .setName("log_id")
      .setDescription("The ID of the Log.")
      .setRequired(true)
  );

module.exports.run = (client, interaction, options) => {
  let logID = options.getString("log_id");
  let guildid = interaction.guildId;

  if (logID.includes("["))
    logID = logID
      .replace("WARN ", "")
      .replace("MUTE ", "")
      .replace("UNMUTE ", "")
      .replace("KICK ", "")
      .replace("BAN ", "")
      .replace("UNBAN ", "")
      .replace("[", "")
      .replace("]", "");

  l.findOne({ GuildID: guildid, "Content.UID": logID }, async (err, data) => {
    if (err) throw err;
    if (!data) {
      return interaction.editReply({
        embeds: [errorEmbed(`Could not find a valid log with that ID!`)],
      });
    } else {
      const newContent = removeObjectWithId(data.Content, logID);
      data.Content = newContent;
      data.save();
      interaction.editReply({
        embeds: [successEmbed(`${logID} was successfully deleted!`)],
      });
    }
  });
};
