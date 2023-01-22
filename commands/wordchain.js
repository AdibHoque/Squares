const {SlashCommandBuilder} = require("discord.js");
const {Discord, EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const {get} = require("request-promise-native");
const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
let minletters = 4
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports.help = {
    name: "wordchain",
    category: "Entertainment",
    description: "Play a game of wordchain with upto 10 people.",
    required: "None",
    usage: "/wordchain"
}

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

function nextPlayer(players, currentplayer){
    const n = players.indexOf(currentplayer);
    let np = players[n+1]
    if(players.length === n+1) np = players[0];
    if(n+1 > players.length) np = players[n+1];
    return np;
}

function isLastPlayer(players, currentplayer){
    const n = players.indexOf(currentplayer);
    if(players.length === n+1) return true;
    else return false;
}

async function start(interaction, currentplayer, startletter, minletters, players, duration){
    let timeleft = Math.floor((Date.now() / 1000))+duration
    const embed = new EmbedBuilder()
    .setDescription('Send a message with an English word following the criteria:')
    .addFields([{name:'Starting Letter:', value:startletter}, {name:'Minimum Word Length:', value:""+minletters}, {name:'Time Left:' , value:`${timeleft-Math.floor((Date.now() / 1000))} Seconds`}])
    .setColor("#FF9900")
    interaction.followUp({content:`<@${currentplayer}>`, embeds: [embed]})

    const filter = m => m.author.id==currentplayer;
    const collector = interaction.channel.createMessageCollector({filter, time: 30_000 });

collector.on('collect', async m => {
    const wc = await db.get(`wc${interaction.channelId}`)
    let usedwords = wc.usedWords ? wc.usedWords : [];
    let longestword = wc.longestword ? wc.longestword : "word";
	if(m.content.length > 0 && m.content.length < minletters) {
        const embed = new EmbedBuilder()
        .setDescription(`__**${m.content.toUpperCase()}**__ is incorrect.\n**Reason:** ${m.content.length} Characters.`)
        .addFields([{name:"Criteria:", value:`Minimum Characters: **${minletters}**\nStarting Letter: **${startletter}**`}, {name:"Time Left:", value:`${timeleft-Math.floor((Date.now() / 1000))} Seconds`}])
        .setColor("#FF0000")
        return m.reply({embeds: [embed]})
}
    if(m.content && !m.content.toLowerCase().startsWith(startletter.toLowerCase())) {
        const embed = new EmbedBuilder()
        .setDescription(`__**${m.content.toUpperCase()}**__ is incorrect.\n**Reason:** Doesn't start with letter ${startletter}.`)
        .addFields([{name:"Criteria:", value:`Minimum Characters: **${minletters}**\nStarting Letter: **${startletter}**`}, {name:"Time Left:", value:`${timeleft-Math.floor((Date.now() / 1000))} Seconds`}])
        .setColor("#FF0000")
        return m.reply({embeds: [embed]})
}   
    if(m.content.length > 0 && !m.content.length < minletters && m.content.toLowerCase().startsWith(startletter.toLowerCase())) {
    let word = m.content.trim().split(/ +/g);
    let words = word.join("");
    const w = await checkWord(words);
    
    if(usedwords.includes(words.toLowerCase())) {
        const embed = new EmbedBuilder()
        .setDescription(`__**${m.content.toUpperCase()}**__ is incorrect.\n**Reason:** Word has already been used once.`)
        .addFields([{name:"Criteria:", value:`Minimum Characters: **${minletters}**\nStarting Letter: **${startletter}**`}, {name:"Time Left:", value:`${timeleft-Math.floor((Date.now() / 1000))} Seconds`}])
        .setColor("#FF0000")
        return m.reply({embeds: [embed]})
    }

    if(w==false) {
        const embed = new EmbedBuilder()
        .setDescription(`__**${words.toUpperCase()}**__ is incorrect.\n**Reason:** Word doesn't exist in [Wiktionary](https://en.wiktionary.org/).`)
        .addFields([{name:"Criteria:", value:`Minimum Characters: **${minletters}**\nStarting Letter: **${startletter}**`}, {name:"Time Left:", value:`${timeleft-Math.floor((Date.now() / 1000))} Seconds`}])
        .setColor("#FF0000")
        return m.reply({embeds: [embed]})
    }

    if(w==true) {
        m.react('1063031741482291220');
        await db.push(`wc${interaction.channelId}.usedWords`, words.toLowerCase())
        if(words.length > longestword.length) await db.set(`wc${interaction.channelId}.longestword`, words)
        startletter = words.slice(-1).toUpperCase()
        return collector.stop("correct")
    } 

}
});

collector.on('end', async(collected, reason) => {
	if(reason && reason==="correct") {
        let duration = 30
        const nextplayer = nextPlayer(players, currentplayer)
        const endOfRound = isLastPlayer(players, currentplayer)
        if(endOfRound && minletters < 11) minletters = minletters+1
        if(minletters > 8) duration = 20
        await db.set(`wc${interaction.channelId}.lastUpdate`, Date.now())
    return start(interaction, nextplayer, startletter, minletters, players, duration)
    }
    if(reason && reason==="time") {
        if(players.length == 2) {
            const nextplayer = nextPlayer(players, currentplayer)
            const embed = new EmbedBuilder()
            .setTitle("Time Out!")
            .setDescription(`<@${currentplayer}> couldn't send a correct word within time.`)
            .addFields([{name: "Eliminated Player:", value:`<@${currentplayer}>`}, {name: "Next Player:", value: `<@${nextplayer}>`}])
            .setColor("#FF0000")
            interaction.channel.send({embeds: [embed]})

            var result = arrayRemove(players, currentplayer);
            players = result;
            const wc = await db.get(`wc${interaction.channelId}`)
            let lw = wc.longestword ? wc.longestword : "word"
            const embed2 = new EmbedBuilder()
            .setTitle("Game Over!")
            .setDescription(`Congrats! We have a winner!`)
            .addFields([{name: "Winner:", value:`<@${players[0]}>`}, {name: "Longest Word:", value: lw}])
            .setThumbnail("https://media.discordapp.net/attachments/656517276832366595/1065986660455682178/1674221332444.png")
            .setColor("#FF9900")
            await db.delete(`wc${interaction.channelId}`)
            return interaction.channel.send({embeds: [embed2]})
        }
        const nextplayer = nextPlayer(players, currentplayer)
        const embed = new EmbedBuilder()
        .setTitle("Time Out!")
        .setDescription(`<@${currentplayer}> couldn't send a correct word within time.`)
        .addFields([{name: "Eliminated Player:", value:`<@${currentplayer}>`}, {name: "Next Player:", value: `<@${nextplayer}>`}])
        .setColor("#FF0000")
        interaction.channel.send({embeds: [embed]})
        var result = arrayRemove(players, currentplayer);
        players = result;
        await db.set(`wc${interaction.channelId}.lastUpdate`, Date.now())
        if(minletters > 8) duration = 20
        return start(interaction, nextplayer, startletter, minletters, players, duration)

    }
});
}

module.exports.data = new SlashCommandBuilder()
.setName("wordchain")
.setDescription("Play Wordchain Game!");

module.exports.run = async(client,interaction) => {
    const wc = await db.get(`wc${interaction.channelId}`);
    if(wc && Date.now()-wc.lastUpdate < 35000) {
        const embed = new EmbedBuilder().setDescription("<:Cross:1063031834713264128> **Wordchain is being played in this channel already.**").setColor("#FF9900")
        return interaction.editReply({embeds: [embed]});
    }

    await db.set(`wc${interaction.channelId}`, {lastUpdate: Date.now(), usedWords: [], longestword: "word"})
     let players = [];

     const row = new ActionRowBuilder()
     .addComponents([new ButtonBuilder().setLabel("Yes! Join Game!").setStyle(1).setCustomId(`join`)])
     const embed = new EmbedBuilder()
     .setTitle("Join Wordchain Game!")
     .setDescription(`<@${interaction.user.id}> is starting a Wordchain game!\nYou may join to start playing together.`)
     .addFields([{name: "How to join?", value: "Tap on the button below to join."}, {name: "Time left", value: "30 Seconds"}])
     .setColor("#FF9900")
     interaction.editReply({embeds: [embed], components: [row]})

     players.push(interaction.user.id);
     const filter = i => i.customId == "join" 
     const collector = interaction.channel.createMessageComponentCollector({filter, time: 30_000 });
collector.on('collect', i => { 
    i.deferUpdate();
    if(players.includes(i.user.id)) {
        const embed = new EmbedBuilder().setDescription(`<@${i.user.id}> You have already joined the game!`);
        interaction.followUp({ embeds: [embed]})
    }
    if(!players.includes(i.user.id) && !i.user.bot && players.length < 11) {
        players.push(i.user.id);
        const embed = new EmbedBuilder().setDescription(`<@${i.user.id}> has joined the game!`);
        const row = new ActionRowBuilder()
        .addComponents([new ButtonBuilder().setLabel("Lemme join too!").setStyle(1).setCustomId(`join`), new ButtonBuilder().setLabel(`Participants: ${players.length}`).setStyle(2).setCustomId(`p`).setDisabled(true)])
        interaction.followUp({ embeds: [embed], components: [row]})
    }
    if(!players.includes(i.user.id) && players.length === 10) {
        const embed = new EmbedBuilder().setDescription(`Maximum player limit reached!`);
        interaction.followUp({ embeds: [embed] })
    }
})
collector.on('end', async collected => {
    if(!players[1]) {
        await db.delete(`wc${interaction.channelId}`)
        const e = new EmbedBuilder().setDescription("<:Cross:1063031834713264128> **None joined within the time limit.**").setColor("#FF9900")
        return interaction.channel.send({ embeds: [e]}) 
    }
    let p = [];
    players.forEach(r => {
        p.push(`**${players.indexOf(r)+1}.** <@${r}>`)
        })
    const embed = new EmbedBuilder().setTitle("The game is about to start!").addFields([{name:"Participants:", value:p.join("\n")}]).setColor("#FF9900")
    interaction.channel.send({ embeds: [embed] })
    let startletter = letters[Math.floor(Math.random()*letters.length)];
    let duration = 30
    start(interaction, players[0], startletter, minletters, players, duration)
    await db.set(`wc${interaction.channelId}`, {lastUpdate: Date.now(), usedWords:[], longestword:""})
});



}