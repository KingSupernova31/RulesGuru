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

	if (choice === "pending") {
		return pendingQuestions[Math.floor(Math.random() * pendingQuestions.length)];
	} else if (choice === "awaiting verification") {
		return awaitingVerificationQuestions[Math.floor(Math.random() * awaitingVerificationQuestions.length)];
	}
}

module.exports = getUnfinishedQuestion;
