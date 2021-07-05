const templateConvert = function(template, globalCardList) {
	//An empty template returns no cards, not all of them.
	if (template.length === 0) {
		return [];
	} else {
		let currentValidCards = Object.values(globalCardList);
		currentValidCards = currentValidCards.filter(function(currentCard) {
			let currentCardValid = true;
			for (let i = 0 ; i < template.length ; i++) {
				let currentRule = template[i];
				switch (currentRule.field) {
					case "Layout":
						if (currentRule.operator === "Is:") {
							if (currentCard.layout !== currentRule.value) {
								currentCardValid = false;
							}
						} else if (currentRule.operator === "Not:") {
							if (currentCard.layout === currentRule.value) {
								currentCardValid = false;
							}
						}
						break;
					case "Multi-part side":
						if (currentRule.operator === "Is:") {
							if (!currentCard.side || currentCard.side !== currentRule.value) {
								currentCardValid = false;
							}
						} else if (currentRule.operator === "Not:") {
							if (currentCard.side && currentCard.side === currentRule.value) {
								currentCardValid = false;
							}
						}
						break;
					case "Colors":
						if (currentRule.operator === "Includes:") {
							if (!currentCard.colors.includes(currentRule.value)) {
								currentCardValid = false;
							}
						} else if (currentRule.operator === "Doesn't include:") {
							if (currentCard.colors.includes(currentRule.value)) {
								currentCardValid = false;
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
										"::phyrexian::": ["{W/P}", "{U/P}", "{B/P}", "{R/P}", "{G/P}"],
										"::hybrid::": ["{W/U}", "{W/B}", "{U/B}", "{U/R}", "{B/R}", "{B/G}", "{R/W}", "{R/G}", "{G/W}", "{G/U}", "{2/W}", "{2/U}", "{2/B}", "{2/R}", "{2/G}"],
										"::white::": ["{W}", "{W/P}", "{W/U}", "{W/B}", "{R/W}", "{G/W}", "{2/W}"],
										"::blue::": ["{U}", "{U/P}", "{W/U}", "{U/B}", "{U/R}", "{G/U}", "{2/U}"],
										"::black::": ["{B}", "{B/P}", "{W/B}", "{U/B}", "{B/R}", "{B/G}", "{2/B}"],
										"::red::": ["{R}", "{R/P}", "{U/R}", "{B/R}", "{R/W}", "{R/G}", "{2/R}"],
										"::green::": ["{G}", "{G/P}", "{B/G}", "{R/G}", "{G/W}", "{G/U}", "{2/G}"]
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
									currentCardValid = false;
								}
							}
							if (templatePseudoSymbols.length > 0 && !marriageTheoremMet(templatePseudoSymbols, cardManaCostArray)) {
								currentCardValid = false;
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
								currentCardValid = false;
							}
						} else if (currentRule.operator === "Exactly:") {
							for (let i = 0 ; i < templateSymbols.length ; i++) {
								if (cardManaCostArray.includes(templateSymbols[i])) {
									cardManaCostArray.splice(cardManaCostArray.indexOf(templateSymbols[i]), 1)
								} else {
									currentCardValid = false;
								}
							}
							if (templatePseudoSymbols.length !== cardManaCostArray.length) {
								currentCardValid = false;
							}
							if (templatePseudoSymbols.length > 0 && !marriageTheoremMet(templatePseudoSymbols, cardManaCostArray)) {
								currentCardValid = false;
							}
						}
						break;
					case "Mana value":
						if (currentRule.operator === "=") {
							if (currentCard.manaValue !== Number(currentRule.value)) {
								 currentCardValid = false;
							}
						} else if (currentRule.operator === ">") {
							if (!(currentCard.manaValue > currentRule.value)) {
								 currentCardValid = false;
							}
						} else if (currentRule.operator === "<") {
							if (!(currentCard.manaValue < currentRule.value)) {
								 currentCardValid = false;
							}
						}
						break;
					case "Supertypes":
						if (currentRule.operator === "Includes:") {
							if (!currentCard.supertypes.includes(currentRule.value)) {
								currentCardValid = false;
							}
						} else if (currentRule.operator === "Doesn't include:") {
							if (currentCard.supertypes.includes(currentRule.value)) {
								currentCardValid = false;
							}
						}
						break;
					case "Types":
						if (currentRule.operator === "Includes:") {
							if (!currentCard.types.includes(currentRule.value)) {
								currentCardValid = false;
							}
						} else if (currentRule.operator === "Doesn't include:") {
							if (currentCard.types.includes(currentRule.value)) {
								currentCardValid = false;
							}
						}
						break;
					case "Subtypes":
						if (currentRule.operator === "Includes:") {
							if (!currentCard.subtypes.includesNoCase(currentRule.value)) {
								currentCardValid = false;
							}
						} else if (currentRule.operator === "Doesn't include:") {
							if (currentCard.subtypes.includesNoCase(currentRule.value)) {
								currentCardValid = false;
							}
						}
						break;
					case "Rules text":
						const replacedValue = currentRule.value.replace(/::name::/g, currentCard.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
						if (currentRule.operator === "Matches:") {
							let regex = new RegExp(replacedValue);
							if (!regex.test(currentCard.rulesText)) {
								currentCardValid = false;
							}
						} else if (currentRule.operator === "Does not match:") {
							let regex = new RegExp(replacedValue);
							if (regex.test(currentCard.rulesText)) {
								currentCardValid = false;
							}
						} else if (currentRule.operator === "Contains:") {
							if (!currentCard.rulesText.toLowerCase().includes(replacedValue.toLowerCase())) {
								currentCardValid = false;
							}
						} else if (currentRule.operator === "Does not contain:") {
							if (currentCard.rulesText.toLowerCase().includes(replacedValue.toLowerCase())) {
								currentCardValid = false;
							}
						}
						break;
					case "Keywords":
						if (currentRule.operator === "Includes:") {
							if (!currentCard.keywords.includesNoCase(currentRule.value)) {
								currentCardValid = false;
							}
						} else if (currentRule.operator === "Doesn't include:") {
							if (currentCard.keywords.includesNoCase(currentRule.value)) {
								currentCardValid = false;
							}
						}
						break;
					case "Power":
						if (currentRule.operator === "=") {
							if (currentCard.power !== currentRule.value) {
								 currentCardValid = false;
							}
						} else if (currentRule.operator === ">") {
							if (!(currentCard.power > Number(currentRule.value))) {
								 currentCardValid = false;
							}
						} else if (currentRule.operator === "<") {
							if (!(currentCard.power < Number(currentRule.value))) {
								 currentCardValid = false;
							}
						}
						break;
					case "Toughness":
						if (currentRule.operator === "=") {
							if (currentCard.toughness !== currentRule.value) {
								 currentCardValid = false;
							}
						} else if (currentRule.operator === ">") {
							if (!(currentCard.toughness > Number(currentRule.value))) {
								 currentCardValid = false;
							}
						} else if (currentRule.operator === "<") {
							if (!(currentCard.toughness < Number(currentRule.value))) {
								 currentCardValid = false;
							}
						}
						break;
					case "Loyalty":
						if (currentRule.operator === "=") {
							if (currentCard.loyalty !== currentRule.value) {
								 currentCardValid = false;
							}
						} else if (currentRule.operator === ">") {
							if (!(currentCard.loyalty > Number(currentRule.value))) {
								 currentCardValid = false;
							}
						} else if (currentRule.operator === "<") {
							if (!(currentCard.loyalty < Number(currentRule.value))) {
								 currentCardValid = false;
							}
						}
						break;
					case "Number of":
						const fieldOption = currentRule.fieldOption.toLowerCase();
						if (currentRule.operator === "=") {
							if (currentCard[fieldOption].length !== Number(currentRule.value)) {
								 currentCardValid = false;
							}
						} else if (currentRule.operator === ">") {
							if (!(currentCard[fieldOption].length > Number(currentRule.value))) {
								 currentCardValid = false;
							}
						} else if (currentRule.operator === "<") {
							if (!(currentCard[fieldOption].length < Number(currentRule.value))) {
								 currentCardValid = false;
							}
						}
						break;
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
