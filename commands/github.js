const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { get } = require("request-promise-native");

function errorEmbed(text) {
  const embed = new EmbedBuilder()
    .setDescription("<:Cross:1081542318462599168> " + text)
    .setColor("#F3BA2F");
  return embed;
}

module.exports.help = {
  name: "github",
  category: "Utility",
  description: "Get info on a Github User or Repository.",
  required: "None",
  usage: "/github <user/repo> <name>",
};

module.exports.data = new SlashCommandBuilder()
  .setName("github")
  .setDescription("Get info on a Github User or Repository.")
  .addStringOption((option) =>
    option
      .setName("option")
      .setDescription("Set or assign new value.")
      .setChoices(
        { name: "User", value: "user" },
        { name: "Repository", value: "repo" }
      )
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription(
        "Name of the User or Repository. Example: AdibHoque or AdibHoque/DiscordTimestamp"
      )
      .setRequired(true)
  );

module.exports.run = async (client, interaction, options) => {
  let option = options.getString("option");
  let name = options.getString("name");

  if (option == "repo") {
    let result = {
      url: "https://api.github.com/repos/" + name,
      json: true,
      headers: {
        "User-Agent": "node.js",
      },
    };
    get(result)
      .then((body) => {
        if (body.message == "Not Found")
          return interaction.editReply({
            embeds: [
              errorEmbed(
                `No Repository found on this name.\n**Example:** username/repository - AdibHoque/DiscordTimestamp`
              ),
            ],
          });
        const embed = new EmbedBuilder()
          .setAuthor({ name: body.owner.login, iconURL: body.owner.avatar_url })
          .addFields([
            {
              name: "Repository",
              value: `[${body.name}](${body.html_url})`,
              inline: true,
            },
            { name: "Most Used Language", value: body.language, inline: true },
            {
              name: "Forks",
              value: `${body.forks_count ? body.forks_count : "0"}`,
              inline: true,
            },
            {
              name: "Watchers",
              value: `${body.watchers_count ? body.watchers_count : "0"}`,
              inline: true,
            },
            {
              name: "Open Issues",
              value: `${body.open_issues_count ? body.open_issues_count : "0"}`,
              inline: true,
            },
            { name: "License", value: body.license.name, inline: true },
          ])
          .setColor("#F3BA2F")
          .setFooter({
            text: `Created on ` + new Date(body.created_at).toUTCString(),
          });
        if (body.description) embed.setDescription(body.description);
        if (body.owner.avatar_url) embed.setThumbnail(body.owner.avatar_url);
        interaction.editReply({ embeds: [embed] });
      })
      .catch((e) => {
        return interaction.editReply({
          embeds: [
            errorEmbed(
              `No Repository found on this name.\n**Example:** username/repository - AdibHoque/DiscordTimestamp`
            ),
          ],
        });
      });
  }

  if (option == "user") {
    let result = {
      url: "https://api.github.com/users/" + name,
      json: true,
      headers: {
        "User-Agent": "node.js",
      },
    };
    get(result)
      .then((body) => {
        if (body.message == "Not Found")
          return interaction.editReply({
            embeds: [errorEmbed(`No User found on this name.`)],
          });
        let fields = [];
        fields.push({
          name: "User",
          value: `[${body.login}](${body.html_url})`,
          inline: true,
        });
        if (body.twitter_username)
          fields.push({
            name: "Twitter",
            value: `[@${body.twitter_username}](https://twitter.com/${body.twitter_username})`,
            inline: true,
          });
        if (body.location)
          fields.push({
            name: "Location",
            value: `${body.location}`,
            inline: true,
          });
        if (body.company)
          fields.push({
            name: "Company",
            value: `${body.company}`,
            inline: true,
          });
        if (body.email)
          fields.push({
            name: "Email",
            value: `${body.email}`,
            inline: true,
          });
        fields.push(
          {
            name: "Followers",
            value: `${body.followers ? body.followers : "0"}`,
            inline: true,
          },
          {
            name: "Following",
            value: `${body.following ? body.following : "0"}`,
            inline: true,
          },
          {
            name: "Public Repos",
            value: `${body.public_repos ? body.public_repos : "0"}`,
            inline: true,
          },
          {
            name: "Public Gists",
            value: `${body.public_gists ? body.public_gists : "0"}`,
            inline: true,
          }
        );
        const embed = new EmbedBuilder()
          .setAuthor({ name: body.login, iconURL: body.avatar_url })
          .addFields(fields)
          .setColor("#F3BA2F")
          .setFooter({
            text: `Registered on ` + new Date(body.created_at).toUTCString(),
          });
        if (body.name) embed.setTitle(body.name);
        if (body.bio) embed.setDescription(body.bio);
        if (body.avatar_url) embed.setThumbnail(body.avatar_url);
        interaction.editReply({ embeds: [embed] });
      })
      .catch((e) => {
        console.log(e);
        return interaction.editReply({
          embeds: [errorEmbed(`No User found on this name.`)],
        });
      });
  }
};
