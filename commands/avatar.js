const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports.data = new SlashCommandBuilder()
.setName("avatar")
.setDescription("Check your or someones avatar.")
.addUserOption(option => option.setName("person").setDescription("The persons avatar you want."))

module.exports.run = (client,interaction,options) => {
    let person = options.getUser("person") ? options.getUser("person") : interaction.user
    if(!person.avatarURL()) {
        return interaction.editReply({ content: "That user does not have an avatar."})
    }
    const embed = new MessageEmbed()
    .setTitle(`${person.username}#${person.discriminator}'s Avatar`)
    .setImage(person.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
    .setColor(`#ffbf00`)

    interaction.editReply({embeds: [embed]});
}