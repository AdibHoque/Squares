const {SlashCommandBuilder} = require("discord.js");
const TicTacToe = require("discord-tictactoe");
const game = new TicTacToe({language: "en"});

module.exports.help = {
      name: "tictactoe",
      category: "Entertainment",
      description: "Play a game of TicTacToe",
      required: "None",
      usage: "/tictactoe [user]"
  }

module.exports.data = new SlashCommandBuilder()
.setName("tictactoe")
.setDescription("Play a game of TicTacToe.")
.addUserOption(option => option.setName("opponent").setDescription("Select opponent or play against AI."))

module.exports.run = (client,interaction,options) => {
      game.handleInteraction(interaction);
}
