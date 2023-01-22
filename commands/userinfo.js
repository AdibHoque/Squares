const {SlashCommandBuilder} = require("discord.js");
const {EmbedBuilder, UserFlagsBitField} = require("discord.js");

module.exports.help = {
    name: "userinfo",
    category: "General",
    description: "Get information about a user.",
    required: "None",
    usage: "/userinfo <user>"
}

module.exports.data = new SlashCommandBuilder()
.setName("userinfo")
.setDescription("Get info about a user.")
.addUserOption(option => option.setName("user").setDescription("The users info you want.").setRequired(true))

module.exports.run = async(client,interaction,options) => {
    let person = options.getUser("user");
    const member = await interaction.guild.members.fetch(person.id);
    let memberRoles = [];

    member.roles.cache.forEach(r => {
        memberRoles.push(r.toString());
    })

    const flags = person.flags
    const flagarr = new UserFlagsBitField(flags).toArray()
    const badges = flagarr[0] ? flagarr.join(", ") : "None"

    const embed = new EmbedBuilder()
    .setAuthor({name: `${person.username}#${person.discriminator}`, iconURL: person.avatarURL({ format: 'png', dynamic: true, size: 256 })})
    .setThumbnail(person.avatarURL({ format: 'png', dynamic: true, size: 512 }))
    .addFields([{name: "Registered", value: person.createdAt.toLocaleString(), inline:true}, {name: "Joined At", value: member.joinedAt.toLocaleString(), inline:true}, {name: "User ID", value: person.id, inline:true}, {name: "Badges", value: badges, inline:true}, {name: "Avatar", value: `[128px](${person.avatarURL({ format: 'png', dynamic: true, size: 128 })}) [256px](${person.avatarURL({ format: 'png', dynamic: true, size: 256 })}) [512px](${person.avatarURL({ format: 'png', dynamic: true, size: 512 })})`, inline:true}, {name: "Roles"+'['+memberRoles.length+']', value: memberRoles.join(", "), inline:true}])
    .setColor(`#FF9900`)

    interaction.editReply({embeds: [embed]});
}

