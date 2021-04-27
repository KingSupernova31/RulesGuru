"use strict";

const https = require("https"),
			fs = require("fs"),
			request = require("request"),
			nodemailer = require("nodemailer"),
			transporter = nodemailer.createTransport(JSON.parse(fs.readFileSync("emailCredentials.json", "utf8"))),
			handleError = require("./handleError.js");;

const downloadFile = function(dest, source, callback) {
	if (!fs.existsSync(dest)) {
		fs.writeFileSync(dest, "");
	}
	let file = fs.createWriteStream(dest);
	let request = https.get(source, function(response) {
		response.pipe(file);
		file.on('finish', function() {
			file.close(callback);
		});
	}).on('error', function(err) {
		handleError(err);
	});
};

const manualMeldCards = [{"colorIdentity":["W"],"colors":[],"convertedManaCost":11,"layout":"meld","legalities":{"commander":"Legal","duel":"Legal","legacy":"Legal","modern":"Legal","pioneer":"Legal","vintage":"Legal"},"name":"Brisela, Voice of Nightmares","names":["Bruna, the Fading Light","Gisela, the Broken Blade","Brisela, Voice of Nightmares"],"power":"9","printings":["EMN","PEMN","V17"],"side":"b","subtypes":["Eldrazi","Angel"],"supertypes":["Legendary"],"text":"Flying, first strike, vigilance, lifelink\nYour opponents can't cast spells with mana value 3 or less.","toughness":"10","type":"Legendary Creature — Eldrazi Angel","types":["Creature"]},{"colorIdentity":["W"],"colors":["W"],"convertedManaCost":7,"layout":"meld","leadershipSkills":{"brawl":false,"commander":true,"oathbreaker":false},"legalities":{"commander":"Legal","duel":"Legal","legacy":"Legal","modern":"Legal","penny":"Legal","pioneer":"Legal","vintage":"Legal"},"manaCost":"{5}{W}{W}","name":"Bruna, the Fading Light","names":["Bruna, the Fading Light","Gisela, the Broken Blade","Brisela, Voice of Nightmares"],"power":"5","printings":["EMN","PEMN","V17"],"side":"a","subtypes":["Angel","Horror"],"supertypes":["Legendary"],"text":"When you cast this spell, you may return target Angel or Human creature card from your graveyard to the battlefield.\nFlying, vigilance\n(Melds with Gisela, the Broken Blade.)","toughness":"7","type":"Legendary Creature — Angel Horror","types":["Creature"]},{"colorIdentity":["B"],"colors":[],"convertedManaCost":7,"layout":"meld","legalities":{"commander":"Legal","duel":"Legal","legacy":"Legal","modern":"Legal","pauper":"Legal","pioneer":"Legal","vintage":"Legal"},"name":"Chittering Host","names":["Midnight Scavengers","Graf Rats","Chittering Host"],"power":"5","printings":["EMN"],"side":"b","subtypes":["Eldrazi","Horror"],"supertypes":[],"text":"Haste\nMenace (This creature can't be blocked except by two or more creatures.)\nWhen Chittering Host enters the battlefield, other creatures you control get +1/+0 and gain menace until end of turn.","toughness":"6","type":"Creature — Eldrazi Horror","types":["Creature"]},{"colorIdentity":["W"],"colors":["W"],"convertedManaCost":4,"layout":"meld","leadershipSkills":{"brawl":false,"commander":true,"oathbreaker":false},"legalities":{"commander":"Legal","duel":"Legal","legacy":"Legal","modern":"Legal","pioneer":"Legal","vintage":"Legal"},"manaCost":"{2}{W}{W}","name":"Gisela, the Broken Blade","names":["Bruna, the Fading Light","Gisela, the Broken Blade","Brisela, Voice of Nightmares"],"power":"4","printings":["EMN","PEMN","V17"],"side":"a","subtypes":["Angel","Horror"],"supertypes":["Legendary"],"text":"Flying, first strike, lifelink\nAt the beginning of your end step, if you both own and control Gisela, the Broken Blade and a creature named Bruna, the Fading Light, exile them, then meld them into Brisela, Voice of Nightmares.","toughness":"3","type":"Legendary Creature — Angel Horror","types":["Creature"]},{"colorIdentity":["B"],"colors":["B"],"convertedManaCost":2,"layout":"meld","legalities":{"commander":"Legal","duel":"Legal","legacy":"Legal","modern":"Legal","pauper":"Legal","penny":"Legal","pioneer":"Legal","vintage":"Legal"},"manaCost":"{1}{B}","name":"Graf Rats","names":["Midnight Scavengers","Graf Rats","Chittering Host"],"power":"2","printings":["EMN"],"side":"a","subtypes":["Rat"],"supertypes":[],"text":"At the beginning of combat on your turn, if you both own and control Graf Rats and a creature named Midnight Scavengers, exile them, then meld them into Chittering Host.","toughness":"1","type":"Creature — Rat","types":["Creature"]},{"colorIdentity":["R"],"colors":[],"convertedManaCost":0,"layout":"meld","legalities":{"commander":"Legal","duel":"Legal","legacy":"Legal","modern":"Legal","pioneer":"Legal","vintage":"Legal"},"name":"Hanweir Battlements","names":["Hanweir Battlements","Hanweir Garrison","Hanweir, the Writhing Township"],"printings":["EMN","PEMN"],"side":"a","subtypes":[],"supertypes":[],"text":"{T}: Add {C}.\n{R}, {T}: Target creature gains haste until end of turn.\n{3}{R}{R}, {T}: If you both own and control Hanweir Battlements and a creature named Hanweir Garrison, exile them, then meld them into Hanweir, the Writhing Township.","type":"Land","types":["Land"]},{"colorIdentity":["R"],"colors":["R"],"convertedManaCost":3,"layout":"meld","legalities":{"commander":"Legal","duel":"Legal","legacy":"Legal","modern":"Legal","pioneer":"Legal","vintage":"Legal"},"manaCost":"{2}{R}","name":"Hanweir Garrison","names":["Hanweir Battlements","Hanweir Garrison","Hanweir, the Writhing Township"],"power":"2","printings":["EMN","PEMN"],"side":"a","subtypes":["Human","Soldier"],"supertypes":[],"text":"Whenever Hanweir Garrison attacks, create two 1/1 red Human creature tokens that are tapped and attacking.\n(Melds with Hanweir Battlements.)","toughness":"3","type":"Creature — Human Soldier","types":["Creature"]},{"colorIdentity":["R"],"colors":[],"convertedManaCost":3,"layout":"meld","legalities":{"commander":"Legal","duel":"Legal","legacy":"Legal","modern":"Legal","pioneer":"Legal","vintage":"Legal"},"name":"Hanweir, the Writhing Township","names":["Hanweir Battlements","Hanweir Garrison","Hanweir, the Writhing Township"],"power":"7","printings":["EMN","PEMN"],"side":"b","subtypes":["Eldrazi","Ooze"],"supertypes":["Legendary"],"text":"Trample, haste\nWhenever Hanweir, the Writhing Township attacks, create two 3/2 colorless Eldrazi Horror creature tokens that are tapped and attacking.","toughness":"4","type":"Legendary Creature — Eldrazi Ooze","types":["Creature"]},{"colorIdentity":["B"],"colors":["B"],"convertedManaCost":5,"layout":"meld","legalities":{"commander":"Legal","duel":"Legal","legacy":"Legal","modern":"Legal","pauper":"Legal","pioneer":"Legal","vintage":"Legal"},"manaCost":"{4}{B}","name":"Midnight Scavengers","names":["Midnight Scavengers","Graf Rats","Chittering Host"],"power":"3","printings":["EMN"],"side":"a","subtypes":["Human","Rogue"],"supertypes":[],"text":"When Midnight Scavengers enters the battlefield, you may return target creature card with mana value 3 or less from your graveyard to your hand.\n(Melds with Graf Rats.)","toughness":"3","type":"Creature — Human Rogue","types":["Creature"]}];

const updateAllCards = function() {
	try {
		const notFlatAllCards = JSON.parse(fs.readFileSync("data_files/rawAllCards.json", "utf8")).data;

		//I hate Unstable and mystery booster.
		const cardsThatAreAwful = ["Target Minotaur", "Secret Base", "Novellamental", "Extremely Slow Zombie", "Beast in Show", "Amateur Auteur", "Garbage Elemental", "Target Minotaur", "Sly Spy", "Knight of the Kitchen Sink", "Everythingamajig", "Ineffable Blessing", "Very Cryptic Command", "Start // Fire", "B.F.M. (Big Furry Monster)", "Smelt // Herd // Saw"];
		for (let i of cardsThatAreAwful) {
			delete notFlatAllCards[i];
		}

		//Flatten subarrays from multipart cards and change both names and object keys to be individual.
		const allCards = {};
		for (let i in notFlatAllCards) {
			if (notFlatAllCards[i].length === 1) {
				if (notFlatAllCards[i][0].layout !== "meld") {
					allCards[notFlatAllCards[i][0].name] = notFlatAllCards[i][0];
				}
			} else {
				let names = [];
				for (let j in notFlatAllCards[i]) {
					names.push(notFlatAllCards[i][j].faceName || notFlatAllCards[i][j].name);
				}
				for (let j in notFlatAllCards[i]) {
					notFlatAllCards[i][j].name = notFlatAllCards[i][j].faceName || notFlatAllCards[i][j].name;
					notFlatAllCards[i][j].names = names;
					allCards[notFlatAllCards[i][j].faceName] = notFlatAllCards[i][j];
				}
			}
		}

		//Add in meld cards manually.
		for (let i in manualMeldCards) {
			allCards[manualMeldCards[i].name] = manualMeldCards[i];
		}

		//Add in missing values.
		let missingArrays = ["colors", "colorIdentity", "types", "subtypes", "keywords", "playability"];
		for (let i in allCards) {
			missingArrays.forEach(function(element) {
				if (!allCards[i].hasOwnProperty(element)) {
					allCards[i][element] = [];
				}
			})
			if (!allCards[i].hasOwnProperty("layout")) {
				allCards[i].layout = "normal"
			}
			if (!allCards[i].hasOwnProperty("legalities")) {
				allCards[i].legalities = {};
			}
			if (!allCards[i].hasOwnProperty("text")) {
				allCards[i].text = "";
			}
		}

		//Remove tokens and emblems.
		for (let i in allCards) {
			if (allCards[i].layout === "token" || allCards[i].layout === "double_faced_token" || allCards[i].layout === "emblem") {
				delete allCards[i];
			}
		}

		//Change colors from letter to color names.
		const colorMappings = {
			"W": "White",
			"U": "Blue",
			"B": "Black",
			"R": "Red",
			"G": "Green"
		}
		for (let i in allCards) {
			for (let j in allCards[i].colors) {
				allCards[i].colors[j] = colorMappings[allCards[i].colors[j]];
			}
			for (let j in allCards[i].colorIdentity) {
				allCards[i].colorIdentity[j] = colorMappings[allCards[i].colorIdentity[j]];
			}
		}

		//Change cmc to mana value.
		for (let i in allCards) {
			allCards[i].manaValue = allCards[i].convertedManaCost;
			allCards[i].faceManaValue = allCards[i].faceConvertedManaCost;
		}

		//Remove redundant layouts and fix incorrect layouts. Left over afterwards: "normal", "split (half)", "split (full)", "flip", "transforming double-faced", "modal double-faced" "meld", "adventurer", "other".
		for (let i in allCards) {
			if (allCards[i].layout === "leveler" || allCards[i].layout === "saga") {
				allCards[i].layout = "normal";
			}
			if (allCards[i].layout === "phenomenon" || allCards[i].layout === "plane" || allCards[i].layout === "scheme" || allCards[i].layout === "vanguard") {
				allCards[i].layout = "other";
			}
			if (allCards[i].layout === "aftermath") {
				allCards[i].layout = "split";
			}
			if (allCards[i].layout === "transform") {
				allCards[i].layout = "transforming double-faced";
			}
			if (allCards[i].layout === "modal_dfc") {
				allCards[i].layout = "modal double-faced";
			}
			if (allCards[i].layout === "adventure") {
				allCards[i].layout = "adventurer";
			}
		}

		//Fix split card mana value.
		for (let i in allCards) {
			if (allCards[i].layout === "split") {
				allCards[i].manaValue = allCards[i].faceManaValue;
			}
		}

		//Fix flip card mana cost.
		for (let i in allCards) {
			if (allCards[i].layout === "flip" && allCards[i].side === "b") {
				allCards[i].manaCost = allCards[allCards[i].names[0]].manaCost;
			}
		}

		//Fix adventurer card mana value.
		for (let i in allCards) {
			if (allCards[i].layout === "adventurer" && allCards[i].side === "b") {
				allCards[i].manaValue = allCards[i].faceManaValue;
			}
		}

		//Fix mdfc mana value. Assumes no hybrid.
		for (let i in allCards) {
			if (allCards[i].layout === "modal double-faced" && allCards[i].side === "b") {
				if (allCards[i].manaCost) {
					const manaCostSymbols = allCards[i].manaCost.match(/{[A-Z0-9]}/g);
					let manaValue = 0;
					for (let symbol of manaCostSymbols) {
						const result = parseInt(symbol.slice(1));
						if (isNaN(result)) {
							manaValue++;
						} else {
							manaValue += result;
						}
					}
					allCards[i].manaValue = manaValue;
				} else {
					allCards[i].manaValue = 0;
				}
			}
		}

		//Create combined split card entries with layout "split (full)".
		let propsToCombine = ["colorIdentity", "colors", "types"],
			 combinedCards = {};
		for (let i in allCards) {
			if ((allCards[i].layout === "split" || allCards[i].layout === "aftermath") && allCards[i].side === "a") {
				let combinedProps = {};
				combinedProps.name = allCards[i].names[0] + " // " + allCards[i].names[1];
				combinedProps.type = allCards[allCards[i].names[0]].type + " // " + allCards[allCards[i].names[1]].type;
				combinedProps.manaCost = allCards[allCards[i].names[0]].manaCost + " // " + allCards[allCards[i].names[1]].manaCost;
				combinedProps.manaValue = allCards[allCards[i].names[0]].manaValue + allCards[allCards[i].names[1]].manaValue;
				combinedProps.text = allCards[allCards[i].names[0]].text + "\n//\n" + allCards[allCards[i].names[1]].text;
				for (let j in propsToCombine) {
					combinedProps[propsToCombine[j]] = allCards[i][propsToCombine[j]].concat(allCards[allCards[i].names[1]][propsToCombine[j]]);
					combinedProps[propsToCombine[j]] = Array.from(new Set(combinedProps[propsToCombine[j]]));
				}
				let currentCard = JSON.parse(JSON.stringify(allCards[i]));
				currentCard.name = combinedProps.name;
				for (let j in combinedProps) {
					currentCard[j] = combinedProps[j];
				}
				currentCard.layout = "split (full)";
				delete currentCard.side;
				combinedCards[currentCard.name] = currentCard;
			}
		}
		Object.assign(allCards, combinedCards);
		for (let i in allCards) {
			if (allCards[i].layout === "split") {
				allCards[i].layout = "split (half)";
			}
		}

		//Change "printings" to "printingsCode" and add "printingsName".
		const allSets = JSON.parse(fs.readFileSync("data_files/finalAllSets.json", "utf8"));
		for (let i in allCards) {
			allCards[i].printingsCode = allCards[i].printings;
			delete allCards[i].printings;

			if (!allCards[i].printingsCode) {
				handleError(new Error("Map problem: " + allCards[i]));
			} else {
				allCards[i].printingsName = allCards[i].printingsCode.map(function(value) {
					for (let j in allSets) {
						if (allSets[j].code === value) {
							return allSets[j].name;
						}
					}
				});
			}
		}

		//Add a rulesText field without reminder text or ability words.
		const abilityWords = JSON.parse(fs.readFileSync("data_files/finalAllKeywords.json", "utf8")).abilityWords;
		const abilityWordRegex = new RegExp("(" + abilityWords.join("|") + ") — ", "g");
		for (let i in allCards) {
			allCards[i].rulesText = allCards[i].text.replace(/ ?\(.+?\)/g, function(match) {
				return "";
			});
			allCards[i].rulesText = allCards[i].rulesText.replace(/^\n/g, function(match) {
				return "";
			});
		allCards[i].rulesText = allCards[i].rulesText.replace(abilityWordRegex, function(match) {
				return "";
			});
		}

		//Add in playability field.
		const mostPlayedCards = {
			"Standard": [],
			"Pioneer": [],
			"Modern": []
		}
		for (let format in mostPlayedCards) {
			mostPlayedCards[format] = JSON.parse(fs.readFileSync(`data_files/mostPlayed${format}.json`, "utf8"));
		}
		for (let format in mostPlayedCards) {
			mostPlayedCards[format] = mostPlayedCards[format].filter(function(card) {
				return parseFloat(card.metagame_relevance) >= 0.2;
			});
		}

		for (let format in mostPlayedCards) {
			for (let j in mostPlayedCards[format]) {
				mostPlayedCards[format][j] = mostPlayedCards[format][j].card_id;
			}
		}

		for (let i in allCards) {
			let properName;
			if (allCards[i].names) {
				if (allCards[i].layout === "split (full)") {
					properName = allCards[i].name;
				} else  if (allCards[i].layout === "split (half)") {
					properName = allCards[i].names[0] + " // " + allCards[i].names[1];
				} else {
					properName = allCards[i].names[0];
				}
			} else {
				properName = allCards[i].name;
			}

			properName = properName.replace(" // ", "/");

			for (let format in mostPlayedCards) {
				if (mostPlayedCards[format].includes(properName)) {
					allCards[i].playability.push(format);
				}
			}
		}

		const relevantProps = ["colorIdentity", "colorIndicator", "colors", "manaValue", "layout", "legalities", "loyalty", "manaCost", "name", "names", "power", "side", "subtypes", "supertypes", "text", "toughness", "type", "types", "rulesText", "printingsName", "printingsCode", "keywords", "playability"];
		for (let i in allCards) {
			const allProps = Object.keys(allCards[i]);
			for (let j in allProps) {
				if (!relevantProps.includes(allProps[j])) {
					delete allCards[i][allProps[j]];
				}
			}
		}

		if (Object.keys(allCards).length > 15000) {
			fs.writeFileSync("data_files/finalAllCards.json", JSON.stringify(allCards));
		} else {
			handleError(new Error("allCardsUpdate allCards too short"));
		}
	} catch (err) {
		handleError(err);
	}
	disperseFiles();
};

//Write the card list to file, with only the specified properties. Format can be "js" or "json".
const writeCardList = function(allCards, path, properties, format) {
	const newAllCards = {};
	//Construct the new object with the only specified properties.
	for (let i in allCards) {
		for (let j in properties) {
			if (!newAllCards[allCards[i].name]) {
				newAllCards[allCards[i].name] = {};
			}
			newAllCards[allCards[i].name][properties[j]] = allCards[i][properties[j]];
		}
	}
	//remove Un-cards, 1996 World Champ, vanguards, conspiracies, etc. Arena-only cards are allowed.
	for (let i in newAllCards) {
		if (!allCards[i].legalities || Object.keys(allCards[i].legalities).length === 0 || allCards[i].types.includes("Conspiracy")) {
			delete newAllCards[i];
		}
	}
	//Remove cards that rulesguru doesn't allow.
	const disallowedCards = ["Chaos Orb", "Falling Star", "Goblin Game", "Aether Searcher", "Agent of Acquisitions", "Animus of Predation", "Arcane Savant", "Archdemon of Paliano", "Caller of the Untamed", "Canal Dredger", "Cogwork Grinder", "Cogwork Librarian", "Cogwork Spy", "Cogwork Tracker", "Custodi Peacekeeper", "Deal Broker", "Garbage Fire", "Illusionary Informant", "Leovold's Operative", "Lore Seeker", "Lurking Automaton", "Noble Banneret", "Paliano, the High City", "Paliano Vanguard", "Pyretic Hunter", "Regicide", "Smuggler Captain", "Spire Phantasm", "Volatile Chimera", "Whispergear Sneak"];
	for (let i in newAllCards) {
		if (disallowedCards.includes(newAllCards[i].name)) {
			delete newAllCards[i];
		}
	}

	//Write to the file.
	if (format === "js") {
		fs.writeFileSync(path, `const allCards = ${JSON.stringify(newAllCards)}`);
	} else if (format === "json") {
		fs.writeFileSync(path, JSON.stringify(newAllCards));
	}
}

const updateSearchLinkMappings = function() {
	const searchLinkMappings = JSON.parse(fs.readFileSync("public_html/globalResources/searchLinkMappings.js", "utf8").slice(27));

	const allRules = JSON.parse(fs.readFileSync("data_files/finalAllRules.json"));
	for (let i in allRules) {
		if (!searchLinkMappings.rules.includes(allRules[i].ruleNumber)) {
			searchLinkMappings.rules.push(allRules[i].ruleNumber);
		}
		if (!searchLinkMappings.rules.includes(allRules[i].ruleNumber.slice(0, 3))) {
			searchLinkMappings.rules.push(allRules[i].ruleNumber.slice(0, 3));
		}
	}

	const allSets = JSON.parse(fs.readFileSync("data_files/finalAllSets.json"));
	for (let i in allSets) {
		if (!searchLinkMappings.expansions.includes(allSets[i].name)) {
			searchLinkMappings.expansions.push(allSets[i].name);
		}
	}
	const allCards = JSON.parse(fs.readFileSync("data_files/finalAllCards.json"));
	for (let i in allCards) {
		if (!searchLinkMappings.cards.includes(allCards[i].name)) {
			searchLinkMappings.cards.push(allCards[i].name);
		}
	}

	fs.writeFileSync("public_html/globalResources/searchLinkMappings.js", "const searchLinkMappings = " + JSON.stringify(searchLinkMappings));


	const allCardNames = Object.values(JSON.parse(fs.readFileSync("data_files/finalAllCards.json", "utf8"))).map(function(card) {
		return card.name;
	});
	const differenceIndices = [];
	for (let i in searchLinkMappings.cards) {
		if (!allCardNames.includes(searchLinkMappings.cards[i])) {
			differenceIndices.push(Number(i));
		}
	}

	fs.writeFileSync("public_html/searchLinkCardNamesDiff.js", "const searchLinkCardNamesDiff = " + JSON.stringify(differenceIndices));
}

const disperseFiles = function() {
	try{
		//Update rule object.
		const allRules = fs.readFileSync("data_files/finalAllRules.json", "utf8");
		fs.writeFileSync("public_html/question-editor/allRules.js", "const allRules = " + allRules);
		fs.writeFileSync("allRules.json", allRules);

		//Update rule numbers.
		fs.writeFileSync("public_html/allRuleNumbers.js", "const allRuleNumbers = " + JSON.stringify(Object.keys(JSON.parse(allRules))));

		//Update keywords.
		const allKeywords = fs.readFileSync("data_files/finalAllKeywords.json", "utf8");
		fs.writeFileSync("public_html/globalResources/allKeywords.js", "const allKeywords = " + allKeywords);

		//Update sets.
		const allSets = fs.readFileSync("data_files/finalAllSets.json", "utf8");
		fs.writeFileSync("public_html/globalResources/allSets.js", "const allSets = " + allSets);

		//Update cards.
		const allCards = JSON.parse(fs.readFileSync("data_files/finalAllCards.json", "utf8"));
		writeCardList(allCards, "allCards.json", ["name", "names", "manaCost", "type", "rulesText", "power", "toughness", "loyalty", "layout", "legalities", "printingsName", "types", "side", "supertypes", "subtypes", "manaValue", "colors", "colorIndicator", "keywords", "playability"], "json");
		writeCardList(allCards, "public_html/question-editor/allCards.js", ["name", "names", "rulesText", "power", "toughness", "loyalty", "layout", "types", "type", "side", "supertypes", "subtypes", "manaValue", "colors", "colorIndicator", "manaCost", "keywords"], "js");

		//SearchLink mappings.
		updateSearchLinkMappings();

	} catch (err) {
		handleError(err)
	}
}

if (!fs.existsSync("data_files")) {
	fs.mkdirSync("data_files", function(err) {
		if (err) {
			handleError(err);
		}
	});
}

let finishedDownloads = 0;
downloadFile("data_files/rawAllKeywords.json", "https://slack.vensersjournal.com/keywords", function() {
	try {
		const allKeywords = JSON.parse(fs.readFileSync("data_files/rawAllKeywords.json", "utf8"));
		if (Object.keys(allKeywords).length === 3 && allKeywords.keywordAbilities.length > 30) {
			for (let i in allKeywords.abilityWords) {
				allKeywords.abilityWords[i] = allKeywords.abilityWords[i][0].toUpperCase() + allKeywords.abilityWords[i].slice(1);
			}
			fs.writeFileSync("data_files/finalAllKeywords.json", JSON.stringify(allKeywords));
			finishedDownloads++;
			if (finishedDownloads === 6) {
				updateAllCards();
			}
		} else {
			handleError(new Error("allKeywordsUpdate keywordAbilities too short"));
		}
	} catch (err) {
		handleError(err);
	}
});

downloadFile("data_files/rawAllCards.json", "https://mtgjson.com/api/v5/AtomicCards.json", function() {
	finishedDownloads++;
	if (finishedDownloads === 6) {
		updateAllCards();
	}
});

const apiUrls = JSON.parse(fs.readFileSync("mostPlayedApiUrls.json", "utf8")); //URLs need to be hidden as the API is private.

downloadFile("data_files/mostPlayedStandard.json", apiUrls.standard, function() {
	finishedDownloads++;
	if (finishedDownloads === 6) {
		updateAllCards();
	}
});

downloadFile("data_files/mostPlayedPioneer.json", apiUrls.pioneer, function() {
	finishedDownloads++;
	if (finishedDownloads === 6) {
		updateAllCards();
	}
});

downloadFile("data_files/mostPlayedModern.json", apiUrls.modern, function() {
	finishedDownloads++;
	if (finishedDownloads === 6) {
		updateAllCards();
	}
});

downloadFile("data_files/rawAllSets.json", "https://mtgjson.com/api/v5/AllPrintings.json", function() {
	try {
		const rawAllSets = JSON.parse(fs.readFileSync("data_files/rawAllSets.json")).data;

		//Each set is an object with name, code, and releaseDate.
		const finalAllSets = [];
		const properties = ["code", "name", "releaseDate"];

		for (let i in rawAllSets) {
			const newSet = {};

			for (let j in properties) {
				newSet[properties[j]] = rawAllSets[i][properties[j]];
			}

			//Happy Holidays and Celebration cards don't have a normal first printing, so we have to let their promotional printing be valid. We set the printing date to the far future so that they're always last chronologically. HarperPrism book promos were distributed over the course of only 5 months, so they're left in the chronological position of the first one to come out.
			if (rawAllSets[i].name === "Happy Holidays" || rawAllSets[i].name === "Celebration") {
				newSet.releaseDate = "9999-99-99";
			}

			finalAllSets.push(newSet);
		}

		//Sort the sets chronologically by release date.
		finalAllSets.sort(function(a,b) {
			if (a.releaseDate && !b.releaseDate) {
				return 1;
			} else if (!a.releaseDate && b.releaseDate) {
				return -1;
			} else if (!a.releaseDate && !b.releaseDate) {
				return 0;
			} else {
				if (a.releaseDate.slice(0,4) !== b.releaseDate.slice(0,4)) {
					return a.releaseDate.slice(0,4) - b.releaseDate.slice(0,4);
				}
				if (a.releaseDate.slice(5,7) !== b.releaseDate.slice(5,7)) {
					return a.releaseDate.slice(5,7) - b.releaseDate.slice(5,7);
				}
				if (a.releaseDate.slice(8,10) !== b.releaseDate.slice(8,10)) {
					return a.releaseDate.slice(8,10) - b.releaseDate.slice(8,10);
				}
			}
		});

		if (finalAllSets.length > 400) {
			fs.writeFileSync("data_files/finalAllSets.json", JSON.stringify(finalAllSets));
			finishedDownloads++;
			if (finishedDownloads === 6) {
				updateAllCards();
			}
		} else {
			handleError(new Error("allSetsUpdate array too short"));
		}

	} catch (err) {
		handleError(err);
	}
});

downloadFile("data_files/rawAllRules.json", "https://slack.vensersjournal.com/allrules", function() {
	try {
		const rawAllRules = fs.readFileSync("data_files/rawAllRules.json", "utf8");
		if (Object.keys(JSON.parse(rawAllRules)).length > 1000) {
			fs.writeFileSync("data_files/finalAllRules.json", rawAllRules);
		} else {
			handleError(new Error("allRulesUpdate rules too short"));
		}
	} catch (err) {
		handleError(err);
	}
});
