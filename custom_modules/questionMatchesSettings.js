const shuffle = require("./shuffle.js");

//Modifies the original question to matches the settings specified and returns it, or returns false if it can't match.

//Takes about 200ms to run this on 1159 questions with long-taking settings, so probably not worth optimizing.
const questionMatchesSettings = function(question, settings, allCards) {

	//Check if level or complexity match fit.
	if (!settings.level.includes(question.level)) {
		return false;
	}
	if (!settings.complexity.includes(question.complexity)) {
		return false;
	}

	//Check if the question is tournament viable.
	if (["Modern", "Pioneer", "Standard"].includes(settings.legality) && settings.playableOnly) {
		if (question.cardLists.length === 0) {
			return false;
		}
		for (let tag of ["Multiplayer", "Commander", "Two-Headed Giant"]) {
			if (question.tags.includes(tag)) {
				return false;
			}
		}
	}

	//Check if the tags match.
	if (settings.tags.length > 0) {
		if (settings.tagsConjunc === "OR") {
			if (!(settings.tags.some(function(element) {
				return question.tags.includes(element);
			}))) {
				return false;
			}
		} else if (settings.tagsConjunc === "AND") {
			if (!(settings.tags.every(function(element){
				return question.tags.includes(element);
			}))) {
				return false;
			}
		} else if (settings.tagsConjunc === "NOT") {
			if (settings.tags.some(function(element) {
				return question.tags.includes(element);
			})) {
				return false;
			}
		}
	}

	//Check if the rules match.
	if (settings.rules.length > 0) {
		const citedRules = question.answer.match(/\d{3}(?:\.\d{1,3}(?:[a-z])?)?(?=\])/g) || [];
		const requiredRulesExact = settings.rules.filter(function(currentvalue){
			return currentvalue.endsWith(".");
		});
		requiredRulesExact.forEach(function(currentvalue, index){
			requiredRulesExact[index] = currentvalue.slice(0, currentvalue.length-1);
		});
		const requiredRulesFuzzy = settings.rules.filter(function(currentvalue){
			return !currentvalue.endsWith(".");
		});
		const isCitedExact = function (element) {
			return citedRules.includes(element);
		};
		const isCitedFuzzy = function(element){
			return citedRules.some(function(element2){
				return element2.match(new RegExp(element + "(?=[a-z\.]|$)"));
			});
		};
		if (settings.rulesConjunc === "OR") {
			if (!(requiredRulesExact.some(isCitedExact) || requiredRulesFuzzy.some(isCitedFuzzy))) {
				return false;
			}
		} else if (settings.rulesConjunc === "AND") {
			if (!(requiredRulesExact.every(isCitedExact) && requiredRulesFuzzy.every(isCitedFuzzy))) {
				return false;
			}
		} else if (settings.rulesConjunc === "NOT") {
			if (requiredRulesExact.some(isCitedExact) || requiredRulesFuzzy.some(isCitedFuzzy)) {
				return false;
			}
		}
	}
/*
	/// Remove errored cards and alert me to remove them from the database.
	for (let j = 0 ; j < question.cardLists.length ; j++) {
		for (let k = 0 ; k < question.cardLists[j].length ; k++) {
			if (!allCards[question.cardLists[j][k]]) {
				sendEmailToOwners("RulesGuru question with illegal cards", question.id + "\n" + JSON.stringify(question.cardLists[j][k]));
				question.cardLists[j].splice(k, 1);
				k--;
			}
		}
	}
*/
	//Remove cards that don't match legality (including playable only) and return false if this causes a list to be empty.
	if (settings.legality === "Choose Expansions") {
		for (let list in question.cardLists) {
			question.cardLists[list] = question.cardLists[list].filter(function(card) {
				return settings.expansions.some(function(expansion) {
					return allCards[card].printingsName.includes(expansion);
				});
			});
		}
	} else if (["Modern", "Pioneer", "Standard"].includes(settings.legality)) {
		for (let list in question.cardLists) {
			question.cardLists[list] = question.cardLists[list].filter(function(card) {
				if (allCards[card]) {//This check is for questions that were submitted with illegal cards.
					if (!allCards[card].legalities[settings.legality[0].toLowerCase() + settings.legality.slice(1)]) {
						 return false;
					} else {
						if (settings.playableOnly) {
							return allCards[card].playability.includes(settings.legality);
						} else {
							return true;
						}
					}
				}
			});
		}
	}
	for (let j = 0 ; j < question.cardLists.length ; j++) {
		if (question.cardLists[j].length === 0) {
			return false;
		}
	}
	//Remove non-matching cards and return false if this causes a list to be empty.
	if (settings.cards.length > 0) {
		if (settings.cardsConjunc === "AND") {
			const requiredCards = settings.cards.slice();
			for (let j = 0 ; j < question.cardLists.length ; j++) {
				for (let k = 0 ; k < question.cardLists[j].length ; k++) {
					if (requiredCards.includes(question.cardLists[j][k])) {
						requiredCards.splice(requiredCards.indexOf(question.cardLists[j][k]), 1);
						question.cardLists[j] = [question.cardLists[j][k]];
						break;
					}
				}
			}
			if (requiredCards.length > 0) {
				return false;
			}
		} else if (settings.cardsConjunc === "OR") {
			const cardListMap = [];
			for (let j = 0 ; j < question.cardLists.length ; j++) {
				cardListMap.push(j);
			}
			shuffle(cardListMap);

			let foundCard = false;
			questionLoop:
			for (let j = 0 ; j < cardListMap.length ; j++) {
				for (let k in settings.cards) {
					if (question.cardLists[cardListMap[j]].includes(settings.cards[k])) {
						question.cardLists[cardListMap[j]] = [settings.cards[k]];
						foundCard = true;
						break questionLoop;
					}
				}
			}
			if (!foundCard) {
				return false;
			}
		} else if (settings.cardsConjunc === "NOT") {
			for (let j = 0 ; j < question.cardLists.length ; j++) {
				question.cardLists[j] = question.cardLists[j].filter(function(card) {
					return !settings.cards.includes(card);
				});
			}
			for (let j = 0 ; j < question.cardLists.length ; j++) {
				if (question.cardLists[j].length === 0) {
					return false;
				}
			}
		}
	}
	return question;
}

module.exports = questionMatchesSettings;
