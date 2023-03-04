const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

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

module.exports.data = new SlashCommandBuilder()
  .setName("nickname")
  .setDescription("Change nickname of a Member.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
  .addUserOption((option) =>
    option
      .setName("member")
      .setDescription("The Member you wanna change Nickname of.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("nickname")
      .setDescription("The new Nickname.")
      .setRequired(true)
  );

module.exports.help = {
  name: "nickname",
  category: "Moderation",
  description: "Change a members nickname.",
  required: "MANAGE_NICKNAMES",
  usage: "/nickname <member ID or @member> <nickname>",
};

module.exports.run = (client, interaction, options) => {
  let permissions = interaction.member.permissions.toArray();
  if (!permissions.includes("ManageNicknames"))
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            "<:Cross:1081542318462599168> You need the `ManageNicknames` permission to use this command."
          )
          .setColor("#F3BA2F"),
      ],
    });

  let member = options.getMember("member");
  let nickname = options.getString("nickname");

  member
    .setNickname(nickname)
    .then(() => {
      interaction.editReply({
        embeds: [
          successEmbed(`Successfully changed nickname of ${member.user.tag}!`),
        ],
      });
    })
    .catch((error) => {
      console.log(error);
      interaction.editReply({
        embeds: [
          errorEmbed(
            "An unknown error occured! Please check if i have enough permissions to execute this command"
          ),
        ],
      });
    });
};
