"use strict";

const fs = require("fs"),
	JSON5 = require("json5"),
	fetch = require("node-fetch"),
	path = require("path"),
	handleError = require("./handleError.js"),
	lzma = require("lzma-native");

const rootDir = path.join(__dirname, "..");

const replaceDoppelgangerChars = function(string) {
	const map = {
		"’": `\'`,
		"“": `\\"`,
		"”": `\\"`,
		"−": `-`,
	}
	const regex = new RegExp("[" + Object.keys(map).join("") + "]", "g");
	return string.replace(regex, match => map[match]);
}

//All counters, and then a bunch of split card names and a few others that are words someone might want to use. All of these (except the list of counters) have actually been problems in the past, so don't remove them from this list without good reason.
const baseCardNamesToIgnore = JSON5.parse(fs.readFileSync("custom_modules/baseCardNamesToIgnore.json5", "utf8"));

const additionalCards = JSON5.parse(replaceDoppelgangerChars(fs.readFileSync("custom_modules/additionalCards.json5", "utf8")));

const colorMappings = {
	"W": "White",
	"U": "Blue",
	"B": "Black",
	"R": "Red",
	"G": "Green"
}

const updateAllCards = function(verbose = false) {
	try {
		console.log(time() + `Updating all cards`);

		const notFlatAllCards = JSON.parse(replaceDoppelgangerChars(fs.readFileSync("data_files/rawAllCards.json", "utf8"))).data;

		// Patch cards with normal versions and silly variants
		{
			if (verbose) { console.log(`-- Patching: Red Herring`); }
			const cards = notFlatAllCards["Red Herring"]
			delete notFlatAllCards["Red Herring"]
			let norm_card = cards.find((card) => card["text"].startsWith("Haste"))
			let alt__card = cards.find((card) => card["text"].startsWith("{1}{U}"))
			alt__card["name"] = "Sketchy Red Herring"
			notFlatAllCards["Red Herring"]         = [norm_card]
			notFlatAllCards["Sketchy Red Herring"] = [alt__card]
		}

		{
			if (verbose) { console.log(`-- Patching: Pick Your Poison`); }
			const cards = notFlatAllCards["Pick Your Poison"]
			delete notFlatAllCards["Pick Your Poison"]
			let norm_card = cards.find((card) => card["text"].startsWith("Choose one"))
			let alt__card = cards.find((card) => card["text"].startsWith("Choose any"))
			alt__card["name"] = "Pick Your Sketchy Poison"
			notFlatAllCards["Pick Your Poison"]         = [norm_card]
			notFlatAllCards["Pick Your Sketchy Poison"] = [alt__card]
		}

		{
			if (verbose) { console.log(`-- Patching: Unquenchable Fury`); }
			const cards = notFlatAllCards["Unquenchable Fury"]
			delete notFlatAllCards["Unquenchable Fury"]
			let norm_card = cards.find((card) => card["text"].startsWith("Enchant creature"))
			let alt__card = cards.find((card) => card["text"].startsWith("Each Minotaur"))
			alt__card["name"] = "Horde's Unquenchable Fury"
			notFlatAllCards["Unquenchable Fury"]         = [norm_card]
			notFlatAllCards["Horde's Unquenchable Fury"] = [alt__card]
		}

		{
			if (verbose) { console.log(`-- Patching: Fast // Furious`); }
			const cards = notFlatAllCards["Fast // Furious"]
			delete notFlatAllCards["Fast // Furious"]
			let norm_card_a = cards.find((card) => (card["faceName"] == "Fast"    && card["text"].startsWith("Discard a card")))
			let norm_card_b = cards.find((card) => (card["faceName"] == "Furious" && card["text"].startsWith("Furious deals")))
			let alt__card_a = cards.find((card) => (card["faceName"] == "Fast"    && card["text"].startsWith("Target creature")))
			let alt__card_b = cards.find((card) => (card["faceName"] == "Furious" && card["text"].startsWith("Target creature")))
			alt__card_a["name"] = "Fasto // Furiouso"
			alt__card_b["name"] = "Fasto // Furiouso"
			alt__card_a["faceName"] = "Fasto"
			alt__card_b["faceName"] = "Furiouso"
			notFlatAllCards["Fast // Furious"]   = [norm_card_a, norm_card_b]
			notFlatAllCards["Fasto // Furiouso"] = [alt__card_a, alt__card_b]
		}

		// Add in dungeons manually
		{
			for (let i in additionalCards) {
				if (verbose) { console.log(`-- Patching in additional card: ${additionalCards[i].name}`) }
				notFlatAllCards[additionalCards[i].name] = [additionalCards[i]];
			}
		}

		// Fix dungeons to have a first printing
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].type === "Dungeon") {
					if (verbose) { console.log(`-- Patching dungeon ${i} - First printing, Legalities, manaValue`) }
					notFlatAllCards[i][0].layout = "dungeon"
					notFlatAllCards[i][0].manaValue = 0
					notFlatAllCards[i][0].printings = ["AFR"]
					notFlatAllCards[i][0].legalities = { "commander": "Legal" }
				}
			}
		}

		// Remove reversible cards
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].layout === "reversible_card") {
					if (verbose) { console.log(`-- Removing (Layout = reversible_card): ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove Vanguards
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].layout === "vanguard") {
					if (verbose) { console.log(`-- Removing (Layout = vanguard): ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove Planar
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].layout === "planar") {
					if (verbose) { console.log(`-- Removing (Layout = planar): ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove sticker sheets
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].type === "Stickers") {
					if (verbose) { console.log(`-- Removing (Type = Stickers): ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove Conspiracies
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].type === "Conspiracy") {
					if (verbose) { console.log(`-- Removing (Type = Conspiracy): ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove Schemes
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].type === "Scheme" ||
				    notFlatAllCards[i][0].type === "Ongoing Scheme") {
					if (verbose) { console.log(`-- Removing (Type = Scheme): ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove Planes
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].type.startsWith("Plane ")) {
					if (verbose) { console.log(`-- Removing (Type = Plane): ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove Arena only cards (by name)
		{
			for (let i in notFlatAllCards) {
				if (i.startsWith("A-")) {
					if (verbose) { console.log(`-- Removing Arena-only card (by-name): ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove Arena only cards (by legality)
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].legalities.historic &&
				   !notFlatAllCards[i][0].legalities.vintage) {
					if (verbose) { console.log(`-- Removing Arena-only card (by-legality): ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove Arena only cards (by set)
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].firstPrinting === "HBG") {
					if (verbose) { console.log(`-- Removing Arena-only card (by-set): ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove Unknown Event cards
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].firstPrinting === "UNK") {
					if (verbose) { console.log(`-- Removing Unknown Event card: ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove Mystery Booster cards
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].firstPrinting === "MB2" ||
				    notFlatAllCards[i][0].firstPrinting === "CMB2" ||
				    notFlatAllCards[i][0].firstPrinting === "CMB1") {
					if (verbose) { console.log(`-- Removing Mystery Booster card: ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove Un-set cards
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].firstPrinting === "UGL" ||
				    notFlatAllCards[i][0].firstPrinting === "UNH" ||
				    notFlatAllCards[i][0].firstPrinting === "UST" ||
				    notFlatAllCards[i][0].firstPrinting === "UND" ||
				    (notFlatAllCards[i][0].firstPrinting === "UNF" &&
				     Object.keys(notFlatAllCards[i][0].legalities).length === 0)) {
					if (verbose) { console.log(`-- Removing Un-set card: ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove Secret Lair Drop cards
		{
			for (let i in notFlatAllCards) {
				if ((notFlatAllCards[i][0].firstPrinting === "SLD" &&
				     Object.keys(notFlatAllCards[i][0].legalities).length === 0)) {
					if (verbose) { console.log(`-- Removing Secret Lair Drop card: ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Removing Miscellaneous Silly cards
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].firstPrinting === "PSSC" ||
				    notFlatAllCards[i][0].firstPrinting === "PCEL" ||
				    notFlatAllCards[i][0].firstPrinting === "PSDG" ||
				    notFlatAllCards[i][0].firstPrinting === "PAST" ||
				    notFlatAllCards[i][0].firstPrinting === "PTG" ||
				    notFlatAllCards[i][0].firstPrinting === "HHO") {
					if (verbose) { console.log(`-- Removing Misc-Silly card: ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Removing Hero's Path cards
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].firstPrinting === "TBTH" ||
				    notFlatAllCards[i][0].firstPrinting === "THP1" ||
				    notFlatAllCards[i][0].firstPrinting === "THP2" ||
				    notFlatAllCards[i][0].firstPrinting === "THP3") {
					if (verbose) { console.log(`-- Removing Hero's Path card: ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Removing Heroes of the Realm cards
		{
			for (let i in notFlatAllCards) {
				if (notFlatAllCards[i][0].firstPrinting === "PH22" ||
				    notFlatAllCards[i][0].firstPrinting === "PH21" ||
				    notFlatAllCards[i][0].firstPrinting === "PH20" ||
				    notFlatAllCards[i][0].firstPrinting === "PH19" ||
				    notFlatAllCards[i][0].firstPrinting === "PH18" ||
				    notFlatAllCards[i][0].firstPrinting === "PH17" ||
				    notFlatAllCards[i][0].firstPrinting === "PHTR") {
					if (verbose) { console.log(`-- Removing Heroes of the Realm card: ${i}`) }
					delete notFlatAllCards[i];
				}
			}
		}

		// Remove remaining cards with no legalities
		{
			for (let i in notFlatAllCards) {
				if (Object.keys(notFlatAllCards[i][0].legalities).length === 0) {
					if (verbose) { console.log(`-- Removing card with empty legalities (probably unreleased): ${i}`); }
					delete notFlatAllCards[i];
					continue;
				}
			}
		}

		//Flatten subarrays from multipart cards and change both names and object keys to be individual.
		const allCards = {};
		for (let i in notFlatAllCards) {
			if (notFlatAllCards[i].length === 1) {
				allCards[notFlatAllCards[i][0].name] = notFlatAllCards[i][0];
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

		//Add in missing values.
		let missingArrays = ["colors", "colorIdentity", "types", "subtypes", "supertypes", "keywords", "playability", "colorIndicator"];
		let missingStrings = ["power", "toughness", "loyalty", "defense", "manaCost", "text"];
		for (let i in allCards) {
			missingArrays.forEach(function(element) {
				if (!allCards[i].hasOwnProperty(element)) {
					allCards[i][element] = [];
				}
			})
			missingStrings.forEach(function(element) {
				if (!allCards[i].hasOwnProperty(element)) {
					allCards[i][element] = "";
				}
			})
			if (!allCards[i].hasOwnProperty("layout")) {
				allCards[i].layout = "normal"
			}
			if (!allCards[i].hasOwnProperty("legalities")) {
				allCards[i].legalities = {};
			}
		}

		//Remove cards that rulesguru doesn't allow.
		const disallowedCards = ["Chaos Orb", "Falling Star", "Goblin Game"];
		for (let i in allCards) {
			if (disallowedCards.includes(allCards[i].name)) {
				delete allCards[i];
			}
		}

		//Change colors from letters to color names.
		for (let i in allCards) {
			for (let j in allCards[i].colors) {
				allCards[i].colors[j] = colorMappings[allCards[i].colors[j]];
			}
			for (let j in allCards[i].colorIdentity) {
				allCards[i].colorIdentity[j] = colorMappings[allCards[i].colorIdentity[j]];
			}
			for (let j in allCards[i].colorIndicator) {
				allCards[i].colorIndicator[j] = colorMappings[allCards[i].colorIndicator[j]];
			}
		}

		//Remove redundant layouts and fix incorrect layouts. Left over afterwards: "normal", "split (half)", "split (full)", "flip", "transforming double-faced", "modal double-faced" "meld", "adventurer", "prototype", "other".
		for (let i in allCards) {
			if (["leveler", "saga", "class"].includes(allCards[i].layout)) {
				allCards[i].layout = "normal";
			}
			if (["phenomenon", "plane", "scheme", "vanguard", "dungeon"].includes(allCards[i].layout)) {
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

		//Fix mdfc mana value.
		for (let i in allCards) {
			if (allCards[i].layout === "modal double-faced" && allCards[i].side === "b") {
				allCards[i].manaValue = getCharacteristicsFromManaCost(allCards[i].manaCost).manaValue;
			}
		}

		//Create combined split card entries with layout "split (full)".
		let propsToCombine = ["colorIdentity", "colors", "types"],
			 combinedCards = {};
		for (let i in allCards) {
			if ((allCards[i].layout === "split" || allCards[i].layout === "aftermath") && allCards[i].side === "a") {
			    let aName = allCards[i].name;
			    // bName is the element of names that aName isn't
			    let bName = allCards[i].names[0];
			    if(bName === aName){
			        bName = allCards[i].names[1];
			    }
				let combinedProps = {};
				combinedProps.name = aName + " // " + bName;
				combinedProps.type = allCards[aName].type + " // " + allCards[bName].type;
				combinedProps.manaCost = allCards[aName].manaCost + " // " + allCards[bName].manaCost;
				combinedProps.manaValue = allCards[aName].manaValue + allCards[bName].manaValue;
				combinedProps.text = allCards[aName].text + "\n//\n" + allCards[bName].text;
				for (let j in propsToCombine) {
					combinedProps[propsToCombine[j]] = allCards[aName][propsToCombine[j]].concat(allCards[bName][propsToCombine[j]]);
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

		//Fix meld cards
		const backFaces = [];
		const frontFaces = [];
		for (let i in allCards) {
			if (allCards[i].layout === "meld") {
				if (allCards[i].name.includes("//")) {
					frontFaces.push(allCards[i].name);
				} else {
					backFaces.push(allCards[i].name)
				}
			}
		}
		const fullNameArrays = [];
		for (let backFace of backFaces) {
			const nameArray = [];
			for (let frontFace of frontFaces) {
				if (frontFace.includes(backFace)) {
					const frontFaceName = frontFace.slice(0, frontFace.indexOf(" //"));
					nameArray.push(frontFaceName);
				}
			}
			nameArray.push(backFace);
			fullNameArrays.push(nameArray);
		}
		for (let i in allCards) {
			if (allCards[i].layout === "meld") {
				allCards[i].name = allCards[i].faceName;
				allCards[i].names = fullNameArrays.filter(array => array.includes(allCards[i].name))[0];
				if (i.includes("//")) {
					allCards[allCards[i].name] = allCards[i];
					delete allCards[i];
				}
			}
		}

		//Add layout = prototype, and create a second card object for each one.
		for (let i in allCards) {
			if (allCards[i].layout === "prototype") {
				allCards[i].side = "a";

				const copy = Object.assign({}, allCards[i]);
				copy.side = "b";
				copy.manaCost = copy.text.match(/Prototype (.+) — \d+\/\d+/)[1];
				copy.power = copy.text.match(/Prototype .* — (\d+)\/\d+/)[1];
				copy.toughness = copy.text.match(/Prototype .* — \d+\/(\d+)/)[1];
				copy.colors = getCharacteristicsFromManaCost(copy.manaCost).colors;
				copy.manaValue = getCharacteristicsFromManaCost(copy.manaCost).manaValue;
				copy.name = copy.name + " (prototyped)";
				allCards[copy.name] = copy;
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

		//Add a rulesText field without reminder text or ability words or flavor words.
		const allKeywords = JSON.parse(fs.readFileSync("data_files/finalAllKeywords.json", "utf8"));
		const abilityWordRegex = new RegExp("(" + allKeywords.abilityWords.join("|") + ") — ", "g");
		const flavorWordRegex = new RegExp("(" + allKeywords.flavorWords.join("|") + ") — ", "g");
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
			allCards[i].rulesText = allCards[i].rulesText.replace(flavorWordRegex, function(match) {
				return "";
			});
		}

		//Fix subtype CDAs. (MTGJSON gets all the color CDAs and color indicators correct.)
		const allRules = JSON.parse(fs.readFileSync("data_files/finalAllRules.json"));
		const allCreatureTypes = getSubtypesFromRuleText(allRules["205.3m"].ruleText);
		const subtypeRules = ["205.3g", "205.3h", "205.3i", "205.3j", "205.3k", "205.3m", "205.3q"];
		const allSubtypes = subtypeRules.map(ruleNum => getSubtypesFromRuleText(allRules[ruleNum].ruleText)).flat(1);
		for (let i in allCards) {
			if (allCards[i].rulesText.startsWith(`${allCards[i].name} is every creature type.`) || allCards[i].keywords.includes("Changeling")) {
				allCards[i].subtypes = Array.from(new Set (allCards[i].subtypes.concat(allCreatureTypes))); //We need to not overwrite noncreature subtypes.
			}
			if (allCards[i].rulesText.startsWith(`${allCards[i].name} is also a Cleric, Rogue, Warrior, and Wizard.`)) {
				allCards[i].subtypes = Array.from(new Set (allCards[i].subtypes.concat(["Cleric", "Rogue", "Warrior", "Wizard"]))); //We need to not overwrite their printed creature subtypes.
			}
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

		//Fix names
		for (let i in allCards) {
			let properName;
			if (allCards[i].names) {
				if (allCards[i].layout === "split (full)") {
					properName = allCards[i].name;
				} else  if (allCards[i].layout === "split (half)") {
					properName = allCards[i].names[0] + " // " + allCards[i].names[1];
				} else if (allCards[i].layout === "meld") {
					if (allCards[i].side === "a") {
						properName = allCards[i].name;
					} else {
						properName = allCards[i].names[0];
					}
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

		const relevantProps = ["colorIdentity", "colorIndicator", "colors", "manaValue", "layout", "legalities", "loyalty", "manaCost", "name", "names", "power", "side", "subtypes", "supertypes", "text", "toughness", "type", "types", "rulesText", "printingsName", "printingsCode", "keywords", "playability", "defense"];
		for (let i in allCards) {
			const allProps = Object.keys(allCards[i]);
			for (let j in allProps) {
				if (!relevantProps.includes(allProps[j])) {
					delete allCards[i][allProps[j]];
				}
			}
		}

		//Remove MTGJSON's hallucinatory keywords.
		for (let i in allCards) {
			allCards[i].keywords = allCards[i].keywords.filter(keyword => allKeywords.keywordAbilities.includes(keyword) || allKeywords.keywordActions.includes(keyword));
		}

		fs.writeFileSync("data_files/finalAllCards.json", JSON.stringify(allCards));

		//Write the card names to ignore file.
		fs.writeFileSync("data_files/cardNamesToIgnore.json", JSON.stringify(baseCardNamesToIgnore.concat(allKeywords.keywordAbilities).concat(allKeywords.keywordActions).concat(allSubtypes)));

		//Give the editor a list of subtypes for the dropdown.
		fs.writeFileSync("public_html/question-editor/allSubtypes.js", "const allSubtypes = " + JSON.stringify(allSubtypes));


		console.log(time() + "Finished updating all cards.");

		const validity = allCardsProbablyValid(allCards)

		if (validity === true) {
			disperseFiles();
		} else {
			handleError(new Error(`allCards probably not valid. Issue: ${validity}`));
		}
	} catch (err) {
		handleError(err);
	}
};

//TODO: This should be using matchAll instead.
const getSubtypesFromRuleText = function(ruleText) {
	const types = [];
	const listText = ruleText.match(/types? (are|is)( one word long:)? ((and )?([a-zA-Z-']+)( \(.+?\))?(, |\.))+/)[0];
	let iteratible = [];
	let regex = /(and )?([a-zA-Z-']+)( \(.+?\))?(, |\.)/g;
	let lastIndexes = {};
	let match;
	lastIndexes[regex.lastIndex] = true;
	while (match = regex.exec(listText)) {
		lastIndexes[regex.lastIndex] = true;
		iteratible.push(match);
	}
	for (let j in iteratible) {
		types.push(iteratible[j][2]);
	}
	if (ruleText.startsWith("Creatures")) {
		types.push("Time Lord");
	}
	return types;
}

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
		writeCardList(allCards, "allCards.json", ["name", "names", "manaCost", "type", "rulesText", "power", "toughness", "loyalty", "layout", "legalities", "printingsName", "types", "side", "supertypes", "subtypes", "manaValue", "colors", "colorIndicator", "keywords", "playability", "colorIdentity", "defense"], "json");
		writeCardList(allCards, "public_html/question-editor/allCards.js", ["name", "names", "rulesText", "power", "toughness", "loyalty", "layout", "types", "type", "side", "supertypes", "subtypes", "manaValue", "colors", "colorIndicator", "manaCost", "keywords", "colorIdentity", "defense"], "js");

		//Update cards to ignore
		const cardNamesToIgnore = fs.readFileSync("data_files/cardNamesToIgnore.json", "utf8");
		fs.writeFileSync("public_html/question-editor/cardNamesToIgnore.js", "const cardNamesToIgnore = " + cardNamesToIgnore);

		//SearchLink mappings.
		updateSearchLinkMappings();

		console.log(time() + "Finished dispersing all cards");
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

const allCardsProbablyValid = function(allCards) {//MTGJSON has a tendency to break things, so we perform some checks on the data to try and prevent these errors from making it into RulesGuru data.
	const allCardNames = Object.keys(allCards);

	//Check for cards that shouldn't exist in the data.
	const cardsThatShouldNotExist = ["Chaos Orb", "Goblin Game", "Target Minotaur", "B.F.M. (Big Furry Monster)", "Knight of the Kitchen Sink", "Smelt // Herd // Saw", "Extremely Slow Zombie", "Arlinn Kord Emblem", "Angel", "Saproling", "Imprision this Insolent Witch", "Intervention of Keranos", "Plot that spans Centuries", "Eight-and-a-Half-Tails Avatar", "Ashnod", "Ashling the Pilgrim Avatar", "Phoebe, Head of S.N.E.A.K.", "Rules Lawyer", "Angel of Unity", "Academy at Tolaria West", "All in Good Time", "Behold My Grandeur", "Reality Shaping", "Robot Chicken", "Metagamer", "Nerf War", "Sword of Dungeons & Dragons", "Dragon", "Richard Garfield, Ph.D.", "Proposal", "Phoenix Heart", "The Legend of Arena", "Fabled Path of Searo Point", "Only the Best", "Rarity", "1996 World Champion", "Shichifukujin Dragon", "Hymn of the Wilds", "A-Armory Veteran"];
	for (let cardName of cardsThatShouldNotExist) {
		if (allCardNames.includes(cardName)) {
			return `${cardName} exists. It should not.`;
		}
	}

	//Check for a too-short caads file.
	if (allCardNames.length < 20000) {return `Too few cards; only ${allCardNames.length}`;}

	//Check for duplicated cards.
	const duplicatedCards = allCardNames.filter(function(item, index) {return allCardNames.indexOf(item) != index});
	if (duplicatedCards.length > 0) {return `${duplicatedCards[0]} (and ${duplicatedCards.length - 1} others) are duplicated.`;}

	for (let i in allCards) {

		//Check for a card name that's wrong in one place vs. another.
		if (i !== allCards[i].name) {
			return `Inconsistent name: ${i} vs. ${allCards[i].name}.`;
		}

		//Check for any multi-part cards in the original files that slipped through.
		if (allCards[i].name.includes("//") && !allCards[i].layout.includes("split")) {
			return `${allCards[i].name} exists. It should not.`;
		}

		//Check for cards with types that shouldn't exist.
		const validTypes = ["Artifact", "Creature", "Land", "Enchantment", "Planeswalker", "Battle", "Instant", "Sorcery", "Dungeon", "Kindred"];
		if (allCards[i].types.filter(type => !validTypes.includes(type)).length > 0) {
			return `${allCards[i].name} has an invalid type. Types: ${allCards[i].types}`;
		}

		//Check for cards missing properties that should be on all cards.
		const properties = ["name", "manaCost", "type", "rulesText", "layout", "legalities", "printingsName", "types", "supertypes", "subtypes", "manaValue", "colors", "colorIndicator", "keywords", "playability", "colorIdentity"];
		for (let property of properties) {
			if (!Object.hasOwn(allCards[i], property)) {
				return `${allCards[i].name} is missing its ${property} property.`;
			}
		}
	}

	//Compare the newly generated files against some test cards.
	const testCardData = JSON.parse(fs.readFileSync("testCardData.json", "utf8"));
	for (let testCard in testCardData) {

		if (!allCardNames.includes(testCardData[testCard].name)) {return `${testCardData[testCard].name} doesn't exist.`;}

		if (testCard !== testCardData[testCard].name) {return `A card is entered under "${testCard}" but has name "${testCardData[testCard].name}".`;}

		const props = Object.keys(testCardData[testCard]);
		for (let prop of props) {
			if (!["printingsName", "printingsCode", "playability", "legalities"].includes(prop)) {//These three can change with future releases. (So can all the others, but errata/bans/new formats is much rarer than a reprint.)
				if (!allCards[testCard].hasOwnProperty(prop)) {
					return `${testCard} does not have a "${prop}" property.`;
				}
				if (JSON.stringify(testCardData[testCard][prop]) !== JSON.stringify(allCards[testCard][prop])) {
					return `${testCard}'s ${prop} property does not match. (New prop is ${JSON.stringify(allCards[testCard][prop]).slice(0,600)})`;
				}
			} else if (["printingsName", "printingsCode"].includes(prop)) {//For these we check that the old printings are a subset of the new ones.
				for (let set of testCardData[testCard][prop]) {
					if (!allCards[testCard][prop].includes(set)) {
						return `"${set}" has dissapeared from ${testCard}'s ${prop} list.`
					}
				}
			}
		}
	}

	return true;
}



//To regenerate test card data:
/*
const testCards = ["Lightning Bolt", "Sylvan Library", "Selesnya Guildgate", "Curiosity", "Mogis's Warhound", "Phantom Carriage", "Wildsong Howler", "Aberrant Researcher", "Fire // Ice", "Illusion", "Breya, Etherium Shaper", "Accorder's Shield", "+2 Mace", "Erayo, Soratami Ascendant", "Kenzo the Hardhearted", "Shahrazad", "Brisela, Voice of Nightmares", "Graf Rats", "Bonecrusher Giant", "Treats to Share", "Mistform Ultimus", "Dungeon of the Mad Mage", "Dangerous", "Nameless Race", "Dryad Arbor", "Tamiyo, Compleated Sage", "Memory", "Progenitus", "Transguild Courier", "Bear Cub", "Branchloft Pathway", "Grist, the Hunger Tide", "Emeria, Shattered Skyclave", "Space Beleren", "Void Beckoner", "Ajani's Pridemate", "Unquenchable Fury", "Helm of Kaldra", "Herald of Anafenza", "Thunderheads", "Jiang Yanggu", "Teferi's Response", "Sol Ring", "Command Tower", "Forest", "Ranar the Ever-Watchful", "Hanweir Battlements", "Commander's Plate", "Black Knight", "Deathmist Raptor", "Absorb Vis", "Yidris, Maelstrom Wielder", "Pack Rat", "Dredge", "Conflux", "Tajuru Paragon", "Ghostfire", "Abstruse Interference", "Prossh, Skyraider of Kher", "Avenger of Zendikar", "Start // Finish", "Arlinn Kord", "Tamiyo's Journal", "Gruul Guildgate", "Black Dragon", "Smelt", "Erase", "Unholy Heat", "Arcane Proxy (prototyped)", "Arcane Proxy"];

	const testCardData = {};
	for (let card in allCards) {
		if (testCards.includes(allCards[card].name)) {
			testCardData[card] = allCards[card];
		}
	}
	fs.writeFileSync("testCardData.json", JSON.stringify(testCardData));
	*/

const getCharacteristicsFromManaCost = function(manaCost) {
	let manaValue = 0;
	let colors = new Set;
	const manaCostSymbols = manaCost.match(/{[A-Z0-9/]+}/g) || [];
	for (let symbol of manaCostSymbols) {
		let symbolValue = parseInt(symbol.slice(1));
		if (Number.isNaN(symbolValue)) {
			symbolValue = 1;
		}
		manaValue += symbolValue;

		for (let color of ["W", "U", "B", "R", "G"]) {
			if (symbol.includes(color)) {
				colors.add(colorMappings[color]);
			}
		}
	}
	return {
		"manaValue": manaValue,
		"colors": Array.from(colors)
	};
}

const convertAllSets = function(allSetsText) {
	const rawAllSets = JSON.parse(replaceDoppelgangerChars(allSetsText)).data;

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
		fs.writeFileSync(path.join(rootDir, "data_files/finalAllSets.json"), JSON.stringify(finalAllSets));
	} else {
		throw new Error("allSetsUpdate array too short");
	}
}

//Returns the downloaded file and, if a path is provided, saves it to disk.
async function downloadFile(url, path) {
  const res = await fetch(url);
  if (!res.ok) {
    handleError(new Error(`Failed to fetch ${url}: ${res.statusText}`));
    return;
  }

  const buffer = await res.buffer();
  if (path) fs.writeFileSync(path, buffer);
  return buffer.toString('utf8');
}

//Will return true at least once a day when the MTGJSON files are rebuilt, even if the card data has not changed. This is desirable because we also need to download metagame data that may have changed in the mean time.
const updateNeeded = async function() {
	let oldMeta = "";
	const metaPath = path.join(rootDir, "data_files/meta.json");
	if (fs.existsSync(metaPath)) {
		oldMeta = fs.readFileSync(metaPath, "utf8");
	}
	const newMeta = await downloadFile("https://mtgjson.com/api/v5/Meta.json", metaPath);
	return newMeta !== oldMeta;
}

const convertAllKeywords = function(allKeywordsText) {
	const allKeywords = JSON.parse(replaceDoppelgangerChars(allKeywordsText));
	if (Object.keys(allKeywords).length === 3 && allKeywords.keywordAbilities.length > 30) {
		for (let i in allKeywords.abilityWords) {
			allKeywords.abilityWords[i] = allKeywords.abilityWords[i][0].toUpperCase() + allKeywords.abilityWords[i].slice(1);
		}
		for (let i in allKeywords.keywordAbilities) {
			allKeywords.keywordAbilities[i] = allKeywords.keywordAbilities[i].toLowerCase();
			allKeywords.keywordAbilities[i] = allKeywords.keywordAbilities[i][0].toUpperCase() + allKeywords.keywordAbilities[i].slice(1);
		}
		allKeywords.flavorWords = ["Acid Breath", "Animate Walking Statue", "Anitmagic Cone", "Archery", "Bardic Inspiration", "Beacon of Hope", "Bear Form", "Befriend Them", "Bewitching Whispers", "Binding Contract", "Brave the Stench", "Break Their Chains", "Charge Them", "Clever Conjurer", "Climb Over", "Combat Inspiration", "Cold Breath", "Cone of Cold", "Cunning Action", "Cure Wounds", "Dispel Magic", "Displacement", "Dissolve", "Distract the Guard", "Divine Intervention", "Dominate Monster", "Drag Below", "Engulf", "Fear Ray", "Fend Them Off", "Fight the Current", "Find a Crossing", "Flurry of Blows", "Foil Their Scheme", "Form a Party", "Gentle Repose", "Grant an Advantage", "Hide", "Interrogate Them", "Intimidate Them", "Journey On", "Keen Senses", "Learn Their Secrets", "Life Drain", "Lift the Curse", "Lightning Breath", "Magical Tinkering", "Make a Retreat", "Make Camp", "Poison Breath", "Pry It Open", "Psionic Spells", "Rappel Down", "Rejuvenation", "Rouse the Party", "Search the Body", "Search the Room", "Set Off Traps", "Siege Monster", "Smash It", "Smash the Chest", "Song of Rest", "Split", "Stand and Fight", "Start a Brawl", "Steal Its Eyes", "Stunning Strike", "Tail Spikes", "Teleport", "Tie Up", "Tragic Backstory", "Trapped!", "Two-Weapon Fighting", "Whirlwind", "Whispers of the Grave", "Wild Magic Surge"];
		fs.writeFileSync(path.join(rootDir, "data_files/finalAllKeywords.json"), JSON.stringify(allKeywords));
	} else {
		throw new Error("allKeywordsUpdate keywordAbilities too short");
	}
}

const convertAllRules = function(allRulesText) {
	const rawAllRules = replaceDoppelgangerChars(allRulesText);

	if (Object.keys(JSON.parse(rawAllRules)).length > 1000) {
		fs.writeFileSync(path.join(rootDir, "data_files/finalAllRules.json"), rawAllRules);
	} else {
		throw new Error("allRulesUpdate rules too short");
	}
}

function decompressXz(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);
    const decompress = lzma.createDecompressor();

    input.pipe(decompress).pipe(output);

    output.on('finish', resolve);
    output.on('error', reject);
    input.on('error', reject);
    decompress.on('error', reject);
  });
}

const time = function() {
	return (performance.now() - start).toFixed(1) + " ";
}

const doStuff = async function() {
	console.log("Checking for update")
	if (!await updateNeeded()) {
		console.log(time() + "No update needed.");
		return;
	}
	console.log(time() + "Update needed!");

	//We download all the files sequentially because it makes the code cleaner and performance doesn't really matter here. For all files we download a raw file and then write to a clean one only after checking there are no errors, so that a corrupted download won't corrupt our existing files.

	//All sets
	const allSetsText = await downloadFile("https://mtgjson.com/api/v5/SetList.json", path.join(rootDir, "data_files/rawAllSets.json"));
	console.log(time() + "rawAllSets downloaded");
	convertAllSets(allSetsText);
	console.log(time() + "allSets converted");

	//Metagame data.
	const mostPlayedApiUrls = JSON.parse(fs.readFileSync(path.join(rootDir, "mostPlayedApiUrls.json"), "utf8")); //URLs need to be hidden as the API is private.
	for (let format in mostPlayedApiUrls) {
		const upperCaseFormat = format[0].toUpperCase() + format.slice(1);
		const data = await downloadFile(mostPlayedApiUrls[format], path.join(rootDir, `data_files/rawMostPlayed${upperCaseFormat}.json`));
		console.log(time() + `Downloaded most played ${upperCaseFormat}`);

		try {
			const object = JSON.parse(data);
			fs.writeFileSync(path.join(rootDir, `data_files/mostPlayed${upperCaseFormat}.json`), JSON.stringify(object));
		} catch (e) {
			handleError(`Could not parse most played ${upperCaseFormat}`);
			return;
		}
	}

	//Keywords
	const allKeywordsText = await downloadFile("https://api.academyruins.com/cr/keywords", path.join(rootDir, "data_files/rawAllKeywords.json"));
	console.log(time() + "rawAllKeywords downloaded");
	convertAllKeywords(allKeywordsText);
	console.log(time() + "allKeywords converted");

	//Rules
	const allRulesText = await downloadFile("https://api.academyruins.com/cr", path.join(rootDir, "data_files/rawAllRules.json"));
	console.log(time() + "rawAllRules downloaded");
	convertAllRules(allRulesText);
	console.log(time() + "allRules converted");

	//All cards. We do this download last because it's the largest, so it's a waste of bandwidth if some other file has failed.
	await downloadFile("https://mtgjson.com/api/v5/AtomicCards.json.xz", path.join(rootDir, "data_files/rawAllCards.json.xz"));
	console.log(time() + "rawAllCards downloaded");
	await decompressXz(path.join(rootDir, "data_files/rawAllCards.json.xz"), path.join(rootDir, "data_files/rawAllCards.json"));
	console.log(time() + "rawAllCards decompressed")

	//Now do everything else with this data.
	updateAllCards();
}

const start = performance.now();
doStuff();