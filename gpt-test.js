const prompt = `Mark potential spelling and grammar errors in the following passages with a description of the issue inside a tilde and an underscore, leaving everything else completely unchanged.

Q: [AP] controls [card 1] and has both [card 2] and [card 3] exiled with cage counters on them. They use the ability from [card 2] to exile cards from their library and deal 5, can [AP] use the second activated ability from [card 3] to return the exiled cards?

A: [AP] controls [card 1] and has both [card 2] and [card 3] exiled with cage counters on them. They use the ability from [card 2] to exile cards from their library and deal 5~_missing word_~,~_should be a new sentence_~ can [AP] use the second activated ability from [card 3] to return the exiled cards?

Q: `;


//The following is some Javascript code that will call the GPT-3 API for the Davinci model with a certain prompt and return a promise for the result.
const https = require('https');
const apiKey = JSON.parse(fs.readFileSync("externalCredentials.json", "utf8")).openAI;

async function callDavinci(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      prompt: prompt,
      max_tokens: 300,
      temperature: 0,
			stop: "\n\nQ:",
			model: "davinci:ft-personal:rulesguru-2023-02-09-12-17-45",
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': 'Bearer ' + apiKey
      }
    };

    const req = https.request(options, res => {
      res.setEncoding('utf8');
      let returnData = '';

      res.on('data', chunk => {
        returnData = returnData + chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(returnData));
      });

      res.on('error', error => {
        reject(error);
      });
    });

    req.write(data);
    req.end();
  });
}

result = async function(prompt) {
	console.log((await callDavinci(prompt)).choices[0].text.trim());
}

const questionData = "The existing tokens will stay on the battlefield. Their toughness will become 0 during the resolution of [card 2], but state-based actions won't be checked until after it finishes resolving. ([704.3], [704.5f]) At that point [card 1] will be on the battlefield and the tokens will have 1 toughness and won't die.";

result(prompt + questionData + "\n\nA:");
