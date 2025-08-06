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
}

const sleep = function(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const questionIsValid = function(question, pastQuestionData) {
	if (question.includedCards.length > globalLimits.imageNumMax) {return false;}
	if (question.includedCards.length < globalLimits.imageNumMin) {return false;}
	if (question.questionSimple.length > globalLimits.textLength) {return false;}
	if (pastQuestionData.find(p => p.id === question.id)) {return false;}
	//X can't include more than one image per reply, and tumbler can't include any images in replies, so we just ban questions with answer-only cards.
	if (question.includedCards.some(card => !question.questionSimple.includes(card.name))) {return false;}

	return true;
}

const getQuestionToPost = async function(pastQuestionData) {
	let questions = [];
	while (true) {
		await sleep(2000);
		questions = await getRandomQuestions();
		questions = questions.filter(q => questionIsValid(q, pastQuestionData));
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
			"pastQuestionData": [],
			"cachedQuestion": null,
			"liveQuestion": null,
			"liveQuestionPostIds": null,
		};
	} else {
		savedQuestionData = JSON.parse(fs.readFileSync(path.join(rootDir, "data_files/socialsQuestionData.json"), "utf8"));
	}

	//First we cache yesterday's answer and post IDs since they've about to be overwritten with today's.
	const oldQuestionAnswer = savedQuestionData.liveQuestion?.answerSimple;
	const oldQuestionPostIds = savedQuestionData.liveQuestionPostIds;

	//If there's a question for today, post it and update the live question.
	if (savedQuestionData.cachedQuestion) {

		const imageURLs = savedQuestionData.cachedQuestion.includedCards.map(card => getImageUrl(card));

		const result = await post(savedQuestionData.cachedQuestion.questionSimple, imageURLs, null);

		const replyToIds = {};
		for (let platformName in result) {
			const data = result[platformName];
			if (data.error) {
				data.error.platform = platformName;
				rgUtils.handleError(data.error);
			}

			replyToIds[platformName] = data.postId;
		}

		savedQuestionData.liveQuestion = savedQuestionData.cachedQuestion;
		savedQuestionData.liveQuestionPostIds = replyToIds;

		savedQuestionData.pastQuestionData.push({
			"id": savedQuestionData.liveQuestion.id,
			"date": Date.now(),
		});
		savedQuestionData.cachedQuestion = null;
	}

	//If there's a question from yesterday, post the answer.
	if (oldQuestionAnswer) {
		//We pass in a function because the answer text needs to include a link to the next day's post, therefore differs from platform to platform.
		const getAnswer = function(platform) {
			return `Answer: ${oldQuestionAnswer}\n\nToday's question: ${platform.getUrl(oldQuestionPostIds[platform.name])}`;
		};
		const result = await post(getAnswer, [], oldQuestionPostIds);

		for (let platformName in result) {
			const data = result[platformName];
			if (data.error) {//We try to continue past errors so that a problem with one platform's API doesn't interfere with others.
				data.error.platform = platformName;
				rgUtils.handleError(data.error);
			}
		}
	}

	//Filter past IDs to only those in the past 2 years.
	savedQuestionData.pastQuestionData = savedQuestionData.pastQuestionData.filter(p => p.date > Date.now() - (2 * (365 * 24 * 60 * 60 * 1000)));

	//Get a question for tomorrow and save it. (Posting it on Discord is handled by the discord bot.)
	if (!savedQuestionData.cachedQuestion) {
		savedQuestionData.cachedQuestion = await getQuestionToPost(savedQuestionData.pastQuestionData);
	}

	//Resave question data.
	fs.writeFileSync(path.join(rootDir, "data_files/socialsQuestionData.json"), JSON.stringify(savedQuestionData));
}

doStuff()