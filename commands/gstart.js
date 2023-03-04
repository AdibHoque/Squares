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
  name: "gstart",
  category: "Giveaway",
  description: "Start a Giveaway.",
  required: "MANAGE_MESSAGES",
  usage:
    "/gstart <Duration e.g. 1d 6h> <Winner Count> <Prize> [Giveaway Channel]",
};

module.exports.data = new SlashCommandBuilder()
  .setName("gstart")
  .setDescription("Start a giveaway!")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addStringOption((option) =>
    option
      .setName("duration")
      .setDescription("Duration of the giveaway. Example: 1d")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("winners")
      .setDescription("The amount of winners.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("prize")
      .setDescription("Prize(s) of the giveaway.")
      .setRequired(true)
  )
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Leave Empty if you wanna host in current channel")
  );

module.exports.run = (client, interaction, options) => {
  const duration = interaction.options.getString("duration");
  const wc = interaction.options.getInteger("winners");
  const winnerCount = wc < 16 ? wc : 15;
  const prize = interaction.options.getString("prize");
  const channel = interaction.options.getChannel("channel")
    ? interaction.options.getChannel("channel")
    : interaction.channel;

  const onGoing = client.giveawaysManager.giveaways.filter(
    (g) => g.guildId === interaction.guildId && !g.ended
  );
  if (onGoing.length > 9) {
    return interaction.editReply({
      embeds: [
        errorEmbed(
          `There cannot be more than 10 ongoing giveaways in a server.`
        ),
      ],
    });
  }
  if (!channel.isTextBased()) {
    return interaction.editReply({
      embeds: [errorEmbed("Please select a text channel.")],
      ephemeral: true,
    });
  }
  client.giveawaysManager
    .start(channel, {
      duration: ms(duration),
      winnerCount,
      prize,
      hostedBy: interaction.user,
      thumbnail:
        "https://media.discordapp.net/attachments/656517276832366595/1081550786749808640/1677932186933.png",
      messages: {
        giveaway:
          "<:Giveaway:1081537798424764476> <:Giveaway:1081537798424764476> **GIVEAWAY** <:Giveaway:1081537798424764476> <:Giveaway:1081537798424764476>",
        giveawayEnded:
          "<:Giveaway:1081537798424764476> <:Giveaway:1081537798424764476> **GIVEAWAY ENDED** <:Giveaway:1081537798424764476> <:Giveaway:1081537798424764476>",
        inviteToParticipate:
          "React <:Giveaway:1081537798424764476> to participate!",
        winMessage: {
          content: `Congratulations, {winners}! You won **{this.prize}**!`,
          replyToGiveaway: true,
        },
        drawing: "Ends: {timestamp}",
        winners: "Winners:",
        embedFooter: "Winners: {this.winnerCount}",
        endedAt: "Giveaway Ended",
      },
    })
    .then(() => {
      if (channel == interaction.channel) {
        return interaction.deleteReply().catch(console.error);
      }
      interaction.editReply({
        embeds: [successEmbed(`Successfully hosted Giveaway in ${channel}`)],
      });
    });
};
