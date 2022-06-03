const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const commands = [];
const commandList = new Map();
const env = require("dotenv");
env.config();

module.exports = (updateCommands) => {
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const clientId = '686861151333515275';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	commandList.set(command.data.name, command)
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
if(updateCommands) {
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
}
}

module.exports.commands = commandList