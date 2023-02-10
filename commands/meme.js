const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { RedditSimple } = require("reddit-simple");

module.exports.help = {
  name: "meme",
  category: "Entertainment",
  description: "Get a fresh meme from reddit!",
  required: "None",
  usage: "/meme [Subreddit]",
};

module.exports.data = new SlashCommandBuilder()
  .setName("meme")
  .setDescription("Get a fresh meme from reddit!")
  .addStringOption((option) =>
    option
      .setName("subreddit")
      .setDescription("You can select to get memes from a certain subreddit")
      .setChoices(
        { name: "r/Me_Irl", value: "me_irl" },
        { name: "r/Memes", value: "memes" },
        { name: "r/DankMemes", value: "dankmemes" },
        { name: "r/WholeSomeMemes", value: "wholesomememes" },
        { name: "r/ComedyHeaven", value: "comedyheaven" },
        { name: "r/PewDiePieSubmissions", value: "pewdiepiesubmissions" },
        { name: "r/TerribleFacebookMemes", value: "terriblefacebookmemes" },
        { name: "r/HistoryMemes", value: "historymemes" },
        { name: "r/GoodAniMemes", value: "goodanimemes" },
        { name: "r/ProgrammerHumor", value: "programmerhumor" },
        { name: "r/CursedComments", value: "cursedcomments" }
      )
  );

module.exports.run = (client, interaction, options) => {
  var subreddits = [
    "me_irl",
    "memes",
    "dankmemes",
    "wholesomememes",
    "comedyheaven",
    "pewdiepiesubmissions",
    "terriblefacebookmemes",
  ];

  let sub = options.getString("subreddit")
    ? options.getString("subreddit")
    : subreddits[Math.round(Math.random() * (subreddits.length - 1))];

  RedditSimple.RandomPost(sub)
    .then((post) => {
      const title = post[0].data.title;
      const thumb = post[0].data.url;
      const permalink = "https://reddit.com/" + post[0].data.permalink;
      const ups = post[0].data.ups;
      const downs = post[0].data.downs;
      const comments = post[0].data.num_comments;

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setURL(permalink)
        .setImage(thumb)
        .setFooter({ text: `👍 ${ups} | 💬 ${comments} - r/${sub}` })
        .setColor("#FF9900");
      interaction.editReply({ embeds: [embed] });
    })
    .catch((e) => console.log(e));
};
