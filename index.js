const { Client, GatewayIntentBits, Partials, ActivityType, EmbedBuilder } = require('discord.js');
const env = require('dotenv');
env.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], partials: [Partials.Channel] });

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOTOKEN);
const db = mongoose.connection;

require("./slash-register")(updateCommands=true)
let commands = require("./slash-register").commands;


client.on("ready", () => {
    console.log("Bot is online")
    let commands = client.application.commands;
    client.user.setPresence({
        activities: [{ name: `/help | ${client.guilds.cache.size} Guilds`, type: ActivityType.Playing }],
        status: 'online',
      });
});

client.on("error", e => {
    console.log(e);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

process.on('warning', console.warn);

client.on('interactionCreate', async interaction => {
    if(interaction.user.bot) return;
    if(interaction.isCommand()) {
    await interaction.deferReply();
    let name = interaction.commandName;
    let options = interaction.options;
    
    let commandMethod = commands.get(name);
    if(!commandMethod) return;

    commandMethod.run(client, interaction, options)
    }
})


// Check the connection
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB.');
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
            hostedBy: String
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
            embedColor: mongoose.Mixed
        },
        pauseOptions: {
            isPaused: Boolean,
            content: String,
            unPauseAfter: Number,
            embedColor: mongoose.Mixed,
            durationAfterPause: Number,
            infiniteDurationText: String
        },
        isDrop: Boolean,
        allowedMentions: {
            parse: { type: [String], default: undefined },
            users: { type: [String], default: undefined },
            roles: { type: [String], default: undefined }
        }
    },
    { id: false }
);

// Create the model
const giveawayModel = mongoose.model('giveaways', giveawaySchema);

const { GiveawaysManager } = require('discord-giveaways');
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
    forceUpdateEvery: 1000*60*60,
    default: {
        botsCanWin: false,
        embedColor: '#FF9900',
        embedColorEnd: '#FF9900',
        reaction: '1066347988647161907',
        lastChance: {
            enabled: true,
            content: '⚠️ **LAST CHANCE TO ENTER !** ⚠️',
            threshold: 20000,
            embedColor: '#FF0000'
        }
    }
});
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    member.send({embeds:[new EmbedBuilder().setTitle("<:Check:1063031741482291220> Giveaway Entry Confirmed").setDescription(`Your entry for [this giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been confirmed.\n\n<:Plus:1063031875360280646> [Invite ELECTRON](https://discord.com/api/oauth2/authorize?client_id=629323586930212884&permissions=1513376050423&scope=bot%20applications.commands) to your server.`).setColor("#FF9900")]})
});

client.login(process.env.TOKEN)
