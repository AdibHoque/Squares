const {SlashCommandBuilder} = require("discord.js");
const {Discord, EmbedBuilder, AttachmentBuilder} = require("discord.js");
const Canvas = require("canvas");


module.exports.data = new SlashCommandBuilder()
.setName("color")
.setDescription("Get visual color image from an hex code.")
.addStringOption(option => option.setName("color").setDescription("Hex code of a color e.g. #FFBF00").setRequired(true))


module.exports.run = async(client,interaction,options) => {
    let hex = options.getString("color");
    if(!hex.startsWith('#')) hex = "#"+hex

    const canvas = Canvas.createCanvas(300, 200);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = hex;
    ctx.fillRect(0, 00, 300, 200);

    const attachment = new AttachmentBuilder(canvas.toBuffer(),'color.png'); 

    const embed = new EmbedBuilder()
    .setTitle(hex.toUpperCase())
    .setColor(hex)
    .setImage('attachment://color.png')

    interaction.editReply({embeds:[embed], files: [attachment]});
}