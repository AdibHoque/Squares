const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const l = require("../models/log");

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
  name: "clearlogs",
  category: "Moderation",
  description: "Mass delete a members logs, oldest to newest sequence.",
  required: "MODERATE_MEMBERS",
  usage: "/clearlogs <member> [Amount]",
};

module.exports.data = new SlashCommandBuilder()
  .setName("clearlogs")
  .setDescription("Mass delete a members logs, oldest to newest sequence.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((option) =>
    option
      .setName("member")
      .setDescription("The Member to Warn.")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("amount")
      .setDescription("Amount to delete. Default and Maximum both is 25.")
  );

module.exports.run = (client, interaction, options) => {
  let member = options.getMember("member");
  let amount = options.getInteger("amount") ? options.getInteger("amount") : 25;
  if (amount > 25) amount = 25;
  let guildid = interaction.guildId;
  let userid = member.user.id;

  l.findOne({ GuildID: guildid, UserID: userid }, async (err, data) => {
    if (err) throw err;
    if (!data)
      return interaction.editReply({
        embeds: [errorEmbed("**This member has no logs.**")],
      });
    if (!data.Content)
      return interaction.editReply({
        embeds: [errorEmbed("**This member has no logs..**")],
      });
    // interaction.editReply for confirmation
    // message collector
    const embed = new EmbedBuilder()
      .setDescription(
        "Please type in `CONFIRM` to proceed this action, as it cannot be undone.\nThis command will be automatically cancelled in 20 seconds."
      )
      .setColor("#F3BA2F");
    interaction.editReply({ embeds: [embed] });
    const filter = (m) => m.author.id == interaction.user.id;
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 20 * 1000,
    });

    collector.on("collect", async (m) => {
      if (m.content == "CONFIRM") {
        collector.stop();
        let arr = data.Content;
        arr.splice(0, amount);
        data.Content = arr;
        data.save();
        return interaction.editReply({
          embeds: [
            successEmbed(
              `**Corresponding amount of starting logs were cleared from ${member.user.tag}.**`
            ),
          ],
        });
      }
    });
  });
};
