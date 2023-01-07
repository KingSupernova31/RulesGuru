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
client.login(fs.readFileSync("discordPassword.txt", "utf8").trim());

//Provide a link to questions.
client.on("messageCreate", function(message) {
	if (message.author.bot) return;
	if (!["809157488863346699", "809156781284524064", "809158564861968385", "837844218986102785", "816333479527710760", "810621356467028028"].includes(message.channel.id)) {
		return;//It should only reply in the channels that are about the website.
	}
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

//Panglacial Wurm
client.on("messageCreate", function(message) {
	if (message.author.bot) return;
	if (message.channel.id !== "809157835459002409" && message.channel.id !== "810621356467028028") {
		return;//It should only reply in the corner case channel. (And bot test)
	}
	const match = message.content.match(/\bsearch\b/gi);
	if (match) {
		if (Math.random() < 0.01) {
			message.reply("Surprise Panglacial Wurm!");
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
			const res = await post('https://rulesguru.net/submitQuestion', {
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
