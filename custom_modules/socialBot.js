const path = require("path");
const fetch = require('node-fetch');
const fs = require("fs");
const rootDir = path.join(__dirname, "..");
const post = require(path.join(rootDir, "/custom_modules/postToSocials.js")),
		rgUtils = require(path.join(rootDir, "custom_modules/rgUtils.js"));
rgUtils.setUpErrorHandling();

//postToSocials will automatically split up posts if longer than the length limit for that platform, but we don't want questions to get split, so we cap question length.
const globalLimits = {
	"imageNumMax": 4, //X and Bluesky
	"imageNumMin": 1, //Instagram if we ever get that working, but just good for engagement anyway.
	"textLength": 280, //X
}

const questionSettings = {
	"count": 20,
	"level": ["0", "1", "2", "3", "Corner Case"],
	"complexity": ["Simple", "Intermediate", "Complicated"],
	"legality": "all",
	"expansions": [],
	"playableOnly": false,
	"tags": ["Unsupported answers", "Silly", "Reading cards", "Puzzle"],
	"tagsConjunc": "NOT",
	"rules": [],
	"rulesConjunc": "OR",
	"cards": [],
	"cardsConjunc": "OR",
	"from": "socialBot"
};

async function getRandomQuestions() {
	try {
		const response = await fetch(`https://rulesguru.org/api/questions/?json=${encodeURIComponent(JSON.stringify(questionSettings))}`);

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status} ${response.statusText} ${response.body}`);
		}

		const data = await response.json();
		
		if (data && data.length > 0) {
			return data;
		} else {
			throw new Error('No questions returned from API');
		}
	} catch (error) {
		console.error('Error fetching random question:', error);
		throw error;
	}
}

const sleep = function(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const questionIsValid = function(question, pastIds) {
	if (question.includedCards.length > globalLimits.imageNumMax) {return false;}
	if (question.includedCards.length < globalLimits.imageNumMin) {return false;}
	if (question.questionSimple.length > globalLimits.textLength) {return false;}
	if (pastIds.includes(question.id)) {return false;}
	//X can't include more than one image per reply, and tumbler can't include any images in replies, so we just ban questions with answer-only cards.
	if (question.includedCards.some(card => !question.questionSimple.includes(card.name))) {return false;}

	return true;
}

const getQuestionToPost = async function(pastIds) {
	let questions = [];
	while (true) {
		await sleep(2000);
		questions = await getRandomQuestions();
		questions = questions.filter(q => questionIsValid(q, pastIds));
		if (questions.length > 0) {break;}
	}

	//We use the highest ID from the group as a simple way to bias the questions towards more recent ones.
	questions.sort((a, b) => {
		return b.id - a.id;
	})
	return questions[0];
}

const getImageUrl = function(cardData) {
	if (["transforming double-faced", "modal double-faced"].includes(cardData.layout) && cardData.side === "b") {
		return `https://api.scryfall.com/cards/named?format=image&version=normal&exact=${encodeURIComponent(cardData.name)}&face=back`;
	} else if (cardData.layout === "flip" && cardData.side === "b") {
		return `https://api.scryfall.com/cards/named?format=image&version=normal&exact=${encodeURIComponent(cardData.name)}`;
	} else if (cardData.layout === "split (half)") {
		return `https://api.scryfall.com/cards/named?format=image&version=normal&exact=${encodeURIComponent(cardData.names[0] + " // " + cardData.names[1])}`;
	} else if (cardData.layout === "prototype" && cardData.name.includes(" (prototyped)")) {
		return `https://api.scryfall.com/cards/named?format=image&version=normal&exact=${encodeURIComponent(cardData.name.replace(" (prototyped)", ""))}`;
	} else {
		return `https://api.scryfall.com/cards/named?format=image&version=normal&exact=${encodeURIComponent(cardData.name)}`;
	}
}

//Usually this script is called every 24 hours.
const doStuff = async function() {

	//Get question data.
	let savedQuestionData;
	if (!fs.existsSync(path.join(rootDir, "data_files/socialsQuestionData.json"))) {
		savedQuestionData = {
			"pastIds": [],
			"cachedQuestion": null,
			"liveQuestion": null,
		};
	} else {
		savedQuestionData = JSON.parse(fs.readFileSync(path.join(rootDir, "data_files/socialsQuestionData.json"), "utf8"));
	}

	//If there's a question from yesterday, post the answer.
	if (savedQuestionData.liveQuestion) {
		const result = await post(savedQuestionData.liveQuestion.question.answerSimple, [], savedQuestionData.liveQuestion.replyToIds);

		for (let platformName in result) {
			const data = result[platformName];
			if (data.error) {
				throw data.error;
			}
		}

		savedQuestionData.liveQuestion = null;
	}

	//If there's a question for today, post it and save a reference to the post for the answer.
	if (savedQuestionData.cachedQuestion) {

		const imageURLs = savedQuestionData.cachedQuestion.includedCards.map(card => getImageUrl(card));

		const result = await post(savedQuestionData.cachedQuestion.questionSimple, imageURLs);

		const replyToIds = {};
		for (let platformName in result) {
			const data = result[platformName];
			if (data.error) {
				throw data.error;
			}

			replyToIds[platformName] = data.postId;
		}


		savedQuestionData.liveQuestion = {
			"question": savedQuestionData.cachedQuestion,
			"replyToIds": replyToIds,
		}
		savedQuestionData.pastIds.push({
			"id": savedQuestionData.liveQuestion.id,
			"date": Date.now(),
		});
		savedQuestionData.cachedQuestion = null;
	}

	//Filter pastIds to only those in the past 2 years.
	savedQuestionData.pastIds = savedQuestionData.pastIds.filter(p => p.date > Date.now() - (2 * (365 * 24 * 60 * 60 * 1000)));

	//Get a question for tomorrow and save it. (Posting it on Discord is handled by the discord bot.)
	if (!savedQuestionData.cachedQuestion) {
		savedQuestionData.cachedQuestion = await getQuestionToPost(savedQuestionData.pastIds);
	}

	//Resave question data.
	fs.writeFileSync(path.join(rootDir, "data_files/socialsQuestionData.json"), JSON.stringify(savedQuestionData));
}

doStuff()