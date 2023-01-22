const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");
const ms = require('ms');

function errorEmbed(text) {
    const embed = new EmbedBuilder().setDescription("<:Cross:1063031834713264128> "+text).setColor("#FF9900")
    return embed;
}

function successEmbed(text) {
    const embed = new EmbedBuilder().setDescription("<:Check:1063031741482291220> "+text).setColor("#FF9900")
    return embed;
}

module.exports.help = {
    name: "greroll",
    category: "Giveaway",
    description: "Reroll an ended Giveaway for new winners.",
    required: "MANAGE_MESSAGES",
    usage: "/greroll <Giveaway Message ID>"
}

module.exports.data = new SlashCommandBuilder()
.setName("greroll")
.setDescription("Reroll a giveaway for new winner!")
.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
.addStringOption(option => option.setName("giveaway_message_id").setDescription("Message ID of the giveaway you wanna reroll.").setRequired(true))

module.exports.run = (client,interaction,options) => {
    const query = interaction.options.getString('giveaway_message_id');
    const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === query) 

if (!giveaway) return interaction.editReply({embeds:[errorEmbed(`Unable to find a giveaway for \`${query}\`.`)]});

client.giveawaysManager
.reroll(query)
.then(() => {
    interaction.editReply({embeds:[successEmbed('Giveaway has been rerolled!')]});
})
.catch((err) => {
    interaction.editReply({embeds:errorEmbed[(`${err}`)]});
});
}