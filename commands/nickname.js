const {SlashCommandBuilder} = require("discord.js");

module.exports.data = new SlashCommandBuilder()
.setName("nickname")
.setDescription("Change nickname of a Member.")
.addUserOption(option => option.setName("member").setDescription("The Member you wanna change Nickname of.").setRequired(true))
.addStringOption(option => option.setName("nickname").setDescription("The new Nickname.").setRequired(true))


module.exports.run = (client,interaction,options) => {
    let permissions = interaction.member.permissions;
    if(!permissions.has("MANAGE_NICKNAMES")) return interaction.editReply({content: "You need the MANAGE_NICKNAMES permission to use this command."})

let member = options.getMember("member")
let nickname = options.getString("nickname")

    member.setNickname(nickname);
    return interaction.editReply({content:`Successfully changed nickname of ${member.user.tag}!`})

}