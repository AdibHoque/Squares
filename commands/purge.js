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
  name: "purge",
  category: "Moderation",
  description: "Bulk delete messages of a channel.",
  required: "MANAGE_MESSAGES",
  usage: "/purge <amount>",
};

module.exports.data = new SlashCommandBuilder()
  .setName("purge")
  .setDescription("Bulk delete messages of a channel.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("Amount of messages to delete. (Min-Max 1-99)")
      .setRequired(true)
  );

module.exports.run = async (client, interaction, options) => {
  let amount = options.getInteger("amount");
  if (amount > 99) amount = 99;
  if (amount < 1) amount = 1;

  interaction.channel
    .bulkDelete(amount + 1, true)
    .then((messages) => {
      interaction.channel.send({
        embeds: [
          successEmbed(`Successfully deleted ${messages.size - 1} messages!`),
        ],
      });
      g.findOne({ GuildID: interaction.guildId }, async (err, data) => {
        if (err) throw err;
        if (!data) return;
        if (!data.LogChannel) return;
        const c = interaction.guild.channels.cache.get(data.LogChannel);
        if (!c) return;

        const embed = new EmbedBuilder()
          .setTitle(`MESSAGES PURGED`)
          .addFields([
            {
              name: `Moderator`,
              value: interaction.user.tag + " (" + interaction.user.id + ")",
            },
            { name: "Amount", value: `${messages.size - 1} Messages` },
            { name: `Channel`, value: "<#" + interaction.channel.id + ">" },
          ])
          .setThumbnail(
            interaction.guild.iconURL({
              format: "png",
              dynamic: true,
              size: 512,
            })
          )
          .setTimestamp()
          .setFooter({ text: `MESSAGES PURGED` })
          .setColor(`#F3BA2F`);
        c.send({ embeds: [embed] });
      });
    })
    .catch((error) => {
      return interaction.editReply({
        embeds: [
          errorEmbed(
            "Unable to purge messages!\nPlease check if i have enough permissions to execute this command."
          ),
        ],
      });
    });
};
