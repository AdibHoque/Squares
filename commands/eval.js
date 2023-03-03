const { SlashCommandBuilder } = require("discord.js");
const { Discord, EmbedBuilder, Utils } = require("discord.js");

function errorEmbed(text) {
  const embed = new EmbedBuilder()
    .setDescription("<:Cross:1063031834713264128> " + text)
    .setColor("#F3BA2F");
  return embed;
}

function clean(text) {
  if (typeof text === "string")
    return text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return text;
}

module.exports.help = {
  name: "eval",
  category: "Restricted",
  description: "Evaluates JavaScript code.",
  required: "SQUARES_DEVELOPER",
  usage: "/eval <code>",
};

module.exports.data = new SlashCommandBuilder()
  .setName("eval")
  .setDescription("Evaluate your JavaScript code.")
  .addStringOption((option) =>
    option
      .setName("code")
      .setDescription("The code to evaluate.")
      .setRequired(true)
  );

module.exports.run = async (client, interaction, options) => {
  if (!interaction.user.id === "496978159724396545")
    return interaction.editReply({
      embeds: [
        errorEmbed("**You do not have permisssion to use this command.**"),
      ],
      ephemeral: true,
    });
  let code = options.getString("code");

  try {
    let evaled = eval(code);
    if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

    interaction.editReply({
      content: `**Input**\`\`\`js\n${code}\n\`\`\`\n**Output**\`\`\`${clean(
        evaled
      )}\`\`\``,
    });
  } catch (err) {
    interaction.editReply({
      content: `\`ERROR\` \`\`\`js\n${clean(err)}\n\`\`\``,
    });
  }
};
