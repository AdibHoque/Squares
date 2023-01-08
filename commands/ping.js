const {SlashCommandBuilder} = require("discord.js");

module.exports.data = new SlashCommandBuilder()
.setName("ping")
.setDescription("Check bot ping latency!");

module.exports.run = (client,interaction) => {
    interaction.editReply({
        content: "Pong!"
    })
}