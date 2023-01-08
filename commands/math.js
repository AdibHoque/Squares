const {Discord, EmbedBuilder, SlashCommandBuilder} = require("discord.js");
const math = require("mathjs");


module.exports.data = new SlashCommandBuilder()
.setName("math")
.setDescription("Evaluates your math inputs.")
.addStringOption(option => option.setName("input").setDescription("The math input you want evaluation of.").setRequired(true))


module.exports.run = async(client,interaction,options) => {
    let inputs = options.getString("input");

    let resp;
    try {
      resp = math.evaluate(inputs);
    } catch (e) {
        resp = "Math ERROR"
      throw e;
    }
    const embed = new EmbedBuilder()
    .addFields([{name:'Input', value:'```'+inputs+'```'}, {name: 'Output', value:"```"+resp+"```"}])
    .setColor("#ffbf00")

    interaction.editReply({embeds:[embed]})
}