const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js'),
			fs = require("fs"),
			https = require("https");

async function post(url, data) {
  const dataString = JSON.stringify(data)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length,
    },
    timeout: 8000, // in ms
  }
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        return reject(new Error(`HTTP status code ${res.statusCode}`))
      }
      const body = []
      res.on('data', (chunk) => body.push(chunk))
      res.on('end', () => {
        const resString = Buffer.concat(body).toString()
        resolve(resString)
      })
    })
    req.on('error', (err) => {
      reject(err)
    })
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request time out'))
    })
    req.write(dataString)
    req.end()
  })
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
const discordPassword = JSON.parse(fs.readFileSync("externalCredentials.json", "utf8")).discord;
client.login(discordPassword);


//Right now only doing github links.
client.on("messageCreate", function(message) {
	if (message.author.bot) return;

	let url = "https://github.com/KingSupernova31/RulesGuru/issues/";

	const match = message.content.match(/#\d{1,4}(?![^\W_])/g);
	if (match && (message.channel.id === "816333479527710760" || message.channel.id === "810621356467028028")) {
		for (let command of match) {
			const questionNum = command.slice(1);
			message.channel.send(url + questionNum);
		}
	} else {
		return;
	}
});

//Panglacial Wurm
client.on("messageCreate", function(message) {
	if (message.author.bot) return;
	if (message.channel.id !== "809157835459002409" && message.channel.id !== "810621356467028028") {
		return;//It should only reply in the corner case channel. (And bot test)
	}
	const match = message.content.match(/\bsearch\b/gi);
	if (match) {
		if (Math.random() < 0.01) {
			message.reply("Panglacial Wurm!");
		}
	} else {
		return;
	}
});

//Submit a question
client.on("messageCreate", async function(message) {
	if (message.author.bot) return;
	const match = message.content.match(/^RGsubmit (.+)$/i);
	if (match) {
		try {
			const res = await post('https://rulesguru.org/submitQuestion', {
				"question": match[1],
				"answer": "",
				"submitterName": message.member.nickname
			});
			message.reply(res);
		} catch (err) {
			console.log(err.message)
			message.reply(`There was an error submitting your question. (${err.message}.) Please try again later.`);
		}
	} else {
		return;
	}
});

client.on('ready', () => {
    client.user.setActivity("the Magic Store & Event Locator at Wizards.com/Locator.", ({type: 3}))
})
