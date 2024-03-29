const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports.help = {
  name: "ping",
  category: "Utility",
  description: "Check bot ping latency!",
  required: "None",
  usage: "/ping",
};

module.exports.data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Check bot ping latency!");

module.exports.run = (client, interaction) => {
  interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setDescription(`Pong! ${client.ws.ping}ms`)
        .setColor("#F3BA2F"),
    ],
  });
};
