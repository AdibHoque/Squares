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
    name: "gdelete",
    category: "Giveaway",
    description: "Delete an ongoing Giveaway",
    required: "MANAGE_MESSAGES",
    usage: "/gdelete <Giveaway Message ID>"
}

module.exports.data = new SlashCommandBuilder()
.setName("gdelete")
.setDescription("Delete a giveaway!")
.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
.addStringOption(option => option.setName("giveaway_message_id").setDescription("Message ID of the giveaway you wanna delete.").setRequired(true))

module.exports.run = (client,interaction,options) => {
    const query = interaction.options.getString('giveaway_message_id'); 

client.giveawaysManager
.delete(query)
.then(() => {
    interaction.editReply({embeds:[successEmbed('Giveaway has been deleted!')]});
})
.catch((err) => {
    interaction.editReply({embeds:errorEmbed[(`${err}`)]});
});
}