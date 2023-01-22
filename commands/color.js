const {SlashCommandBuilder} = require("discord.js");
const {Discord, EmbedBuilder, AttachmentBuilder} = require("discord.js");
const Canvas = require("canvas");
var regex = /\b[0-9A-Fa-f]{6}\b/gi; 

module.exports.help = {
    name: "color",
    category: "General",
    description: "Get visual color image from an HEX code.",
    required: "None",
    usage: "/color <HEX code>"
}

module.exports.data = new SlashCommandBuilder()
.setName("color")
.setDescription("Get visual color image from an hex code.")
.addStringOption(option => option.setName("color").setDescription("Hex code of a color e.g. #FF9900").setRequired(true))


module.exports.run = async(client,interaction,options) => {
    let hex = options.getString("color");
    if(hex.startsWith('#')) hex = hex.replace("#", "");

    if (!hex.match(regex) ){
        return interaction.editReply({content: "<:Cross:1062297836227674122> Invalid Hex Code."})
    }

    const canvas = Canvas.createCanvas(300, 200);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#"+hex;
    ctx.fillRect(0, 00, 300, 200);

    const attachment = new AttachmentBuilder(canvas.toBuffer(),'color.png'); 

    /*const embed = new EmbedBuilder()
    .setTitle(hex.toUpperCase())
    .setImage('attachment://color.png')
    .setColor(hex)*/

    interaction.editReply({content: hex, files: [attachment]});
}