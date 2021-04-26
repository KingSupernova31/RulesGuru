const Discord = require("discord.js"),
			fs = require("fs");

const client = new Discord.Client();
client.login(fs.readFileSync("discordPassword.txt", "utf8").trim());

client.on("message", function(message) {
	if (message.author.bot) return;
	const match = message.content.match(/#\d{1,4}(?![^\W_])/g);
	if (match) {
		for (let command of match) {
			const questionNum = command.slice(1);
			message.channel.send(`https://rulesguru.net/question-editor?${questionNum}`);
		}
	} else {
		return;
	}
});

client.on('ready', () => {
    client.user.setActivity("the Magic Store & Event Locator at Wizards.com/Locator.", ({type: "WATCHING"}))
})
