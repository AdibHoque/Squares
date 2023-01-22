const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");

module.exports.help = {
    name: "role",
    category: "Moderationn",
    description: "Toggle add or remove role from a Member.",
    required: "MANAGE_ROLES",
    usage: "/role <member ID or @member> <role>"
}

module.exports.data = new SlashCommandBuilder()
.setName("role")
.setDescription("Toggle Add/Remove Role from a Member.")
.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
.addUserOption(option => option.setName("member").setDescription("The Member you wanna Add/Remove role from.").setRequired(true))
.addRoleOption(option => option.setName("role").setDescription("The Role you wanna Add/Remove.").setRequired(true))


module.exports.run = (client,interaction,options) => {
    let permissions = interaction.member.permissions;
    if(!permissions.has("MANAGE_ROLES")) return interaction.editReply({content: "You need the MANAGE_ROLES permission to use this command."})

let member = options.getMember("member")
let role = options.getRole("role")

if(!member.roles.cache.has(role.id)) {
    member.roles.add(role);
    return interaction.editReply({content:`Changed Roles for ${member.user.tag}, +${role.name}`})
}
if(member.roles.cache.has(role.id)) {
    member.roles.remove(role);
    return interaction.editReply({content:`Changed Roles for ${member.user.tag}, -${role.name}`})
}

}