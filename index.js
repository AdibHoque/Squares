const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  WebhookClient,
} = require("discord.js");
const g = require("./models/guild");
const env = require("dotenv");
env.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGOTOKEN);
const db = mongoose.connection;

require("./slash-register")((updateCommands = true));
let commands = require("./slash-register").commands;

client.on("ready", () => {
  console.log("Bot is online");
  let commands = client.application.commands;
  setInterval(() => {
    client.user.setPresence({
      activities: [
        {
          name: `/help | ${client.guilds.cache.size} Guilds`,
          type: ActivityType.Playing,
        },
      ],
      status: "online",
    });
  }, 60000);
});

client.on("error", (e) => {
  console.log(e);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("warning", console.warn);

client.on("interactionCreate", async (interaction) => {
  if (interaction.user.bot) return;
  if (interaction.isCommand()) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.user.tag} (${interaction.user.id})`,
        iconURL: interaction.user.avatarURL({
          format: "png",
          dynamic: true,
          size: 256,
        }),
      })
      .setDescription(`</${interaction.commandName}:${interaction.commandId}>`)
      .setColor("#F3BA2F")
      .setTimestamp();
    if (interaction.guild) {
      embed.setTitle(interaction.guild.name);
      embed.setThumbnail(
        interaction.guild.iconURL({ format: "png", dynamic: true, size: 256 })
      );
    }
    const webhookClient = new WebhookClient({
      url: process.env.WEBHOOK_USAGE,
    });
    webhookClient.send({ embeds: [embed] });
    await interaction.deferReply();
    let name = interaction.commandName;
    let options = interaction.options;

    let commandMethod = commands.get(name);
    if (!commandMethod) return;

    commandMethod.run(client, interaction, options);
  }
});

client.on("messageDelete", (message) => {
  if (message.author.bot) return;
  g.findOne({ GuildID: message.guild.id }, async (err, data) => {
    if (err) throw err;
    if (!data) return;
    if (!data.MsgLogChannel) return;
    const c = message.guild.channels.cache.get(data.MsgLogChannel);
    if (!c) return;

    const embed = new EmbedBuilder()
      .setTitle(`MESSAGE DELETED`)
      .addFields([
        { name: "Content", value: message.content },
        {
          name: `Author`,
          value: message.author.tag + " (" + message.author.id + ")",
        },
        { name: `Channel`, value: "<#" + message.channel.id + ">" },
      ])
      .setThumbnail(
        message.guild.iconURL({ format: "png", dynamic: true, size: 512 })
      )
      .setTimestamp()
      .setFooter({ text: `MESSAGE DELETED` })
      .setColor(`#F3BA2F`);
    c.send({ embeds: [embed] });
  });
});

client.on("messageUpdate", (oldMessage, newMessage) => {
  let message = oldMessage;
  if (message.author.bot) return;
  if (oldMessage.content == newMessage.content) return;
  g.findOne({ GuildID: message.guild.id }, async (err, data) => {
    if (err) throw err;
    if (!data) return;
    if (!data.MsgLogChannel) return;
    const c = message.guild.channels.cache.get(data.MsgLogChannel);
    if (!c) return;

    const embed = new EmbedBuilder()
      .setTitle(`MESSAGE EDITED`)
      .addFields([
        {
          name: `Author`,
          value: message.author.tag + " (" + message.author.id + ")",
        },
        { name: "Before", value: message.content },
        { name: "After", value: newMessage.content },
        { name: `Message Channel`, value: "<#" + message.channel.id + ">" },
      ])
      .setThumbnail(
        message.guild.iconURL({ format: "png", dynamic: true, size: 512 })
      )
      .setTimestamp()
      .setFooter({ text: `MESSAGE DELETED` })
      .setColor(`#F3BA2F`);
    const row = new ActionRowBuilder().addComponents([
      new ButtonBuilder()
        .setLabel("Jump to message")
        .setStyle(5)
        .setURL(
          `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`
        ),
    ]);
    c.send({ embeds: [embed], components: [row] });
  });
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
  if (oldMember.bot) return;
  g.findOne({ GuildID: oldMember.guild.id }, async (err, data) => {
    if (err) throw err;
    if (!data) return;
    if (!data.LogChannel) return;
    const c = newMember.guild.channels.cache.get(data.LogChannel);

    if (!c) return;

    let oldRoles = [];
    oldMember.roles.cache.forEach((r) => oldRoles.push(r.toString()));

    let newMemberRoles = [];
    newMember.roles.cache.forEach((r) => newMemberRoles.push(r.toString()));

    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
      let newRole = [];
      newMemberRoles.forEach((r) => {
        if (!oldRoles.includes(r)) newRole.push(r);
      });
      const embed = new EmbedBuilder()
        .setAuthor({
          name: oldMember.user.tag,
          iconURL: newMember.user.avatarURL({
            format: "png",
            dynamic: true,
            size: 256,
          }),
        })
        .setTitle("MEMBER ROLES UPDATED")
        .setDescription(
          `**Old Roles:** ${oldRoles.join(
            " "
          )}\n\n**Role Added:** ${newRole.join(" ")}`
        )
        .setThumbnail(
          oldMember.guild.iconURL({ format: "png", dynamic: true, size: 512 })
        )
        .setTimestamp()
        .setFooter({ text: `ROLE ADDED` })
        .setColor(`#F3BA2F`);
      c.send({ embeds: [embed] });
    }

    if (newMember.roles.cache.size < oldMember.roles.cache.size) {
      let removedRole = [];
      oldRoles.forEach((r) => {
        if (!newMemberRoles.includes(r)) removedRole.push(r);
      });
      const embed = new EmbedBuilder()
        .setAuthor({
          name: oldMember.user.tag,
          iconURL: newMember.user.avatarURL({
            format: "png",
            dynamic: true,
            size: 256,
          }),
        })
        .setTitle("MEMBER ROLES UPDATED")
        .setDescription(
          `**Old Roles:** ${oldRoles.join(
            " "
          )}\n\n**Role Removed:** ${removedRole.join(" ")}`
        )
        .setThumbnail(
          oldMember.guild.iconURL({ format: "png", dynamic: true, size: 512 })
        )
        .setTimestamp()
        .setFooter({ text: `ROLE REMOVED` })
        .setColor(`#F3BA2F`);
      c.send({ embeds: [embed] });
    }

    if (!(oldMember.nickname === newMember.nickname)) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: oldMember.user.tag,
          iconURL: newMember.user.avatarURL({
            format: "png",
            dynamic: true,
            size: 256,
          }),
        })
        .setTitle("NICKNAME UPDATED")
        .setDescription(
          `**Old Nickname:** \`${
            oldMember.nickname ? oldMember.nickname : "None"
          }\`\n\n**New Nickname:** \`${
            newMember.nickname ? newMember.nickname : "None"
          }\``
        )
        .setThumbnail(
          oldMember.guild.iconURL({ format: "png", dynamic: true, size: 512 })
        )
        .setTimestamp()
        .setFooter({ text: `NICKNAME UPDATED` })
        .setColor(`#F3BA2F`);
      c.send({ embeds: [embed] });
    }
  });
});

client.on("guildCreate", (guild) => {
  let fields = [
    { name: "Owner ID", value: `${guild.ownerId}`, inline: true },
    { name: "Members", value: `${guild.memberCount}`, inline: true },
    {
      name: "Boosts",
      value: `${guild.premiumSubscriptionCount}`,
      inline: true,
    },
    { name: "Channels", value: `${guild.channels.cache.size}`, inline: true },
    { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
    { name: "Emojis", value: `${guild.emojis.cache.size}`, inline: true },
  ];
  const embed = new EmbedBuilder()
    .setAuthor({ name: `Guild Joined`, iconURL: client.user.avatarURL() })
    .addFields(fields)
    .setThumbnail(guild.iconURL())
    .setColor(`#F3BA2F`)
    .setFooter({
      text: `Total Guilds: ${client.guilds.cache.size} | Total Users: ${client.users.cache.size}`,
    });
  if (guild.banner) embed.setImage(guild.bannerURL({ size: 1024 }));
  const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_ADDS });
  webhookClient.send({ embeds: [embed] });
});

client.on("guildDelete", (guild) => {
  let fields = [
    { name: "Owner ID", value: `${guild.ownerId}`, inline: true },
    { name: "Members", value: `${guild.memberCount}`, inline: true },
    {
      name: "Boosts",
      value: `${guild.premiumSubscriptionCount}`,
      inline: true,
    },
    { name: "Channels", value: `${guild.channels.cache.size}`, inline: true },
    { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
    { name: "Emojis", value: `${guild.emojis.cache.size}`, inline: true },
  ];
  const embed = new EmbedBuilder()
    .setAuthor({ name: `Guild Joined`, iconURL: client.user.avatarURL() })
    .addFields(fields)
    .setThumbnail(guild.iconURL())
    .setColor(`#F3BA2F`)
    .setFooter({
      text: `Total Guilds: ${client.guilds.cache.size} | Total Users: ${client.users.cache.size}`,
    });
  if (guild.banner) embed.setImage(guild.bannerURL({ size: 1024 }));
  const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_REMOVES });
  webhookClient.send({ embeds: [embed] });
});

// Check the connection
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB.");
});

// Create the schema for giveaways
const giveawaySchema = new mongoose.Schema(
  {
    messageId: String,
    channelId: String,
    guildId: String,
    startAt: Number,
    endAt: Number,
    ended: Boolean,
    winnerCount: Number,
    prize: String,
    messages: {
      giveaway: String,
      giveawayEnded: String,
      title: String,
      inviteToParticipate: String,
      drawing: String,
      dropMessage: String,
      winMessage: mongoose.Mixed,
      embedFooter: mongoose.Mixed,
      noWinner: String,
      winners: String,
      endedAt: String,
      hostedBy: String,
    },
    thumbnail: String,
    image: String,
    hostedBy: String,
    winnerIds: { type: [String], default: undefined },
    reaction: mongoose.Mixed,
    botsCanWin: Boolean,
    embedColor: mongoose.Mixed,
    embedColorEnd: mongoose.Mixed,
    exemptPermissions: { type: [], default: undefined },
    exemptMembers: String,
    bonusEntries: String,
    extraData: mongoose.Mixed,
    lastChance: {
      enabled: Boolean,
      content: String,
      threshold: Number,
      embedColor: mongoose.Mixed,
    },
    pauseOptions: {
      isPaused: Boolean,
      content: String,
      unPauseAfter: Number,
      embedColor: mongoose.Mixed,
      durationAfterPause: Number,
      infiniteDurationText: String,
    },
    isDrop: Boolean,
    allowedMentions: {
      parse: { type: [String], default: undefined },
      users: { type: [String], default: undefined },
      roles: { type: [String], default: undefined },
    },
  },
  { id: false }
);

// Create the model
const giveawayModel = mongoose.model("giveaways", giveawaySchema);

const { GiveawaysManager } = require("discord-giveaways");
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
  // This function is called when the manager needs to get all giveaways which are stored in the database.
  async getAllGiveaways() {
    // Get all giveaways from the database. We fetch all documents by passing an empty condition.
    return await giveawayModel.find().lean().exec();
  }

  // This function is called when a giveaway needs to be saved in the database.
  async saveGiveaway(messageId, giveawayData) {
    // Add the new giveaway to the database
    await giveawayModel.create(giveawayData);
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be edited in the database.
  async editGiveaway(messageId, giveawayData) {
    // Find by messageId and update it
    await giveawayModel.updateOne({ messageId }, giveawayData).exec();
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be deleted from the database.
  async deleteGiveaway(messageId) {
    // Find by messageId and delete it
    await giveawayModel.deleteOne({ messageId }).exec();
    // Don't forget to return something!
    return true;
  }
};

// Create a new instance of your new class
const manager = new GiveawayManagerWithOwnDatabase(client, {
  default: {
    botsCanWin: false,
    embedColor: "#F3BA2F",
    embedColorEnd: "#F3BA2F",
    reaction: "1081537798424764476",
  },
});
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;

client.giveawaysManager.on(
  "giveawayReactionAdded",
  (giveaway, member, reaction) => {
    member.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("<:Check:1081542275680698499> Giveaway Entry Confirmed")
          .setDescription(
            `Your entry for [this giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been confirmed.\n\n<:Invite:1081552291292794941> [Invite Squares](https://discord.com/api/oauth2/authorize?client_id=629323586930212884&permissions=1513376050423&scope=bot%20applications.commands) to your server.`
          )
          .setColor("#F3BA2F"),
      ],
    });
  }
);

client.login(process.env.TOKEN);
