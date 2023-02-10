const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { RedditSimple } = require("reddit-simple");

module.exports.help = {
  name: "joke",
  category: "Entertainment",
  description: "Get a fresh joke from reddit!",
  required: "None",
  usage: "/meme [type]",
};

module.exports.data = new SlashCommandBuilder()
  .setName("joke")
  .setDescription("Get a fresh joke from reddit!")
  .addStringOption((option) =>
    option
      .setName("type")
      .setDescription(
        "You can select to get a certain type of joke. Default: Funny"
      )
      .setChoices(
        { name: "Funny", value: "jokes" },
        { name: "Dad Joke", value: "dadjoke" },
        { name: "Shower Thoughts", value: "showerthoughts" }
      )
  );

module.exports.run = (client, interaction, options) => {
  let sub = options.getString("type") ? options.getString("type") : "joke";

  RedditSimple.RandomPost(sub)
    .then((post) => {
      const title = post[0].data.title;
      const desc = post[0].data.selftext;
      const permalink = "https://reddit.com/" + post[0].data.permalink;
      const ups = post[0].data.ups;
      const downs = post[0].data.downs;
      const comments = post[0].data.num_comments;

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setURL(permalink)
        .setDescription(desc)
        .setFooter(`👍 ${ups} | 💬 ${comments}`)
        .setColor("#FF9900");
      interaction.editReply({ embeds: [embed] });
    })
    .catch((e) => console.log(e));
};
