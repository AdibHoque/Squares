const {SlashCommandBuilder} = require("@discordjs/builders");
const {MessageEmbed, UserFlags} = require("discord.js");

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

    const flags = person.flags.bitfield
    const flagarr = new UserFlags(flags).toArray()


    const embed = new MessageEmbed()
    .setAuthor(`${person.username}#${person.discriminator}`,person.avatarURL({ format: 'png', dynamic: true, size: 256 }))
    .setThumbnail(person.avatarURL({ format: 'png', dynamic: true, size: 512 }))
    .addField("Registered", person.createdAt.toLocaleString(), true)
    .addField("Joined At", member.joinedAt.toLocaleString(), true)
    .addField("User ID", person.id, true)
    .addField("Badges", flagarr.join(", "), true)
    .addField("Avatar", `[128px](${person.avatarURL({ format: 'png', dynamic: true, size: 128 })}) [256px](${person.avatarURL({ format: 'png', dynamic: true, size: 256 })}) [512px](${person.avatarURL({ format: 'png', dynamic: true, size: 512 })})`, true)
    .addField("Roles"+'['+memberRoles.length+']',memberRoles.join(", "))
    .setColor(`#ffbf00`)

    interaction.editReply({embeds: [embed]});
}

