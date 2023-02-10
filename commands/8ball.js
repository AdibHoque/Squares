const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const responses = [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes~ definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful.",
];

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

module.exports.help = {
  name: "8ball",
  category: "Entertainment",
  description: "Ask questions to the magic 8Ball.",
  required: "None",
  usage: "/8ball <question>",
};

module.exports.data = new SlashCommandBuilder()
  .setName("8ball")
  .setDescription("Ask questions to the magic 8Ball.")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("Question that you wanna ask.")
      .setRequired(true)
  );

module.exports.run = (client, interaction, options) => {
  let question = options.getString("question");
  if (question.endsWith("?")) question = `${question}?`;
  const embed = new EmbedBuilder()
    .setColor("#FF9900")
    .setDescription(responses.random());
  interaction.editReply({ content: `> ${question}`, embeds: [embed] });
};
