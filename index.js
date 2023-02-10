const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
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
      .setColor(`#FF9900`);
    c.send({ embeds: [embed] });
  });
});

client.on("messageUpdate", (oldMessage, newMessage) => {
  let message = oldMessage;
  if (message.author.bot) return;
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
      .setColor(`#FF9900`);
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
  console.log("member update");
  console.log(`${oldMember.roles.cache.size} - ${newMember.roles.cache.size}`);
  console.log(`${oldMember.nickname} - ${newMember.nickname}`);
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
      console.log("role added");
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
        .setColor(`#FF9900`);
      c.send({ embeds: [embed] });
    }

    if (newMember.roles.cache.size < oldMember.roles.cache.size) {
      console.log("role removed");
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
        .setColor(`#FF9900`);
      c.send({ embeds: [embed] });
    }

    if (!(oldMember.nickname === newMember.nickname)) {
      console.log("nickname updated");
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
        .setColor(`#FF9900`);
      c.send({ embeds: [embed] });
    }
  });
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
  forceUpdateEvery: 1000 * 60 * 60,
  default: {
    botsCanWin: false,
    embedColor: "#FF9900",
    embedColorEnd: "#FF9900",
    reaction: "1066347988647161907",
    lastChance: {
      enabled: true,
      content: "⚠️ **LAST CHANCE TO ENTER !** ⚠️",
      threshold: 20000,
      embedColor: "#FF0000",
    },
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
          .setTitle("<:Check:1063031741482291220> Giveaway Entry Confirmed")
          .setDescription(
            `Your entry for [this giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been confirmed.\n\n<:Plus:1063031875360280646> [Invite ELECTRON](https://discord.com/api/oauth2/authorize?client_id=629323586930212884&permissions=1513376050423&scope=bot%20applications.commands) to your server.`
          )
          .setColor("#FF9900"),
      ],
    });
  }
);

client.login(process.env.TOKEN);
