const {SlashCommandBuilder} = require("discord.js");
const {Discord, EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const {get} = require("request-promise-native");

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
        if(!body.list.length) return interaction.editReply("No defination for this word found!")
        
        let pages = []
        let buttons = []   

        body.list.forEach(d => {    
                const embed = new EmbedBuilder().setTitle(d.word).setDescription(`By @${d.author}`).setURL(d.permalink).addFields([{name: "Definition", value:"```" + d.definition.substr(0, 1000) + "....```"}, {name: "Example", value:"```" + d.example + "```"}]).setFooter({text:`Page ${body.list.indexOf(d)+1} of ${body.list.length} - 👍` + d.thumbs_up + ` | ` + `👎` + d.thumbs_down}).setColor(`#FFBF00`);
            pages.push(embed)

        });
        let currentpage = 0
        const embed = pages[currentpage]
        
        const row = new ActionRowBuilder()
.addComponents(
    [new ButtonBuilder().setLabel("Previous").setStyle(1).setCustomId(`define-previous`),
    new ButtonBuilder().setLabel("Next").setStyle(1).setCustomId(`define-next`)

       ]
)

        interaction.editReply({embeds: [embed],
        components: [row]})

        const filter = i => i.customId.startsWith("define") && i.user.id === interaction.user.id;

const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

collector.on('collect', async i => {
	if (i.customId.endsWith("previous")) {
        if(currentpage == 0) currentpage = body.list.length-1
        else currentpage = currentpage-1

        const row = new ActionRowBuilder()
.addComponents(
    [new ButtonBuilder().setLabel("Previous").setStyle(1).setCustomId(`define-previous`),
    new ButtonBuilder().setLabel("Next").setStyle(1).setCustomId(`define-next`)
       ])
		await interaction.editReply({embeds: [pages[currentpage]], components: [row]})
        i.deferUpdate();
	}
    if (i.customId.endsWith("next")) {
        if(currentpage == body.list.length-1) currentpage = 0
        else currentpage = currentpage+1
        const row = new ActionRowBuilder()
        .addComponents(
            [new ButtonBuilder().setLabel("Previous").setStyle(1).setCustomId(`define-previous`),
            new ButtonBuilder().setLabel("Next").setStyle(1).setCustomId(`define-next`)
               ])
		await interaction.editReply({embeds: [pages[currentpage]], components: [row]})
        i.deferUpdate();
	}
    else return;
});

collector.on('end', collected => {
    const row = new ActionRowBuilder()
        .addComponents(
            [new ButtonBuilder().setLabel("Previous").setStyle(1).setCustomId(`define-previous`).setDisabled(true),
            new ButtonBuilder().setLabel("Next").setStyle(1).setCustomId(`define-next`).setDisabled(true)
               ])
    interaction.editReply({components: [row]})
});
};