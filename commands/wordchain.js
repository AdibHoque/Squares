const {SlashCommandBuilder} = require("discord.js");
const {Discord, EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const {get} = require("request-promise-native");
const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
let minletters = 4


function arrayRemove(arr, value) { 
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

async function checkWord(word) {
    let result = {
        url: "https://en.wiktionary.org/w/api.php?action=parse&page="+word.toLowerCase()+"&prop=wikitext&format=json",
        json: true
        }        
        const body = await get(result);
        if(body.parse) return true;
        if(body.error) return false;
}

function increaseMinletter(){
    if(!minletters > 10) minletters+1
}

function nextPlayer(players, currentplayer){
    const n = players.indexOf(currentplayer);
    let np = players[n+1]
    if(players.length === n+1) np = players[0];
    if(n+1 > players.length) np = players[n+1];
    return np;

}

function start(interaction, currentplayer, startletter, minletters, players, duration){
    let timeleft = Math.floor((Date.now() / 1000))+duration
    const embed = new EmbedBuilder()
    .setDescription('Send a message with an English word following the criteria:')
    .addFields([{name:'Starting Letter:', value:startletter}, {name:'Minimum Word Length:', value:""+minletters}, {name:'Time Left:' , value:`${timeleft-Math.floor((Date.now() / 1000))} Seconds`}])
    .setColor("#ffbf00")
    interaction.followUp({content:`<@${currentplayer}>`, embeds: [embed]})

    const filter = m => m.author.id==currentplayer;
    const collector = interaction.channel.createMessageCollector({filter, time: 30_000 });

collector.on('collect', async m => {
	if(m.content.length > 0 && m.content.length < minletters) {
        const embed = new EmbedBuilder()
        .setDescription(`__**${m.content.toUpperCase()}**__ is incorrect.\n**Reason:** ${m.content.length} Characters.`)
        .addFields([{name:"Criteria:", value:`Minimum Characters: **${minletters}**\nStarting Letter: **${startletter}**`}, {name:"Time Left:", value:`${timeleft-Math.floor((Date.now() / 1000))} Seconds`}])
    return m.reply({embeds: [embed]})
}
    if(m.content && !m.content.toLowerCase().startsWith(startletter.toLowerCase())) {
        const embed = new EmbedBuilder()
        .setDescription(`__**${m.content.toUpperCase()}**__ is incorrect.\n**Reason:** Doesn't start with letter ${startletter}.`)
        .addFields([{name:"Criteria:", value:`Minimum Characters: **${minletters}**\nStarting Letter: **${startletter}**`}, {name:"Time Left:", value:`${timeleft-Math.floor((Date.now() / 1000))} Seconds`}])
    return m.reply({embeds: [embed]})
}   
    if(m.content.length > 0 && !m.content.length < minletters && m.content.toLowerCase().startsWith(startletter.toLowerCase())) {
    let word = m.content.trim().split(/ +/g);
    let words = word.join("");
    const w = await checkWord(words);

    if(w==false) {
        const embed = new EmbedBuilder()
        .setDescription(`__**${m.content.toUpperCase()}**__ is incorrect.\n**Reason:** Word doesn't exist in [Wiktionary](https://en.wiktionary.org/).`)
        .addFields([{name:"Criteria:", value:`Minimum Characters: **${minletters}**\nStarting Letter: **${startletter}**`}, {name:"Time Left:", value:`${timeleft-Math.floor((Date.now() / 1000))} Seconds`}])
    return m.reply({embeds: [embed]})
    }

    if(w==true) {
        const embed = new EmbedBuilder()
        .setDescription(`__**${m.content.toUpperCase()}**__ is correct.`)
        startletter = m.content.toUpperCase().slice(-1);
        await m.reply({embeds: [embed]})
        return collector.stop("correct")
    } 

}
});

collector.on('end', (collected, reason) => {
    console.log(reason)
	if(reason && reason==="correct") {
        const duration = 30
        const nextplayer = nextPlayer(players, currentplayer)
    return start(interaction, nextplayer, startletter, minletters, players, duration)
    }
    if(reason && reason==="time") {
        if(players.length == 2) {
            const nextplayer = nextPlayer(players, currentplayer)
            const embed = new EmbedBuilder()
            .setTitle("Time Out!")
            .setDescription(`<@${currentplayer}> couldn't send a correct word within time.`)
            .addFields([{name: "Eliminated Player:", value:`<@${currentplayer}>`}, {name: "Next Player:", value: `<@${nextplayer}>`}])
            interaction.channel.send({embeds: [embed]})

            var result = arrayRemove(players, currentplayer);
            players = result;
            const embed2 = new EmbedBuilder()
            .setTitle("Game Over!")
            .setDescription(`Congrats! We have a winner!`)
            .addFields([{name: "Winner:", value:`<@${players[0]}>`}])
            return interaction.channel.send({embeds: [embed2]})
        }
        const nextplayer = nextPlayer(players, currentplayer)
        const embed = new EmbedBuilder()
        .setTitle("Time Out!")
        .setDescription(`<@${currentplayer}> couldn't send a correct word within time.`)
        .addFields([{name: "Eliminated Player:", value:`<@${currentplayer}>`}, {name: "Next Player:", value: `<@${nextplayer}>`}])
        interaction.channel.send({embeds: [embed]})
        var result = arrayRemove(players, currentplayer);
        players = result;
        return start(interaction, nextplayer, startletter, minletters, players, duration)

    }
});
}

module.exports.data = new SlashCommandBuilder()
.setName("wordchain")
.setDescription("Play Wordchain Game!");

module.exports.run = (client,interaction) => {
     let players = [];

     const row = new ActionRowBuilder()
     .addComponents([new ButtonBuilder().setLabel("Yes! Join Game!").setStyle(1).setCustomId(`join`)])
     const embed = new EmbedBuilder()
     .setTitle("Join Wordchain Game!")
     .setDescription(`<@${interaction.user.id}> is starting a Wordchain game!\nYou may join to start playing together.`)
     .addFields([{name: "How to join?", value: "Tap on the button below to join."}])
     .setColor("#ffbf00")
     interaction.editReply({embeds: [embed], components: [row]})

     players.push(interaction.user.id);
     const filter = i => i.customId == "join" 
     const collector = interaction.channel.createMessageComponentCollector({filter, time: 15_000 });
collector.on('collect', i => { 
    i.deferUpdate();
    if(players.includes(i.user.id)) {
        const embed = new EmbedBuilder().setDescription(`<@${i.user.id}> You have already joined the game!`);
        interaction.followUp({ embeds: [embed], ephemeral: true })
    }
    if(!players.includes(i.user.id) && !i.user.bot && players.length < 11) {
        players.push(i.user.id);
        const embed = new EmbedBuilder().setDescription(`<@${i.user.id}> has joined the game!`);
        const row = new ActionRowBuilder()
        .addComponents([new ButtonBuilder().setLabel("Lemme join too!").setStyle(1).setCustomId(`join`), new ButtonBuilder().setLabel(`Participants: ${players.length}`).setStyle(2).setCustomId(`p`).setDisabled(true)])
        interaction.followUp({ embeds: [embed], components: [row]})
    }
})
collector.on('end', collected => {
    interaction.channel.send(`Total players: ${players.length}\nIDs: <@${players.join(">, <@")}>`)
    let startletter = letters[Math.floor(Math.random()*letters.length)];
    let duration = 30
    start(interaction, players[0], startletter, minletters, players, duration)
    console.log(`Collected ${collected.size} items`)
});



}