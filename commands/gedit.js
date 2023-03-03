const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");

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

module.exports.help = {
  name: "gedit",
  category: "Giveaway",
  description: "Edit data of an ongoing Giveaway",
  required: "MANAGE_MESSAGES",
  usage:
    "/gedit <Giveaway Message ID> <Time to add or dedcut, use - to deduct (-1d)> <Winner Count> <Prize>",
};

module.exports.data = new SlashCommandBuilder()
  .setName("gedit")
  .setDescription("Edit a giveaway!")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addStringOption((option) =>
    option
      .setName("giveaway_message_id")
      .setDescription("Message ID of the giveaway you wanna edit.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("add_or_deduct_time")
      .setDescription("Add time or use - to deduct.")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("new_winners")
      .setDescription("New amount of winners.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("new_prize")
      .setDescription("New prize of the giveaway.")
      .setRequired(true)
  );

module.exports.run = (client, interaction, options) => {
  const duration = interaction.options.getString("add_or_deduct_time");
  const winnerCount = interaction.options.getInteger("new_winners");
  const prize = interaction.options.getString("new_prize");
  const messageId = interaction.options.getString("giveaway_message_id");

  client.giveawaysManager
    .edit(messageId, {
      addTime: ms(duration),
      newWinnerCount: winnerCount,
      newPrize: prize,
    })
    .then(() => {
      interaction.editReply({
        embeds: [successEmbed(`Giveaway was updated successfully!`)],
      });
    })
    .catch((err) => {
      interaction.editReply({ embeds: [errorEmbed(`${err}`)] });
    });
};
