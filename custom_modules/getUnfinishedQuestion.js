const fs = require("fs");

const getUnfinishedQuestion = function(admin, allQuestions) {
	let pendingQuestions = [];
	let awaitingVerificationQuestions = [];

	for (let question of allQuestions) {
		if (question.status === "pending") {
			pendingQuestions.push(question);
		}
		if (question.status === "awaiting verification") {
			awaitingVerificationQuestions.push(question);
		}
	}

	if (!admin.roles.editor) {
		pendingQuestions = [];
	}

	awaitingVerificationQuestions = awaitingVerificationQuestions.filter(function(question) {
		const verification = JSON.parse(question.verification);
		if (verification.grammarGuru === null && admin.roles.grammarGuru) {
			return true;
		}
		if (verification.templateGuru === null && admin.roles.templateGuru) {
			return true;
		}
		if (verification.rulesGuru === null && admin.roles.rulesGuru) {
			return true;
		}
		return false;
	});

	const choices = ["pending", "awaiting verification"];
	let choice = null;

	if (pendingQuestions.length === 0) {
		choices.splice(choices.indexOf("pending"), 1);
	}
	if (awaitingVerificationQuestions.length === 0) {
		choices.splice(choices.indexOf("awaiting verification"), 1);
	}
	if (choices.length === 0) {
		return false;
	} else if (choices.length === 1) {
		choice = choices[0];
	} else {
		choice = Math.round(Math.random()) === 0 ? "pending" : "awaiting verification";
	}

	const getAQuestionToSend = function(listOfQuestions) {
		let recentlyDistributedQuestionIds;
		if (fs.existsSync("./data_files/recentlyDistributedQuestionIds.json")) {
			recentlyDistributedQuestionIds = JSON.parse(fs.readFileSync("./data_files/recentlyDistributedQuestionIds.json", "utf8"));
		} else {
			recentlyDistributedQuestionIds = [];
		}
		listOfQuestions.sort((a, b) => b.id - a.id);
		let foundQuestion = null;
		for (let question of listOfQuestions) {
			if (!recentlyDistributedQuestionIds.includes(question.id)) {
				foundQuestion = question;
				break;
			}
		}
		if (foundQuestion === null) {
			foundQuestion = listOfQuestions[Math.floor(Math.random() * listOfQuestions.length)];
		}
		recentlyDistributedQuestionIds.push(foundQuestion.id);
		if (recentlyDistributedQuestionIds.length >= 500) {
			recentlyDistributedQuestionIds = recentlyDistributedQuestionIds.slice(recentlyDistributedQuestionIds.length - 500);
		}
		fs.writeFileSync("./data_files/recentlyDistributedQuestionIds.json", JSON.stringify(recentlyDistributedQuestionIds));
		return foundQuestion;
	}

	if (choice === "pending") {
		return getAQuestionToSend(pendingQuestions);
	} else if (choice === "awaiting verification") {
		return getAQuestionToSend(awaitingVerificationQuestions);
	}
}

module.exports = getUnfinishedQuestion;
