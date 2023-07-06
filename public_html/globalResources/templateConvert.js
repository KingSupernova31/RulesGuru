Object.defineProperty(Array.prototype, "includesCaseInsensitive", {
	"value": function(value) {
		for (let i = 0 ; i < this.length ; i++) {
			if (this[i].toLowerCase() === value.toLowerCase()) {
				return true;
			}
		}
		return false;
	}
});

//Time intensive step is the regexes, focus there for optimization.
//Somehow this takes over a second: templateConvert([{"field":"Rules text","operator":"Matches:","value":"When ::name:: enters the battlefield, exile target nonland permanent an opponent controls until ::name:: leaves the battlefield.","orGroup":null}], allCards)
//No individual card causes the problems; longest card is about 8ms, and it's inconsistent which card it is.

const templateConvert = function(template, globalCardList) {
	//An empty template returns no cards, not all of them.
	if (template.length === 0) {
		return [];
	} else {
		let currentValidCards = Object.values(globalCardList);

		currentValidCards = currentValidCards.filter(function(currentCard) {

			let currentCardValid = true;
			//Nontraditional cards shouldn't appear in templates.
			if (currentCard.layout === "other" || currentCard.subtypes.includes("Attraction")) {
				currentCardValid = false;
			}
			const orGroupsSatisfied = {};
			for (let i = 0 ; i < template.length ; i++) {
				if (!currentCardValid) {//If a previous rule has already determined that this card is invalid, we don't need to check if it satisfies this one.
					continue;
				}
				let currentRule = template[i];
				if (!currentRule.hasOwnProperty("orGroup")) {//Add in .orGroup for rules that don't have that property at all.
					currentRule.orGroup = null;
				}
				if (currentRule.orGroup !== null && !orGroupsSatisfied[currentRule.orGroup]) {
					orGroupsSatisfied[currentRule.orGroup] = false;
				}
				if (currentRule.orGroup !== null && orGroupsSatisfied[currentRule.orGroup]) {//If this rule is in an OR group that has already been satisfied, we can skip checking it.
					continue;
				}
				let currentRuleSatiesfied = true;
				switch (currentRule.field) {
					case "Layout":
						if (currentRule.operator === "Is:") {
							if (currentCard.layout !== currentRule.value) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Not:") {
							if (currentCard.layout === currentRule.value) {
								currentRuleSatiesfied = false;
							}
						}
						break;
					case "Multi-part side":
						if (currentRule.operator === "Is:") {
							if (!currentCard.side || currentCard.side !== currentRule.value) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Not:") {
							if (currentCard.side && currentCard.side === currentRule.value) {
								currentRuleSatiesfied = false;
							}
						}
						break;
					case "Colors":
						if (currentRule.operator === "Includes:") {
							if (!currentCard.colors.includes(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Doesn't include:") {
							if (currentCard.colors.includes(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						}
						break;
					case "Color indicator":
						if (currentRule.operator === "Includes:") {
							if (!currentCard.colorIndicator.includes(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Doesn't include:") {
							if (currentCard.colorIndicator.includes(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						}
						break;
					case "Color identity":
						if (currentRule.operator === "Includes:") {
							if (!currentCard.colorIdentity.includes(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Doesn't include:") {
							if (currentCard.colorIdentity.includes(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						}
						break;
					case "Mana cost":
						const cardManaCostArray = currentCard.manaCost ? currentCard.manaCost.replace(" // ", "").split(/(?={)/) : [],
									templateSymbols = currentRule.value.match(/{[A-Z0-9/]{0,3}}/g) || [],
									templatePseudoSymbols = currentRule.value.match(/::[a-z]+::/g) || [],
									tempSymbolString = currentRule.value,
									pseudoSymbolMap = {
										"::generic::": ["{0}", "{1}", "{2}", "{3}", "{4}", "{5}", "{6}", "{7}", "{8}", "{9}", "{10}", "{11}", "{12}", "{13}", "{14}", "{15}", "{16}", "{17}", "{18}", "{19}", "{20}", "{X}", "{Y}", "{2/W}", "{2/U}", "{2/B}", "{2/R}", "{2/G}"],
										"::phyrexian::": ["{W/P}", "{U/P}", "{B/P}", "{R/P}", "{G/P}", "{W/U/P}", "{W/B/P}", "{U/B/P}", "{U/R/P}", "{B/R/P}", "{B/G/P}", "{R/W/P}", "{R/G/P}", "{G/W/P}", "{G/U/P}",],
										"::hybrid::": ["{W/U}", "{W/B}", "{U/B}", "{U/R}", "{B/R}", "{B/G}", "{R/W}", "{R/G}", "{G/W}", "{G/U}", "{2/W}", "{2/U}", "{2/B}", "{2/R}", "{2/G}"],
										"::white::": ["{W}", "{W/P}", "{W/U}", "{W/B}", "{R/W}", "{G/W}", "{2/W}", "{W/U/P}", "{W/B/P}", "{R/W/P}", "{R/G/P}", "{G/W/P}"],
										"::blue::": ["{U}", "{U/P}", "{W/U}", "{U/B}", "{U/R}", "{G/U}", "{2/U}", "{W/U/P}", "{U/B/P}", "{U/R/P}", "{G/U/P}"],
										"::black::": ["{B}", "{B/P}", "{W/B}", "{U/B}", "{B/R}", "{B/G}", "{2/B}", "{W/B/P}", "{U/B/P}", "{B/R/P}", "{B/G/P}"],
										"::red::": ["{R}", "{R/P}", "{U/R}", "{B/R}", "{R/W}", "{R/G}", "{2/R}", "{U/R/P}", "{B/R/P}", "{R/W/P}", "{R/G/P}"],
										"::green::": ["{G}", "{G/P}", "{B/G}", "{R/G}", "{G/W}", "{G/U}", "{2/G}", "{B/G/P}", "{R/G/P}", "{G/W/P}", "{G/U/P}"]
									};
						const marriageTheoremMet = function(pseudoSymbols, symbols) {
							if (pseudoSymbols.length === 0 || symbols.length === 0) {
								return false;
							}
							//"Symbols" can contain duplicates and we want them to be treated as different while still being findable in pseudoSymbolMap.
							const distinctifiedSymbols = [];
							symbols.forEach(function(symbol) {
								distinctifiedSymbols.push(new String(symbol));
							})

							const setOfSets = [];
							pseudoSymbols.forEach(function(pseudoSymbol) {
								setOfSets.push(distinctifiedSymbols.filter(function(symbol) {
									return pseudoSymbolMap[pseudoSymbol].includes(symbol.toString());
								}));
							});
							//We just try every transversal until one works or none do.
							let foundATransfersal = false;
							const recursion = function(setOfSets, pickedElements, setIndex) {
								for (let i of setOfSets[setIndex]) {
									if (!pickedElements.includes(i)) {
										if (setOfSets.length === setIndex + 1) {
											foundATransfersal = true;
											return;
										}
										const newPickedElements = [...pickedElements].concat(i);
										recursion(setOfSets, newPickedElements, setIndex + 1);
									}
								}
							}
							recursion(setOfSets, [], 0);
							return foundATransfersal;
						}

						if (currentRule.operator === "Includes:") {
							for (let i = 0 ; i < templateSymbols.length ; i++) {
								if (cardManaCostArray.includes(templateSymbols[i])) {
									cardManaCostArray.splice(cardManaCostArray.indexOf(templateSymbols[i]), 1)
								} else {
									currentRuleSatiesfied = false;
								}
							}
							if (templatePseudoSymbols.length > 0 && !marriageTheoremMet(templatePseudoSymbols, cardManaCostArray)) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Doesn't include:") {
							let includedAllSymbols = true;
							for (let i = 0 ; i < templateSymbols.length ; i++) {
								if (cardManaCostArray.includes(templateSymbols[i])) {
									cardManaCostArray.splice(cardManaCostArray.indexOf(templateSymbols[i]), 1)
								} else {
									includedAllSymbols = false;
								}
							}
							if (templatePseudoSymbols.length > 0 && !marriageTheoremMet(templatePseudoSymbols, cardManaCostArray)) {
								includedAllSymbols = false;
							}
							if (includedAllSymbols) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Exactly:") {
							for (let i = 0 ; i < templateSymbols.length ; i++) {
								if (cardManaCostArray.includes(templateSymbols[i])) {
									cardManaCostArray.splice(cardManaCostArray.indexOf(templateSymbols[i]), 1)
								} else {
									currentRuleSatiesfied = false;
								}
							}
							if (templatePseudoSymbols.length !== cardManaCostArray.length) {
								currentRuleSatiesfied = false;
							}
							if (templatePseudoSymbols.length > 0 && !marriageTheoremMet(templatePseudoSymbols, cardManaCostArray)) {
								currentRuleSatiesfied = false;
							}
						}
						break;
					case "Mana value":
						if (currentRule.operator === "=") {
							if (currentCard.manaValue !== Number(currentRule.value)) {
								 currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === ">") {
							if (!(currentCard.manaValue > currentRule.value)) {
								 currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "<") {
							if (!(currentCard.manaValue < currentRule.value)) {
								 currentRuleSatiesfied = false;
							}
						}
						break;
					case "Supertypes":
						if (currentRule.operator === "Includes:") {
							if (!currentCard.supertypes.includes(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Doesn't include:") {
							if (currentCard.supertypes.includes(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						}
						break;
					case "Types":
						if (currentRule.operator === "Includes:") {
							if (!currentCard.types.includes(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Doesn't include:") {
							if (currentCard.types.includes(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						}
						break;
					case "Subtypes":
						if (currentRule.operator === "Includes:") {
							if (!currentCard.subtypes.includesCaseInsensitive(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Doesn't include:") {
							if (currentCard.subtypes.includesCaseInsensitive(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						}
						break;
					case "Rules text":
						const replacedValue = currentRule.value.replace(/::name::/g, currentCard.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
						if (currentRule.operator === "Matches:") {
							let regex = new RegExp(replacedValue);
							if (!regex.test(currentCard.rulesText)) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Does not match:") {
							let regex = new RegExp(replacedValue);
							if (regex.test(currentCard.rulesText)) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Contains:") {
							if (!currentCard.rulesText.toLowerCase().includes(replacedValue.toLowerCase())) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Does not contain:") {
							if (currentCard.rulesText.toLowerCase().includes(replacedValue.toLowerCase())) {
								currentRuleSatiesfied = false;
							}
						}
						break;
					case "Keywords":
						if (currentRule.operator === "Includes:") {
							if (!currentCard.keywords.includesCaseInsensitive(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "Doesn't include:") {
							if (currentCard.keywords.includesCaseInsensitive(currentRule.value)) {
								currentRuleSatiesfied = false;
							}
						}
						break;
					case "Power":
						if (currentRule.operator === "=") {
							if (currentCard.power !== currentRule.value) {
								 currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === ">") {
							if (!(currentCard.power > Number(currentRule.value))) {
								 currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "<") {
							if (!(currentCard.power < Number(currentRule.value))) {
								 currentRuleSatiesfied = false;
							}
						}
						break;
					case "Toughness":
						if (currentRule.operator === "=") {
							if (currentCard.toughness !== currentRule.value) {
								 currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === ">") {
							if (!(currentCard.toughness > Number(currentRule.value))) {
								 currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "<") {
							if (!(currentCard.toughness < Number(currentRule.value))) {
								 currentRuleSatiesfied = false;
							}
						}
						break;
					case "Loyalty":
						if (currentRule.operator === "=") {
							if (currentCard.loyalty !== currentRule.value) {
								 currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === ">") {
							if (!(currentCard.loyalty > Number(currentRule.value))) {
								 currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "<") {
							if (!(currentCard.loyalty < Number(currentRule.value))) {
								 currentRuleSatiesfied = false;
							}
						}
						break;
					case "Number of":
						const toCamelCase = function(string) {
							return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
								return index === 0 ? word.toLowerCase() : word.toUpperCase();
							}).replace(/\s+/g, '');
						}
						const fieldOption = toCamelCase(currentRule.fieldOption);
						let currentCardAttributeNumber;
						if (fieldOption === "manaCost") {
							currentCardAttributeNumber = currentCard.manaCost ? currentCard.manaCost.match(/{/g).length : 0;
						} else {
							currentCardAttributeNumber = currentCard[fieldOption].length;
						}
						if (currentRule.operator === "=") {
							if (currentCardAttributeNumber !== Number(currentRule.value)) {
								 currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === ">") {
							if (!(currentCardAttributeNumber > Number(currentRule.value))) {
								 currentRuleSatiesfied = false;
							}
						} else if (currentRule.operator === "<") {
							if (!(currentCardAttributeNumber < Number(currentRule.value))) {
								 currentRuleSatiesfied = false;
							}
						}
						break;
				}
				if (currentRule.orGroup === null) {//If it's not in a group, the rule being false invalidates the card.
					if (!currentRuleSatiesfied) {
						currentCardValid = false;
					}
				} else {//If it is in a group, then we just mark whether any rule in that group has been satisfied.
					if (currentRuleSatiesfied) {
						orGroupsSatisfied[currentRule.orGroup] = true;
					}
				}
			}
			for (let orGroup in orGroupsSatisfied) {
				if (orGroupsSatisfied[orGroup] === false) {
					currentCardValid = false;
				}
			}
			return currentCardValid;
		});
		let currentValidCardNames = [];
		currentValidCards.forEach(function(currentValue) {
			currentValidCardNames.push(currentValue.name);
		});
		return currentValidCardNames;
	}
};

if (typeof module === "object") {
	module.exports = templateConvert;
};
