const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require("discord.js");

module.exports.help = {
    name: "embed",
    category: "Moderation",
    description: "Create a custom embed",
    required: "MANAGE_MESSAGES",
    usage: "/embed <title> [author] [description] [thumbnail] [image URL]"
}

module.exports.data = new SlashCommandBuilder()
.setName("embed")
.setDescription("Create a custom Embed.")
.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
.addStringOption(option => option.setName("title").setDescription("Set title of the Embed.").setRequired(true))
.addStringOption(option => option.setName("author").setDescription("Set Author of the Embed."))
.addStringOption(option => option.setName("description").setDescription("Set description of the Embed."))
.addStringOption(option => option.setName("thumbnail").setDescription("Thumbnail URL of the embed."))
.addStringOption(option => option.setName("image").setDescription("Image URL of the Embed."))

module.exports.run = (client,interaction,options) => {
    let permissions = interaction.member.permissions.toArray();
    if(!permissions.includes("ManageMessages")) return interaction.editReply({embeds: [new EmbedBuilder().setDescription("<:Cross:1063031834713264128> You need the `ManageMessages` permission to use this command.").setColor("#FF9900")]})

    let title = options.getString("title");
    let author = options.getString("author");
    let description = options.getString("description");
    let thumbnail = options.getString("thumbnail");
    let image = options.getString("image");

    const embed = new EmbedBuilder().setTitle(title).setColor("#FF9900").setFooter({text: `Embed created by ${interaction.user.username}`})
    if(author) embed.setAuthor({name: author})
    if(description) embed.setDescription(description)
    if(thumbnail) embed.setThumbnail(thumbnail)
    if(image) embed.setImage(image)
    interaction.channel.send({embeds: [embed]});
    interaction.deleteReply().catch(console.error);

}
