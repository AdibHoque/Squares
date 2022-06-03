const {SlashCommandBuilder} = require("@discordjs/builders");
const {Discord, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
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
            const embed = new MessageEmbed().setTitle(d.word).setDescription(`By ${d.author}`).setURL(d.permalink).addField("Definition", "```" + d.definition.substr(0, 1000) + "....```").addField("Example", "```" + d.example + "```").setFooter(`Page ${body.list.indexOf(d)+1} of ${body.list.length} - 👍` + d.thumbs_up + ` | ` + `👎` + d.thumbs_down).setColor(`#FFBF00`);
            pages.push(embed)

        });
        let currentpage = 0
        const embed = pages[currentpage]
        
        const row = new MessageActionRow()
.addComponents(
    [new MessageButton().setLabel("Previous").setStyle("PRIMARY").setCustomId(`define-previous`),
    new MessageButton().setLabel("Next").setStyle("PRIMARY").setCustomId(`define-next`)

       ]
)

        interaction.editReply({embeds: [embed],
        components: [row]})

        const filter = i => i.customId.startsWith("define") && i.user.id === interaction.user.id;

const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

collector.on('collect', async i => {
	if (i.customId.endsWith("previous")) {
        if(currentpage == 0) currentpage = body.list.length
        else currentpage = currentpage-1

        const row = new MessageActionRow()
.addComponents(
    [new MessageButton().setLabel("Previous").setStyle("PRIMARY").setCustomId(`define-previous`),
    new MessageButton().setLabel("Next").setStyle("PRIMARY").setCustomId(`define-next`)
       ])
		await interaction.editReply({embeds: [pages[currentpage]], components: [row]})
        i.deferUpdate();
	}
    if (i.customId.endsWith("next")) {
        if(currentpage == body.list.length) currentpage = 0
        else currentpage = currentpage+1
        const row = new MessageActionRow()
        .addComponents(
            [new MessageButton().setLabel("Previous").setStyle("PRIMARY").setCustomId(`define-previous`),
            new MessageButton().setLabel("Next").setStyle("PRIMARY").setCustomId(`define-next`)
               ])
		await interaction.editReply({embeds: [pages[currentpage]], components: [row]})
        i.deferUpdate();
	}
    else return;
});

collector.on('end', collected => {
    const row = new MessageActionRow()
        .addComponents(
            [new MessageButton().setLabel("Previous").setStyle("PRIMARY").setCustomId(`define-previous`).setDisabled(true),
            new MessageButton().setLabel("Next").setStyle("PRIMARY").setCustomId(`define-next`).setDisabled(true)
               ])
    interaction.editReply({components: [row]})
});

}

// module.exports.button = async(client, interaction, member, action) => {
//     let w = interaction.options.getString("word").trim().split(/ +/g);
//     const words = w.join("+")

//     let result = {
//         url: "https://api.urbandictionary.com/v0/define?term="+words,
//         json: true
//         }        
//         const body = await get(result)
//         if(!body.list.length) return interaction.editReply("No defination found!")
        
//         let pages = []
                
//         body.list.forEach(d => {    
//             const embed = new MessageEmbed().setTitle(d.word).setAuthor(d.author).setURL(d.permalink).addField("Definition", "```" + d.definition.substr(0, 1500) + "```").addField("Example", "```" + d.example + "```").setFooter(`Page ${body.list.indexOf(d)+1} of ${body.list.length} - 👍` + d.thumbs_up + ` | ` + `👎` + d.thumbs_down).setColor(`#FFBF00`);
//             pages.push(embed)
//         });

//     let num = 0
//     let max = pages.list.length

//     if(action == "previous") {
//         let page = num <= 0 ? 0 : num-1
//         interaction.editReply({
//             embeds: [pages[page]]
//         })
//     } else if(action == "next") {
//         let page = num >= 9 ? 9 : num+1
//      interaction.editReply({
//          embeds: [pages[page]]
//      })
//  }
//  }