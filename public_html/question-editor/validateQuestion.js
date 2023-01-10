const validateQuestion = function(questionObj, templateEmptyness) {
	const errors = [],
				warnings = [];
	//Check to make sure each field is filled out.
	if (questionObj.question.length < 5) {
		errors.push("Please provide a valid question.");
	}
	if (questionObj.answer.length < 5) {
		errors.push("Please provide a valid answer.");
	}
	if (questionObj.level === "") {
		errors.push("Please specify a level.");
	}
	if (questionObj.complexity === "") {
		errors.push("Please specify a complexity.");
	}
	if (questionObj.tags.length === 0) {
		warnings.push("You have not included any tags.");
	}
	//Check for unmatched brackets.
	let openBracket = false;
	for (let i in questionObj.question) {
		if (questionObj.question[i] === "[" && openBracket === false) {
			openBracket = true;
		} else if (questionObj.question[i] === "]" && openBracket === true) {
			openBracket = false;
		} else if (questionObj.question[i] === "[" || questionObj.question[i] === "]") {
			errors.push("There are unmatched brackets in the question.");
		}
	}
	if (openBracket === true) {
		errors.push("There are unmatched brackets in the question.");
	}
	openBracket = false;
	for (let i in questionObj.answer) {
		if (questionObj.answer[i] === "[" && openBracket === false) {
			openBracket = true;
		} else if (questionObj.answer[i] === "]" && openBracket === true) {
			openBracket = false;
		} else if (questionObj.answer[i] === "[" || questionObj.answer[i] === "]") {
			errors.push("There are unmatched brackets in the answer.");
		}
	}
	if (openBracket === true) {
		errors.push("There are unmatched brackets in the answer.");
	}
	//Check for incorrectly formatted strings inside brackets.
	if (questionObj.question.match(/\[.*?\]/g)) {
		questionObj.question.match(/\[.*?\]/g).some(function(element) {
			if (!/^\[(((AP[ab]?|NAP[ab123]?)( (o|s|pp|pa|[a-zA-Z']+\|[a-zA-Z']+))?)|(\d{3}(\.\d{1,3}([a-z])?)?)|(card \d+)|([+-]?\d\d?))\]$/.test(element)) {
				if (!allCardNames.includes(element.slice(1, element.length - 1))) {
					errors.push(`"${element}" is not formatted correctly.`);
					return true;
				}
			}
		})
	}
	if (questionObj.answer.match(/\[.*?\]/g)) {
		questionObj.answer.match(/\[.*?\]/g).some(function(element) {
			if (!/^\[(((AP[ab]?|NAP[ab123]?)( (o|s|pp|pa|[a-zA-Z']+\|[a-zA-Z']+))?)|(\d{3}(\.\d{1,3}([a-z])?)?)|(card \d+)|([+-]?\d\d?))\]$/.test(element)) {
				if (!allCardNames.includes(element.slice(1, element.length - 1))) {
					errors.push(`"${element}" is not formatted correctly.`);
					return true;
				}
			}
		})
	}
	//Check for omitted brackets.
	openBracket = false;
	let unbracketedString = "";
	for (let i in questionObj.question) {
		if (questionObj.question[i] === "[" && openBracket === false) {
			openBracket = true;
		}
		if (openBracket === false) {
			unbracketedString += questionObj.question[i];
		}
		if (questionObj.question[i] === "]" && openBracket === true) {
			openBracket = false;
		}
	}
	if (/(((AP[ab]?|NAP[ab123]?)( (o|s|pp|pa|[a-zA-Z]+\|[a-zA-Z]+)?)?)|(\d{3}(\.\d{1,3}([a-z])?)?)|(card \d+))/.test(unbracketedString)) {
		warnings.push("There may be an unbracketed expression in the question.");
	}
	openBracket = false, unbracketedString = "";
	for (let i in questionObj.answer) {
		if (questionObj.answer[i] === "[" && openBracket === false) {
			openBracket = true;
		}
		if (openBracket === false) {
			unbracketedString += questionObj.answer[i];
		}
		if (questionObj.answer[i] === "]" && openBracket === true) {
			openBracket = false;
		}
	}
	if (/[^[](((AP[ab]?|NAP[ab123]?)( (o|s|pp|pa|[a-zA-Z]+\|[a-zA-Z]+)?)?)|(\d{3}(\.\d{1,3}([a-z])?)?)|(card \d+))[^\]]/.test(unbracketedString)) {
		warnings.push("There may be an unbracketed expression in the answer.");
	}
	//Check for naked card names.
	const cardNamesToIgnore = ["Turn", "Response", "Never", "Find", "Take", "Death", "Down", "Reason", "Give", "Order", "Granted", "Life", "Ends", "Well", "Status", "Entering", "Chance", "Fight", "Leave", "Regeneration", "Remove", "Charge", "Opportunity", "Return", "Away", "Two-Headed Giant"].concat(allKeywords.keywordAbilities).concat(allKeywords.keywordActions);
	const cardNamesToCheck = Object.keys(allCards).filter(function(element) {
		for (let i in cardNamesToIgnore) {
			if (cardNamesToIgnore[i].toLowerCase() === element.toLowerCase()) {
				return false;
			}
		}
		return true;
	});
	for (let i in cardNamesToCheck) {
		const cardNameRegex = new RegExp("(\\W|^)" + cardNamesToCheck[i].toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "(?!\\w)");
		if (cardNameRegex.test(questionObj.question.toLowerCase())) {
			warnings.push(`It looks like the card "${cardNamesToCheck[i]}" in the question is not in brackets.`);
		}
		if (cardNameRegex.test(questionObj.answer.toLowerCase())) {
			warnings.push(`It looks like the card "${cardNamesToCheck[i]}" in the answer is not in brackets.`);
		}
	}
	//Check for uncapitalized subtypes.
	const subtypesToIgnore = ["Will"];
	const subtypesToCheck = allSubtypes.filter(function(element) {
		for (let i in subtypesToIgnore) {
			if (subtypesToIgnore[i].toLowerCase() === element.toLowerCase()) {
				return false;
			}
		}
		return true;
	});
	for (let i in subtypesToCheck) {
		const subtypeRegex = new RegExp("(\\W|^)" + subtypesToCheck[i].toLowerCase() + "(?!\\w)");
		if (subtypeRegex.test(questionObj.question)) {
			warnings.push(`It looks like the subtype "${subtypesToCheck[i].toLowerCase()}" in the question is not capitalized.`);
		}
		if (subtypeRegex.test(questionObj.answer)) {
			warnings.push(`It looks like the subtype "${subtypesToCheck[i].toLowerCase()}" in the answer is not capitalized.`);
		}
	}
	//Check for naked pronouns.
	const pronouns = ["he", "she", "him", "her", "his", "hers", "theirs", "their"];//They and them are not included because they usually refer to cards.
	for (let i in pronouns) {
		let regex = new RegExp(" " + pronouns[i] + "[\.\? ]")
		if (regex.test(questionObj.question.toLowerCase())) {
			warnings.push(`There may be an unbracketed pronoun ("${pronouns[i]}") in the question.`);
		}
		if (regex.test(questionObj.answer.toLowerCase())) {
			warnings.push(`There may be an unbracketed pronoun ("${pronouns[i]}") in the answer.`);
		}
	}
	//Check for non-technical terms.
	const slang = ["fizzle", "into play", "in play", "bounce"];
	for (let i in slang) {
		let regex = new RegExp(slang[i])
		if (regex.test(questionObj.question.toLowerCase())) {
			errors.push(`"${slang[i][0].toUpperCase() + slang[i].slice(1)}" is not a technical term, please don't use it in the question.`);
		}
		if (regex.test(questionObj.answer.toLowerCase())) {
			errors.push(`"${slang[i][0].toUpperCase() + slang[i].slice(1)}" is not a technical term, please don't use it in the answer.`);
		}
	}
	if (questionObj.question.toLowerCase().includes("you") || questionObj.answer.toLowerCase().includes("you")) {
		warnings.push(`"You" aren't a player in the game. You should only use the word "you" when referring to its use in a card's text.`);
	}
	const onRegex = /(asts|ctivates) \[card \d+\] on /;
	if (onRegex.test(questionObj.question.toLowerCase()) || onRegex.test(questionObj.answer.toLowerCase())) {
		warnings.push(`Please don't use the term "on" to indicate an action, say "targeting" or "choosing" as appropriate instead.`);
	}
	//Check for double spaces.
	if (questionObj.question.includes("  ")) {
		errors.push("Please remove the double spaces in the question.");
	}
	if (questionObj.answer.includes("  ")) {
		errors.push("Please remove the double spaces in the answer.");
	}
	//Check for non capitilized sentances.
	if (/(\. |\? |^|\n|\.\) )\(?[a-z]/.test(questionObj.question)) {
		errors.push("Please capitalize your sentences in the question.");
	}
	if (/(\. |\? |^|\n|\.\) )\(?[a-z]/.test(questionObj.answer)) {
		errors.push("Please capitalize your sentences in the answer.");
	}
	//Check for pronouns with no matching nouns.
	const pronounExpressionRegex = /\[(AP[ab]?|NAP[ab123]?) (o|s|pp|pa)\]/g;
	let foundPronounExpressions = questionObj.question.match(pronounExpressionRegex);
	if (foundPronounExpressions !== null) {
		foundPronounExpressions.forEach(function(element) {
			if (!questionObj.question.includes(`[${element.slice(1, element.indexOf(" "))}]`)) {
				errors.push(`The pronoun expression "${element}" in the question doesn't refer to any player.`);
			}
		});
	}
	foundPronounExpressions = questionObj.answer.match(pronounExpressionRegex);
	if (foundPronounExpressions !== null) {
		foundPronounExpressions.forEach(function(element) {
			if (!questionObj.question.includes(`[${element.slice(1, element.indexOf(" "))}]`) && !questionObj.answer.includes(`[${element.slice(1, element.indexOf(" "))}]`)) {
				errors.push(`The pronoun expression "${element}" in the answer doesn't refer to any player.`);
			}
		});
	}
	//Check for no players mentioned at all.
	const playerNameExpressionRegex = /\[(AP[ab]?|NAP[ab123]?)\]/;
	if (!playerNameExpressionRegex.test(questionObj.question)) {
		warnings.push("You haven't included any players in this question.");
	}
	//Check for forgotten or improper generator asignment.
	let generators = [];
	generators = generators.concat(questionObj.question.match(/\[card \d+?\]/g) || []);
	generators = generators.concat(questionObj.answer.match(/\[card \d+?\]/g) || []);
	for (var i in generators) {
		generators[i] = parseInt(generators[i].slice(6));
	}
	generators = Array.from(new Set(generators));
	generators.sort(function(a, b) {
		return a - b;
	});
	for (let i in generators) {
		//Check for a generator that wasn't created.
		if (!questionObj.cardGenerators[generators[i] - 1]) {
			errors.push(`You have defined card ${generators[i]} but it has no associated generator.`);
		}
		//Check for no cards in a template.
		if (templateEmptyness[i]) {
			errors.push(`You have defined card generator ${generators[i]}, but its template generates no cards.`);
		} else {
			//Check for a list with no cards.
			if (questionObj.cardGenerators[generators[i] - 1].length === 0) {
				errors.push(`You have defined card generator ${generators[i]}, but its list contains no cards.`);
			}
		}
	}
	for (let i in questionObj.cardGenerators) {
		if (!generators.includes(i - - 1)) {
			errors.push(`You have created card generator ${i - - 1}, but not used it anywhere in the question or answer.`);
		}
	}
	//Check for valid rule citations and a nonzero number of them.
	const ruleCitations = questionObj.answer.match(/\[(\d{3}(\.\d{1,3}([a-z])?)?)/g);
	if (ruleCitations) {
		ruleCitations.forEach(function(element, index) {
			ruleCitations[index] = element.slice(1);
		});
		const allRuleNumbers = Object.keys(allRules);
		for (let i in ruleCitations) {
			if (!allRuleNumbers.includes(ruleCitations[i])) {
				errors.push(`"${ruleCitations[i]}" is not a valid rule.`);
			}
		}
		let numRuleCitations = 0;
		if (!ruleCitations) {
			numRuleCitations = 0;
		} else {
			numRuleCitations = ruleCitations.length;
		}
		if (numRuleCitations === 0) {
			warnings.push(`You haven't included any rule citations.`);
		}
	}
	//Check for incorrectly located or formatted rule citations.
	const ruleCitationGroupsWithoutParenCheck = questionObj.answer.match(/(\[(\d{3}(\.\d{1,3}([a-z])?)?)\](, |\/))*\[(\d{3}(\.\d{1,3}([a-z])?)?)\]/g);
	for (let i in ruleCitationGroupsWithoutParenCheck) {
		if (!questionObj.answer.includes("(" + ruleCitationGroupsWithoutParenCheck[i] + ")")) {
			warnings.push(`${ruleCitationGroupsWithoutParenCheck[i]} should be in parentheses unless it's actually a part of the sentence.`);
		}
	}
	let ruleCitationGroupsRegex = /\((\[(\d{3}(\.\d{1,3}([a-z])?)?)\](, |\/))*\[(\d{3}(\.\d{1,3}([a-z])?)?)\]\)/g;

	//let ruleCitationGroups = [...questionObj.answer.matchAll(ruleCitationGroupsRegex)];
	//Needed because matchall is not supported:
	let ruleCitationGroups = [];
	let lastIndexes = {};
	let match;
	lastIndexes[ruleCitationGroupsRegex.lastIndex] = true;
	while (match = ruleCitationGroupsRegex.exec(questionObj.answer)) {
		lastIndexes[ruleCitationGroupsRegex.lastIndex] = true;
		ruleCitationGroups.push(match);
	}

	for (let i in ruleCitationGroups) {
		const citationBeginning = ruleCitationGroups[i].index,
					citationEnd = citationBeginning + ruleCitationGroups[i][0].length - 1;

		if (!(questionObj.answer.slice(citationBeginning - 2, citationBeginning) === ". " || questionObj.answer[citationEnd + 1] === "," || (/[a-zA-Z0-9\]] /.test(questionObj.answer.slice(citationBeginning - 2, citationBeginning)) && / [a-zA-Z0-9\[]/.test(questionObj.answer.slice(citationEnd + 1, citationEnd + 3))))) {
			errors.push(`${ruleCitationGroups[i][0]} is not in the correct location.`);
		}
	};

	//Check for commas and periods.
	let questionWithoutExpressions = questionObj.question.replace(/\[.+?\]/g, "");
	let answerWithoutExpressions = questionObj.answer.replace(/\[.+?\]/g, "");
	if (!questionWithoutExpressions.includes("?")) {
		errors.push("Please use a question mark in the question.");
	}
	if (answerWithoutExpressions.split(/[\.\?]/).length === 1) {
		errors.push("Please use proper punctuation in the answer.");
	}

	return {
		"errors": errors,
		"warnings": warnings
	};
}
