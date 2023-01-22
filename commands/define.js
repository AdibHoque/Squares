const {SlashCommandBuilder} = require("discord.js");
const {Discord, EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const {get} = require("request-promise-native");
var Filter = require('bad-words-plus');

module.exports.help = {
    name: "define",
    category: "General",
    description: "Get word definition from Urban Dictionary",
    required: "None",
    usage: "/define <word>"
}

module.exports.data = new SlashCommandBuilder()
.setName("define")
.setDescription("Search a word in urban dictionary.")
.addStringOption(option => option.setName("word").setDescription("The word or words you wanna define.").setRequired(true))


module.exports.run = async(client,interaction,options) => {
    let w = options.getString("word").trim().split(/ +/g);
    const words = w.join("+")

    let result = {
        url: "https://api.urbandictionary.com/v0/define?term="+words,
        json: true
        }        
        const body = await get(result)
        if(!body.list.length) return interaction.editReply("No definition for this word found!")
        
        let pages = []

        /*body.list.forEach(d => {    
                const embed = new EmbedBuilder().setTitle(new Filter({firstLetter: true, lastLetter: true}).clean(d.word)).setDescription(`@${d.author}`).setURL(d.permalink).addFields([{name: "Definition", value:"```" + new Filter({firstLetter: true, lastLetter: true}).clean(d.definition.substr(0, 1000)) + "```"}, {name: "Example", value:new Filter({firstLetter: true, lastLetter: true}).clean("```" +d.example.substr(0, 1000)) + "```"}]).setFooter({text:`Page ${body.list.indexOf(d)+1} of ${body.list.length} - ⬆️ ` + d.thumbs_up + ` | ` + `⬇️ ` + d.thumbs_down}).setColor(`#FF9900`);
            pages.push(embed)

        });*/
        body.list.forEach(d => {    
            const filter = new Filter({firstLetter: true, lastLetter: true})
            let wo = d.word
            let def = filter.clean(d.definition)
            let dstr = d.example.replace(`"`, "").replace(`"`, "")
            let exa = filter.clean(d.word+d.example).replace(d.word, "")
            const embed = new EmbedBuilder().setTitle(wo).setDescription(`@${d.author}`).setURL(d.permalink).addFields([{name: "Definition", value:"```" + def.substr(0, 1000) + "```"}, {name: "Example", value:"```" +exa.substr(0, 1000) + "```"}]).setFooter({text:`Page ${body.list.indexOf(d)+1} of ${body.list.length} - ⬆️ ` + d.thumbs_up + ` | ` + `⬇️ ` + d.thumbs_down}).setColor(`#FF9900`);
        pages.push(embed)

    });
        let currentpage = 0
        const embed = pages[currentpage]
        
        const row = new ActionRowBuilder()
.addComponents(
    [new ButtonBuilder().setEmoji("1062331837290119269").setStyle(1).setCustomId(`define-first`).setDisabled(true),
    new ButtonBuilder().setEmoji("1062331801395286116").setStyle(1).setCustomId(`define-previous`),
    new ButtonBuilder().setEmoji("1062331764003053578").setStyle(4).setCustomId(`define-delete`),
    new ButtonBuilder().setEmoji("1062331693429694545").setStyle(1).setCustomId(`define-next`),
    new ButtonBuilder().setEmoji("1062331656859566192").setStyle(1).setCustomId(`define-last`)]
)

        interaction.editReply({embeds: [embed],
        components: [row]})

        const filter = i => i.customId.startsWith("define") && i.user.id === interaction.user.id;

const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

collector.on('collect', async i => {
    if(i.customId.endsWith("delete")) {
        collector.stop("deleted");
        return interaction.deleteReply().catch(console.error);
    }
	if (i.customId.endsWith("previous")) {
        if(currentpage == 0) currentpage = body.list.length-1
        else currentpage = currentpage-1

        const row = new ActionRowBuilder()
.addComponents(
    [new ButtonBuilder().setEmoji("1062331837290119269").setStyle(1).setCustomId(`define-first`),
    new ButtonBuilder().setEmoji("1062331801395286116").setStyle(1).setCustomId(`define-previous`),
    new ButtonBuilder().setEmoji("1062331764003053578").setStyle(4).setCustomId(`define-delete`),
    new ButtonBuilder().setEmoji("1062331693429694545").setStyle(1).setCustomId(`define-next`),
    new ButtonBuilder().setEmoji("1062331656859566192").setStyle(1).setCustomId(`define-last`)
       ])
		await interaction.editReply({embeds: [pages[currentpage]], components: [row]})
        i.deferUpdate();
	}
    if (i.customId.endsWith("next")) {
        if(currentpage == body.list.length-1) currentpage = 0
        else currentpage = currentpage+1
        const row = new ActionRowBuilder()
        .addComponents(
            [new ButtonBuilder().setEmoji("1062331837290119269").setStyle(1).setCustomId(`define-first`),
            new ButtonBuilder().setEmoji("1062331801395286116").setStyle(1).setCustomId(`define-previous`),
            new ButtonBuilder().setEmoji("1062331764003053578").setStyle(4).setCustomId(`define-delete`),
            new ButtonBuilder().setEmoji("1062331693429694545").setStyle(1).setCustomId(`define-next`),
            new ButtonBuilder().setEmoji("1062331656859566192").setStyle(1).setCustomId(`define-last`)
               ])
		await interaction.editReply({embeds: [pages[currentpage]], components: [row]})
        i.deferUpdate();
	}
    if (i.customId.endsWith("first")) {
        if(currentpage == 0) return;
        else currentpage = 0;
        const row = new ActionRowBuilder()
        .addComponents(
            [new ButtonBuilder().setEmoji("1062331837290119269").setStyle(1).setCustomId(`define-first`).setDisabled(true),
            new ButtonBuilder().setEmoji("1062331801395286116").setStyle(1).setCustomId(`define-previous`),
            new ButtonBuilder().setEmoji("1062331764003053578").setStyle(4).setCustomId(`define-delete`),
            new ButtonBuilder().setEmoji("1062331693429694545").setStyle(1).setCustomId(`define-next`),
            new ButtonBuilder().setEmoji("1062331656859566192").setStyle(1).setCustomId(`define-last`)
               ])
		await interaction.editReply({embeds: [pages[currentpage]], components: [row]})
        i.deferUpdate();
	}
    if (i.customId.endsWith("last")) {
        if(currentpage == body.list.length-1) return;
        else currentpage = body.list.length-1;
        const row = new ActionRowBuilder()
        .addComponents(
            [new ButtonBuilder().setEmoji("1062331837290119269").setStyle(1).setCustomId(`define-first`),
            new ButtonBuilder().setEmoji("1062331801395286116").setStyle(1).setCustomId(`define-previous`),
            new ButtonBuilder().setEmoji("1062331764003053578").setStyle(4).setCustomId(`define-delete`),
            new ButtonBuilder().setEmoji("1062331693429694545").setStyle(1).setCustomId(`define-next`),
            new ButtonBuilder().setEmoji("1062331656859566192").setStyle(1).setCustomId(`define-last`).setDisabled(true)
               ])
		await interaction.editReply({embeds: [pages[currentpage]], components: [row]})
        i.deferUpdate();
	}
    else return;
});

collector.on('end', (collected, reason) => {
    if(reason && reason=="deleted") return;
    const row = new ActionRowBuilder()
        .addComponents(
            [new ButtonBuilder().setEmoji("1062331837290119269").setStyle(1).setCustomId(`define-first`).setDisabled(true),
            new ButtonBuilder().setEmoji("1062331801395286116").setStyle(1).setCustomId(`define-previous`).setDisabled(true),
            new ButtonBuilder().setEmoji("1062331764003053578").setStyle(4).setCustomId(`define-delete`).setDisabled(true),
            new ButtonBuilder().setEmoji("1062331693429694545").setStyle(1).setCustomId(`define-next`).setDisabled(true),
            new ButtonBuilder().setEmoji("1062331656859566192").setStyle(1).setCustomId(`define-last`).setDisabled(true)
               ])
    interaction.editReply({components: [row]})
});
};