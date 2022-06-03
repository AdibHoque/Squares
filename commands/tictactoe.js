const {SlashCommandBuilder} = require("@discordjs/builders");
const TicTacToe = require("discord-tictactoe");
const game = new TicTacToe({language: "en"});

module.exports.data = new SlashCommandBuilder()
.setName("tictactoe")
.setDescription("Play a game of TicTacToe.")
.addUserOption(option => option.setName("opponent").setDescription("Select opponent or play against AI."))

module.exports.run = (client,interaction,options) => {
      game.handleInteraction(interaction);
}
