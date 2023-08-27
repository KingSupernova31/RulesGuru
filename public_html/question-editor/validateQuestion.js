const fakePlayerNamesMap = {"AP":{"name":"Amara","gender":"female"},"NAP1":{"name":"Bruno","gender":"male"},"NAP2":{"name":"Carol","gender":"neutral"},"NAP3":{"name":"Danica","gender":"female"},"NAP":{"name":"Nikolai","gender":"male"},"APa":{"name":"Addison","gender":"neutral"},"APb":{"name":"Ayden","gender":"male"},"NAPa":{"name":"Nylah","gender":"female"},"NAPb":{"name":"Nico","gender":"neutral"}};

const validateQuestion = function(questionObj, templateEmptyness, convertedTemplateStorage, currentAdminName, savedCardLists) {

	const errors = [],
				warnings = [];

	const combinedText = questionObj.question + " " + questionObj.answer;

	try {//We enclose the whole thing in a try-catch block to catch any stray errors.
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
		const allValidExpressionsRegex = /^\[(((AP[ab]?|NAP[ab123]?))|(\d{3}(\.\d{1,3}([a-z])?)?)|((card \d+)(:other side)?(:(colors|color identity|color indicator|mana cost|mana value|supertypes|types|subtypes|power|toughness|loyalty)(:simple)?)?|\d+| [+\-*] )+|([+-]?\d\d?))\]$/;
		if (questionObj.question.match(/\[.*?\]/g)) {
			questionObj.question.match(/\[.*?\]/g).some(function(element) {
				if (!allValidExpressionsRegex.test(element)) {
					if (!allCardNames.includes(element.slice(1, element.length - 1))) {
						errors.push(`"${element}" is not formatted correctly.`);
						return true;
					}
				}
			})
		}
		if (questionObj.answer.match(/\[.*?\]/g)) {
			questionObj.answer.match(/\[.*?\]/g).some(function(element) {
				if (!allValidExpressionsRegex.test(element)) {
					if (!allCardNames.includes(element.slice(1, element.length - 1))) {
						errors.push(`"${element}" is not formatted correctly.`);
						return true;
					}
				}
			})
		}
		//Check for :other side on a generator that doesn't have other sides or has too many.
		if (combinedText.match(/\[card (\d+):other side/g)) {
			combinedText.match(/\[card \d+:other side/g).some(function(element) {
				const cardNum = element.match(/^\[card (\d+):other side$/)[1];
				if (typeof questionObj.cardGenerators[cardNum - 1][0] === "object") {//Check if it's a template
					let layoutField = false;
					for (let template of questionObj.cardGenerators[cardNum - 1]) {
						if (template.field === "Layout") {
							layoutField = true;
						}
					}
					if (!layoutField) {
						errors.push(`Please ensure that the template for card ${cardNum} specifies a layout that has an other side.`);
					}
				}
			})
		}

		//Run replaceExpressions to catch expression errors
		const allText = questionObj.question + " " + questionObj.answer;
		const expressions = Array.from(allText.match(/\[card \d+.*?\]/g) || []);
		for (let expression of expressions) {
			const cardNum = expression.match(/\[card (\d+)/)[1];

			let cardsToCheck;
			if (typeof questionObj.cardGenerators[cardNum - 1][0] === "string") {//Lists
				cardsToCheck = questionObj.cardGenerators[cardNum - 1]
			} else {//Templates
				cardsToCheck = convertedTemplateStorage[cardNum - 1];
			}

			for (let cardName of cardsToCheck) {
				const result = replaceExpressions(expression, fakePlayerNamesMap, new Array(30).fill(allCards[cardName]), allCards, allRules);
				if (result.errors.length > 0) {
					errors.push(result.errors[0]);
				}
			}
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
		//Check for needlessly capitalized letters.
		const capitalizedWords = /(.{0,2})([A-Z]\w+)/g;
		const matches = questionObj.question.matchAll(capitalizedWords);
		outer: for (let match of matches) {
			if ([". ", ") ", "", " [", "[", "([", "[N", "? "].includes(match[1])) {
				continue;
			}
			for (let subtype of allSubtypes) {
				if (match[2] === subtype) {
					continue outer;
				}
			}
			warnings.push(`"${match[2]}" probably shouldn't be capitalized.`);
		}
		//Check for gendered pronouns.
		const pronouns = ["he", "she", "him", "her", "his", "hers"];
		for (let i in pronouns) {
			let regex = new RegExp(" " + pronouns[i] + "[\.\? ]")
			if (regex.test(questionObj.question.toLowerCase())) {
				warnings.push(`There may be a gendered pronoun ("${pronouns[i]}") in the question. (All players should be referred to gender-neutrally.)`);
			}
			if (regex.test(questionObj.answer.toLowerCase())) {
				warnings.push(`There may be a gendered pronoun ("${pronouns[i]}") in the answer. (All players should be referred to gender-neutrally.)`);
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
		if (/\byou\b/.test(questionObj.question.toLowerCase()) || /\byou\b/.test(questionObj.answer.toLowerCase())) {
			errors.push(`"You" aren't a player in the game. Please replace this with a reference to a player in the third person.`);
		}
		if (/\bwe\b/.test(questionObj.question.toLowerCase()) || /\bwe\b/.test(questionObj.answer.toLowerCase())) {
			errors.push(`"We" aren't in the game. Please replace this with a reference to "the game" or similar.`);
		}
		if (/\bus\b/.test(questionObj.question.toLowerCase()) || /\bus\b/.test(questionObj.answer.toLowerCase())) {
			errors.push(`"Us" doesn't refer to anyone. Please replace this with a reference to "the game" or similar.`);
		}
		const onRegex = /(asts|ctivates) \[card \d+\] on /;
		if (onRegex.test(questionObj.question.toLowerCase()) || onRegex.test(questionObj.answer.toLowerCase())) {
			warnings.push(`Please don't use the word "on" to indicate an action; say "targeting" or "choosing" as appropriate.`);
		}
		let questionIncludesFlipCard = false;
		for (let list of convertedTemplateStorage) {
			let thisListIsAllFlipCards = true;
			for (let card of list) {
				if (allCards[card].layout !== "flip") {
					thisListIsAllFlipCards = false;
					break;
				}
			}
			if (thisListIsAllFlipCards) {
				questionIncludesFlipCard = true;
				break;
			}
		}
		if (!questionIncludesFlipCard) {
			if (questionObj.question.toLowerCase().includes("flip")) {
				errors.push(`"Flip" is a technical term, please only use it to refer to the action of flipping a flip card.`);
			}
			if (questionObj.answer.toLowerCase().includes("flip")) {
				errors.push(`"Flip" is a technical term, please only use it to refer to the action of flipping a flip card.`);
			}
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
		//Check for no players mentioned at all.
		const playerNameExpressionRegex = /\[(AP[ab]?|NAP[ab123]?)\]/;
		if (!playerNameExpressionRegex.test(questionObj.question)) {
			warnings.push("You haven't included any players in this question.");
		}
		//Check for forgotten or improper generator asignment.
		let generators = [];
		generators = generators.concat(questionObj.question.match(/\[card \d+/g) || []);
		generators = generators.concat(questionObj.answer.match(/\[card \d+/g) || []);
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

		//Check for duplicate lists
		const monoCardLists = [];
		for (let listNum in questionObj.cardGenerators) {
			if (typeof questionObj.cardGenerators[listNum][0] === "string" && questionObj.cardGenerators[listNum].length === 1 ) {
				monoCardLists.push({
					"list": Number(listNum),
					"card": questionObj.cardGenerators[listNum][0]
				});
			}
		}
		loop1: for (let listNum in monoCardLists) {
			for (let otherListNum in monoCardLists) {
				if (listNum !== otherListNum && monoCardLists[listNum].card === monoCardLists[otherListNum].card) {
					errors.push(`Card lists ${monoCardLists[listNum].list + 1} and ${monoCardLists[otherListNum].list + 1} both have only ${monoCardLists[listNum].card}.`);
					break loop1;
				}
			}
		}

		//Check for a template with no preset.
		for (let generatorNum in questionObj.cardGenerators) {
			const template = questionObj.cardGenerators[generatorNum];
			if (typeof template[0] !== "string") {
				let isPreset = false;
				for (let rule of template) {
					if (rule.preset) {
						isPreset = true;
						break;
					}
				}
				warnings.push(`Template ${Number(generatorNum) + 1} uses no preset.`);
			}
		}


		//Check for missing cards.
		const allCardsWeCareAboutInOriginalQuestion = [];
		for (let savedCardList of savedCardLists) {
			if (savedCardList.length <= 3) {
				allCardsWeCareAboutInOriginalQuestion.push(...savedCardList);
			}
		}
		const allCardsInCurrentQuestion = [];
		for (let generator of questionObj.cardGenerators) {
			if (typeof generator[0] === "string") {
				allCardsInCurrentQuestion.push(...generator);
			}
		}
		for (let convertedTemplate of convertedTemplateStorage) {
			allCardsInCurrentQuestion.push(...convertedTemplate);
		}
		for (let card of allCardsWeCareAboutInOriginalQuestion) {
			if (!allCardsInCurrentQuestion.includes(card)) {
				warnings.push(`The original question mentioned ${card}, but the current question does not. Please keep the original cards in the question if possible.`);
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
	} catch (err) {
		errors.push(`Alright I don't know what you've done, but you broke *something*. Please let me know what happened so that I can either fix it or make this error message more specific.`);
		console.error(err);
	}

	return {
		"errors": errors,
		"warnings": warnings
	};
}
