const {SlashCommandBuilder} = require("discord.js");

module.exports.data = new SlashCommandBuilder()
.setName("kick")
.setDescription("Kick someone from your server.")
.addUserOption(option => option.setName("person").setDescription("The person to kick.").setRequired(true))
.addStringOption(option => option.setName("reason").setDescription("Reason for kicking."))


module.exports.run = (client,interaction,options) => {
    let permissions = interaction.member.permissions;
    if(!permissions.has("KICK_MEMBERS")) return interaction.editReply({content: "You need the KICK_MEMBERS permission to use this command."})

let member = options.getMember("person")
let reason = options.getString("reason") ? options.get("reason") : "No reason specified."

member.kick(reason).then(() => {
    interaction.editReply({content:`${member.displayName} was kicked. Reason\: ${reason}`})
}).catch(error => {
     console.log(error);
     interaction.editReply({content:"An unknown error occured! Please check if i have enough permissions or not."})
})
}