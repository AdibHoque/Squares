const {SlashCommandBuilder} = require("discord.js");
const {EmbedBuilder} = require("discord.js");

module.exports.help = {
    name: "avatar",
    category: "Utility",
    description: "Enlarge user Avatar!",
    required: "None",
    usage: "/avatar [@user]"
}

module.exports.data = new SlashCommandBuilder()
.setName("avatar")
.setDescription("Check your or someones avatar.")
.addUserOption(option => option.setName("user").setDescription("The persons avatar you want."))

module.exports.run = (client,interaction,options) => {
    let person = options.getUser("user") ? options.getUser("person") : interaction.user
    if(!person.avatarURL()) {
        return interaction.editReply({ content: "That user does not have an avatar."})
    }
    const embed = new EmbedBuilder()
    .setTitle(`${person.username}#${person.discriminator}'s Avatar`)
    .setImage(person.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setColor(`#FF9900`)

    interaction.editReply({embeds: [embed]});
}