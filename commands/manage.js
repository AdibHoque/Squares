const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");

module.exports.data = new SlashCommandBuilder()
.setName("manage")
.setDescription("just checking")
.addStringOption(option => option.setName("word").setDescription("select something").addChoices({name:"hi",value:"hello"},{name:"hm",value:"hmmmm"}))

module.exports.run = (client,interaction,options) => {
//     let permissions = interaction.member.permissions;
//     if(!permissions.has("MANAGE_MESSAGES")) return interaction.editReply({content: "You need the MANAGE_MESSAGES permission to use this command."})

// let member = options.getMember("person");

// let embed = new MessageEmbed()
// .setTitle(`Manage ${member.user.tag}`)
// .setDescription("Click buttons below to manage")
// .setColor("#ffbf00")

// const row = new MessageActionRow()
// .addComponents(
//     [
//     new MessageButton().setLabel("Kick").setStyle("DANGER").setCustomId(`manage-${interaction.member.id}-kick-${member.id}`),
//     new MessageButton().setLabel("Ban").setStyle("DANGER").setCustomId(`manage-${interaction.member.id}-ban-${member.id}`)
// ]
// )

return interaction.editReply({
    content: "hmm"
})
}

// module.exports.button = (client, interaction, member, action) => {
//    if(action == "kick") {
//        member.kick();
//        return interaction.editReply({
//            content: "Success",
//            ephemeral: true
//        })
//    } else if(action == "ban") {
//     member.ban();
//     return interaction.editReply({
//         content: "Success",
//         ephemeral: true
//     })
// }
// }