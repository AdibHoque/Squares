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
  .setName("resetnick")
  .setDescription("Reset nickname of a Member.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
  .addUserOption((option) =>
    option
      .setName("member")
      .setDescription("The Member you wanna reset Nickname of.")
      .setRequired(true)
  );

module.exports.help = {
  name: "resetnick",
  category: "Moderation",
  description: "Reset a members nickname.",
  required: "MANAGE_NICKNAMES",
  usage: "/resetnick <member ID or @member>",
};

module.exports.run = (client, interaction, options) => {
  let member = options.getMember("member");

  member
    .setNickname(null)
    .then(() => {
      interaction.editReply({
        embeds: [
          successEmbed(`Successfully resetted nickname of ${member.user.tag}!`),
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
