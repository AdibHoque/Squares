const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function errorEmbed(text) {
  const embed = new EmbedBuilder()
    .setDescription("<:Cross:1081542318462599168> " + text)
    .setColor("#F3BA2F");
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
          .setTitle(`<:Squares:1080890146766991460> COMMAND INFO`)
          .addFields([
            {
              name: `<:Name:1081538183809998858> Name:`,
              value: "`" + capitalize(c.name) + "`",
              inline: true,
            },
            {
              name: `<:Commands:1081538288290119711> Category:`,
              value: "`" + c.category + "`",
              inline: true,
            },
            {
              name: `<:Description:1081538229712474184> Description:`,
              value: "```" + c.description + "```",
            },
            {
              name: `<:Moderation:1081537551401230406> Required Permissions:`,
              value: "`" + c.required + "`",
              inline: true,
            },
            {
              name: `<:Usage:1081538135755870259> Usage:`,
              value: "`" + c.usage + "`",
              inline: true,
            },
          ])
          .setColor("#F3BA2F")
          .setFooter({ text: "Parameter [] = Optional | <> = Required" }),
      ],
    });
  }

  const embed = new EmbedBuilder()
    .setTitle(`<:Squares:1080890146766991460> HELP MENU`)
    .setDescription(
      `To get detailed help on a command, use \`/help <command name>\`!`
    )
    .addFields([
      {
        name: "<:Utility:1081537632061882429> Utility",
        value:
          "`ping`, `avatar`, `define`, `color`, `math`, `winratecalc`, `userinfo`, `serverinfo`, `roleinfo`, `botinfo`, `github`",
      },
      {
        name: "<:Moderation:1081537551401230406> Moderation",
        value:
          "`warn`, `mute`, `unmute`, `kick`, `ban`, `unban`, `purge`, `logs`, `loginfo`, `deletelog`, `clearlogs`, `nickname`, `resetnick`, `role`, `embed`",
      },
      {
        name: "<:Entertainment:1081537715788578866> Entertainment",
        value: "`wordchain`, `tictactoe`, `meme`, `joke`, `8ball`",
      },
      {
        name: "<:Giveaway:1081537798424764476> Giveaway",
        value:
          "`gstart`, `greroll`, `gend`, `gedit`, `gdelete`\n\n<:Invite:1081552291292794941> [Invite Squares](https://discord.com/api/oauth2/authorize?client_id=629323586930212884&permissions=1513376050423&scope=bot%20applications.commands) | [Support Server](https://discord.gg/RDKvzEytHr)",
      },
    ])
    .setColor(`#F3BA2F`);

  interaction.editReply({ embeds: [embed] });
};
