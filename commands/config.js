const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const g = require("../models/guild");

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

module.exports.help = {
  name: "config",
  category: "Moderation",
  description: "Assign or change channels for certain tasks.",
  required: "MANAGE_CHANNELS",
  usage: "/config <option> <value>",
};

module.exports.data = new SlashCommandBuilder()
  .setName("config")
  .setDescription("Assign or change channels for certain tasks.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  .addStringOption((option) =>
    option
      .setName("option")
      .setDescription("Set or assign new value.")
      .setChoices(
        { name: "Moderation Logs Channel", value: "logchannel" },
        { name: "Message Logs Channel", value: "msglogchannel" }
      )
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel you wanna assign.")
      .setRequired(true)
  )
  .addBooleanOption((option) =>
    option
      .setName("reset")
      .setDescription("Do you wanna reset the value and set to none?")
  );

module.exports.run = (client, interaction, options) => {
  let option = options.getString("option");
  let guildid = interaction.guildId;
  let channel = options.getChannel("channel");
  let reset = options.getBoolean("reset");

  g.findOne({ GuildID: guildid }, async (err, data) => {
    if (err) throw err;
    if (option == "logchannel") {
      if (data && reset) {
        data.LogChannel = null;
        data.save();
        return interaction.editReply({
          embeds: [successEmbed(`Moderation Log channel was set to none.`)],
        });
      }
      if (!data && reset) {
        return interaction.editReply({
          embeds: [
            successEmbed(`There are no Moderation Log Channel to reset.`),
          ],
        });
      }

      if (!data) {
        data = new g({
          GuildID: guildid,
          LogChannel: channel.id,
        });
        data.save();
      } else {
        data.LogChannel = channel.id;
        data.save();
      }
      return interaction.editReply({
        embeds: [successEmbed(`Moderation Log channel was set to ${channel}`)],
      });
    }

    if (option == "msglogchannel") {
      if (data && reset) {
        data.MsgLogChannel = null;
        data.save();
        return interaction.editReply({
          embeds: [successEmbed(`Message Log channel was set to none.`)],
        });
      }
      if (!data && reset) {
        return interaction.editReply({
          embeds: [successEmbed(`There are no Message Log Channel to reset.`)],
        });
      }

      if (!data) {
        data = new g({
          GuildID: guildid,
          MsgLogChannel: channel.id,
        });
        data.save();
      } else {
        data.MsgLogChannel = channel.id;
        data.save();
      }
      return interaction.editReply({
        embeds: [successEmbed(`Message Log channel was set to ${channel}`)],
      });
    }
  });
};
