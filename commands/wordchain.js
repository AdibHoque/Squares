const {SlashCommandBuilder} = require("discord.js");
const {Discord, EmbedBuilder, MessageActionRow, MessageButton} = require("discord.js");
const {get} = require("request-promise-native");
const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
let minletters = 4

async function checkWord(word) {
    let result = {
        url: "https://en.wiktionary.org/w/api.php?action=parse&page="+word.toLowerCase()+"&prop=wikitext&format=json",
        json: true
        }        
        const body = await get(result);
        if(body.parse) return true;
        if(body.error) return false;

}

module.exports.data = new SlashCommandBuilder()
.setName("wordchain")
.setDescription("Play Wordchain Game!");

module.exports.run = (client,interaction) => {
    const startletter = letters[Math.floor(Math.random()*letters.length)];
    const embed = new EmbedBuilder()
    .setDescription('Send a message with an English word following the criteria:')
    .addFields([{name:'Starting Letter', value:startletter}, {name:'Minimum Word Length', value:""+minletters}, {name:'Time Left' , value:'30 Seconds'}])
    .setColor("#ffbf00")
    interaction.editReply({embeds: [embed]})

    const filter = m => m.author.id==interaction.user.id;
    const collector = interaction.channel.createMessageCollector({filter, time: 30_000 });

collector.on('collect', async m => {
	if(m.content.length > 0 && m.content.length < minletters) {
        const embed = new EmbedBuilder()
        .setDescription(`__**${m.content.toUpperCase()}**__ is incorrect.\n**Reason:** ${m.content.length} Characters.`)
        .addFields([{name:"Criteria:", value:`Minimum Characters: **${minletters}**\nStarting Letter: **${startletter}**`}])
    return m.reply({embeds: [embed]})
}
    if(m.content && !m.content.toLowerCase().startsWith(startletter.toLowerCase())) {
        const embed = new EmbedBuilder()
        .setDescription(`__**${m.content.toUpperCase()}**__ is incorrect.\n**Reason:** Doesn't start with letter ${startletter}.`)
        .addFields([{name:"Criteria:", value:`Minimum Characters: **${minletters}**\nStarting Letter: **${startletter}**`}])
    return m.reply({embeds: [embed]})
}   
    if(m.content.length > 0 && !m.content.length < minletters && m.content.toLowerCase().startsWith(startletter.toLowerCase())) {
    let word = m.content.trim().split(/ +/g);
    let words = word.join("");
    const w = await checkWord(words);

    if(w==false) {
        const embed = new EmbedBuilder()
        .setDescription(`__**${m.content.toUpperCase()}**__ is incorrect.\n**Reason:** Word doesn't exist in [Wiktionary](https://en.wiktionary.org/).`)
        .addFields([{name:"Criteria:", value:`Minimum Characters: **${minletters}**\nStarting Letter: **${startletter}**`}])
    return m.reply({embeds: [embed]})
    }

    if(w==true) {
        const embed = new EmbedBuilder()
        .setDescription(`__**${m.content.toUpperCase()}**__ is correct.`)
    return m.reply({embeds: [embed]})
    } 

}
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} items`);
});


}