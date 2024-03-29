const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");

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
  name: "gend",
  category: "Giveaway",
  description: "Force end an ongoing Giveaway",
  required: "MANAGE_MESSAGES",
  usage: "/gend <Giveaway Message ID>",
};

module.exports.data = new SlashCommandBuilder()
  .setName("gend")
  .setDescription("Force end a giveaway!")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addStringOption((option) =>
    option
      .setName("giveaway_message_id")
      .setDescription("Message ID of the giveaway you wanna end.")
      .setRequired(true)
  );

module.exports.run = (client, interaction, options) => {
  const query = interaction.options.getString("giveaway_message_id");

  client.giveawaysManager
    .end(query)
    .then(() => {
      interaction.editReply({
        embeds: [successEmbed("Giveaway has been forcefully ended!")],
      });
    })
    .catch((err) => {
      interaction.editReply({ embeds: errorEmbed[`${err}`] });
    });
};
