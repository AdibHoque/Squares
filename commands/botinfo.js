const {SlashCommandBuilder, EmbedBuilder, version} = require("discord.js");
const os = require("os")
const ms = require ("ms") 
ms(process.uptime()*1000, {long:true})

const cpus = os.cpus();
const cpu = cpus[0];
const total = Object.values(cpu.times).reduce(
    (acc, tv) => acc + tv, 0
);
const usage = process.cpuUsage();
const currentCPUUsage = (usage.user + usage.system) / 1000;
const perc = currentCPUUsage / total * 100;

module.exports.help = {
    name: "botinfo",
    category: "Utility",
    description: "Information about the Bot!",
    required: "None",
    usage: "/botinfo"
}

module.exports.data = new SlashCommandBuilder()
.setName("botinfo")
.setDescription("Information about the Bot!");

module.exports.run = async(client,interaction) => {
    const e = await Object.values(process.memoryUsage())
    const memUsage = e[0]+e[1]+e[2]+e[3]+e[4]

    const embed = new EmbedBuilder().setAuthor({name:"ELECTRON"}).addFields([
   {name:"🛠 Developer", value:`ADIB#8401`, inline:true},
   {name:"📟 Memory Usage", value: `${(memUsage/ 1024 / 1024).toFixed(2)} / 2000 MB`, inline:true},
   {name:"⏳ Uptime", value:ms(process.uptime()*1000, {long:true}), inline:true},
   {name:"👤 Users", value:`${client.users.cache.size}`, inline:true},
   {name:"🏠 Servers", value:`${client.guilds.cache.size}`, inline:true},
   {name:"#️⃣ Channels ", value:`${client.channels.cache.size}`, inline:true},
   {name:"📚 Library", value:`Discord.js v${version}`, inline:true},
   {name:"🗒 Node", value:`${process.version}`, inline:true},
   {name:"🤖 API Latency", value:`${client.ws.ping}ms`, inline:true},
   {name:"📊 CPU", value:`\`\`\`md\n${os.cpus().map(i => `${i.model}`)[0]}\`\`\``},
   {name:"🗂 CPU Usage", value:`\`${perc.toFixed(5)}%\``, inline:true},
   {name:"🔖 Arch", value:`\`${os.arch()}\``, inline:true},
   {name:"💻 Platform", value:`\`\`${os.platform()}\`\``, inline:true}]).setColor("#FF9900")
    interaction.editReply({embeds: [embed]})
}