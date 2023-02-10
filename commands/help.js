const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function errorEmbed(text) {
  const embed = new EmbedBuilder()
    .setDescription("<:Cross:1063031834713264128> " + text)
    .setColor("#FF9900");
  return embed;
}

module.exports.help = {
  name: "help",
  category: "Help",
  description: "See the list of bot commands.",
  required: "None",
  usage: "/help [command name]",
};

module.exports.data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("See the command list of the bot.")
  .addStringOption((option) =>
    option
      .setName("command")
      .setDescription("The command you wanna learn anout.")
  );

module.exports.run = (client, interaction, options) => {
  let cmd = options.getString("command")
    ? options.getString("command").toLowerCase()
    : false;

  if (cmd) {
    let command;
    try {
      command = require(`../commands/${cmd}.js`);
    } catch (e) {
      return interaction.editReply({
        embeds: [errorEmbed("Please provide a valid command name.")],
      });
    }
    const c = command.help;
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Command Help")
          .addFields([
            {
              name: `<:Name:1066716238216187975> Name:`,
              value: "`" + capitalize(c.name) + "`",
              inline: true,
            },
            {
              name: `<:Commands:1066347425465380924> Category:`,
              value: "`" + c.category + "`",
              inline: true,
            },
            {
              name: `<:Description:1066716273821622303> Description:`,
              value: "```" + c.description + "```",
            },
            {
              name: `<:Permissions:1066716314946773062> Required Permissions:`,
              value: "`" + c.required + "`",
              inline: true,
            },
            {
              name: `<:Usage:1066717996325814282> Usage:`,
              value: "`" + c.usage + "`",
              inline: true,
            },
          ])
          .setColor("#FF9900")
          .setFooter({ text: "Parameter [] = Optional | <> = Required" }),
      ],
    });
  }

  const embed = new EmbedBuilder()
    .setAuthor({ name: "ELECTRON" })
    .setTitle(`<:Commands:1066347425465380924> HELP MENU`)
    .setDescription(
      `To get detailed help on a command, use \`/help <command name>\`!`
    )
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/678539559570767872/1063130454930239489/20230112_222006.gif"
    )
    .addFields([
      {
        name: "Utility",
        value:
          "`ping`, `avatar`, `define`, `color`, `math`, `winratecalc`, `userinfo`, `serverinfo`, `roleinfo`, `botinfo`, `github`",
      },
      {
        name: "Moderation",
        value:
          "`warn`, `mute`, `unmute`, `kick`, `ban`, `unban`, `purge`, `logs`, `loginfo`, `deletelog`, `clearlogs`, `nickname`, `resetnick`, `role`, `embed`",
      },
      {
        name: "Entertainment",
        value: "`wordchain`, `tictactoe`, `meme`, `joke`, `8ball`",
      },
      {
        name: "Giveaway",
        value:
          "`gstart`, `greroll`, `gend`, `gedit`, `gdelete`\n\n<:Plus:1063031875360280646> [Add BOT](https://discord.com/api/oauth2/authorize?client_id=629323586930212884&permissions=1513376050423&scope=bot%20applications.commands) | [Support Server](https://discord.gg/RDKvzEytHr)",
      },
    ])
    .setColor(`#FF9900`);

  interaction.editReply({ embeds: [embed] });
};
