const {SlashCommandBuilder} = require("discord.js");
const {Discord, EmbedBuilder, MessageAttachment} = require("discord.js");

module.exports.help = {
    name: "winratecalc",
    category: "Utility",
    description: "Calculate how many wins you need for reaching a certain Winrate.",
    required: "None",
    usage: "/winratecalc <current winrate> <total matches> <desired winrate>"
}

module.exports.data = new SlashCommandBuilder()
.setName("winratecalc")
.setDescription("Calcucate how many wins you need to reach desired Winrate.")
.addNumberOption(option => option.setName("current_winrate").setDescription("Your current winrate.").setRequired(true))
.addIntegerOption(option => option.setName("number_of_matches").setDescription("Number of matches you played.").setRequired(true))
.addNumberOption(option => option.setName("desired_winrate").setDescription("The Winrate you wanna reach.").setRequired(true))


module.exports.run = async(client,interaction,options) => {
    let currentwr = options.getNumber("current_winrate");
    let matches = options.getInteger("number_of_matches");
    let desiredwr = options.getNumber("desired_winrate");

const result = Math.round(matches*(desiredwr-currentwr)/(100-desiredwr))

    const embed = new EmbedBuilder()
    .setTitle("Winrate Calculator")
    .setDescription(`${currentwr} Winrate >> ${desiredwr}% Winrate (${matches} Matches)`)
    .addField("Wins Needed:", ""+result+"", false)
    .setColor("#FF9900")
    
    interaction.editReply({embeds:[embed]});
}