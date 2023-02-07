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

const manualDungeons = [{"printings":["AFR"],"colorIdentity":[],"colors":[],"keywords":["Scry"],"layout":"dungeon","legalities":{"commander":"Legal","duel":"Legal","legacy":"Legal","modern":"Legal","pioneer":"Legal","vintage":"Legal"},"name":"Dungeon of the Mad Mage","setCode":"TAFR","subtypes":[],"supertypes":[],"text":"Yawning Portal — You gain 1 life. (Leads to: Dungeon Level)\nDungeon Level — Scry 1. (Leads to: Goblin Bazaar, Twisted Caverns)\nGoblin Bazaar — Create a Treasure token. (Leads to: Lost Level)\nTwisted Caverns — Target creature can't attack until your next turn. (Leads to: Lost Level)\nLost Level — Scry 2. (Leads to: Runestone Caverns, Muiral's Graveyard)\nRunestone Caverns — Exile the top two cards of your library. You may play them. (Leads to: Deep Mines)\nMuiral's Graveyard — Create two 1/1 black Skeleton creature tokens. (Leads to: Deep Mines)\nDeep Mines — Scry 3. (Leads to: Mad Wizard's Lair)\nMad Wizard's Lair — Draw three cards and reveal them. You may cast one of them without paying its mana cost.","type":"Dungeon","types":["Dungeon"]},{"printings":["AFR"],"colorIdentity":[],"colors":[],"keywords":["Scry"],"layout":"dungeon","legalities":{"commander":"Legal","duel":"Legal","legacy":"Legal","modern":"Legal","pioneer":"Legal","vintage":"Legal"},"name":"Lost Mine of Phandelver","setCode":"TAFR","subtypes":[],"supertypes":[],"text":"Cave Entrance — Scry 1. (Leads to: Goblin Lair, Mine Tunnels)\nGoblin Lair — Create a 1/1 red Goblin creature token. (Leads to: Storeroom, Dark Pool)\nMine Tunnels — Create a Treasure token. (Leads to: Dark Pool, Fungi Cavern)\nStoreroom — Put a +1/+1 counter on target creature. (Leads to: Temple of Dumathoin)\nDark Pool — Each opponent loses 1 life and you gain 1 life. (Leads to: Temple of Dumathoin)\nFungi Cavern — Target creature gets -4/-0 until your next turn. (Leads to: Temple of Dumathoin)\nTemple of Dumathoin — Draw a card.","type":"Dungeon","types":["Dungeon"]},{"printings":["AFR"],"colorIdentity":[],"colors":[],"layout":"dungeon","legalities":{"commander":"Legal","duel":"Legal","legacy":"Legal","modern":"Legal","pioneer":"Legal","vintage":"Legal"},"name":"Tomb of Annihilation","setCode":"TAFR","subtypes":[],"supertypes":[],"text":"Trapped Entry — Each player loses 1 life. (Leads to: Veils of Fear, Oubliette)\nVeils of Fear — Each player loses 2 life unless they discard a card. (Leads to: Sandfall Cell)\nSandfall Cell — Each player loses 2 life unless they sacrifice a creature, artifact, or land. (Leads to: Cradle of the Death God)\nOubliette — Discard a card and sacrifice a creature, an artifact, and a land. (Leads to: Cradle of the Death God)\nCradle of the Death God — Create The Atropal, a legendary 4/4 black God Horror creature token with deathtouch.","type":"Dungeon","types":["Dungeon"]}];

const updateAllCards = function() {
	try {
		const notFlatAllCards = JSON.parse(fs.readFileSync("data_files/rawAllCards.json", "utf8")).data;

		//I hate Unstable and mystery booster.
		const cardsThatAreAwful = ["Target Minotaur", "Secret Base", "Novellamental", "Extremely Slow Zombie", "Beast in Show", "Amateur Auteur", "Garbage Elemental", "Target Minotaur", "Sly Spy", "Knight of the Kitchen Sink", "Everythingamajig", "Ineffable Blessing", "Very Cryptic Command", "Start // Fire", "B.F.M. (Big Furry Monster)", "Smelt // Herd // Saw"];
		for (let i of cardsThatAreAwful) {
			delete notFlatAllCards[i];
		}
		notFlatAllCards["Unquenchable Fury"].shift(0);//This is also the name of one the weird Theros cards.

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

		//Add in meld cards and dungeons manually.
		for (let i in manualMeldCards) {
			allCards[manualMeldCards[i].name] = manualMeldCards[i];
		}
		for (let i in manualDungeons) {
			allCards[manualDungeons[i].name] = manualDungeons[i];
		}

		//Add in missing values.
		let missingArrays = ["colors", "colorIdentity", "types", "subtypes", "keywords", "playability", "colorIndicator"];
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

		//Remove Arena-only cards.
		for (let i in allCards) {
			if (allCards[i].name.startsWith("A-")) {
				delete allCards[i];
				continue;
			}
			if (allCards[i].legalities.alchemy && !allCards[i].legalities.vintage) {
				delete allCards[i];
			}
		}

		//remove Un-cards, 1996 World Champ, vanguards, conspiracies, mystery booster, etc.
		for (let i in allCards) {
			if (!allCards[i].legalities || Object.keys(allCards[i].legalities).length === 0 || allCards[i].types.includes("Conspiracy")) {
				delete allCards[i];
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
			for (let j in allCards[i].colorIndicator) {
				allCards[i].colorIndicator[j] = colorMappings[allCards[i].colorIndicator[j]];
			}
		}

		//Remove redundant layouts and fix incorrect layouts. Left over afterwards: "normal", "split (half)", "split (full)", "flip", "transforming double-faced", "modal double-faced" "meld", "adventurer", "other".
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
		const abilityWords = JSON.parse(fs.readFileSync("data_files/finalAllKeywords.json", "utf8")).abilityWords;
		const abilityWordRegex = new RegExp("(" + abilityWords.join("|") + ") — ", "g");
		const flavorWords = ["Acid Breath", "Animate Walking Statue", "Anitmagic Cone", "Archery", "Bardic Inspiration", "Beacon of Hope", "Bear Form", "Befriend Them", "Bewitching Whispers", "Binding Contract", "Brave the Stench", "Break Their Chains", "Charge Them", "Clever Conjurer", "Climb Over", "Combat Inspiration", "Cold Breath", "Cone of Cold", "Cunning Action", "Cure Wounds", "Dispel Magic", "Displacement", "Dissolve", "Distract the Guard", "Divine Intervention", "Dominate Monster", "Drag Below", "Engulf", "Fear Ray", "Fend Them Off", "Fight the Current", "Find a Crossing", "Flurry of Blows", "Foil Their Scheme", "Form a Party", "Gentle Repose", "Grant an Advantage", "Hide", "Interrogate Them", "Intimidate Them", "Journey On", "Keen Senses", "Learn Their Secrets", "Life Drain", "Lift the Curse", "Lightning Breath", "Magical Tinkering", "Make a Retreat", "Make Camp", "Poison Breath", "Pry It Open", "Psionic Spells", "Rappel Down", "Rejuvenation", "Rouse the Party", "Search the Body", "Search the Room", "Set Off Traps", "Siege Monster", "Smash It", "Smash the Chest", "Song of Rest", "Split", "Stand and Fight", "Start a Brawl", "Steal Its Eyes", "Stunning Strike", "Tail Spikes", "Teleport", "Tie Up", "Tragic Backstory", "Trapped!", "Two-Weapon Fighting", "Whirlwind", "Whispers of the Grave", "Wild Magic Surge"];
		const flavorWordRegex = new RegExp("(" + flavorWords.join("|") + ") — ", "g");
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
		//Create a list of all subtypes.
		const allRules = JSON.parse(fs.readFileSync("data_files/finalAllRules.json"));
		const isolatedSubtypeLists = [];
		const allCreatureTypes = [];
		isolatedSubtypeLists.push(allRules["205.3m"].ruleText.match(/The \w+ types are ((and )?([a-zA-Z-'’]+)( \(.+?\))?(, |\.))+/)[0]);
		for (let i in isolatedSubtypeLists) {
			//let iteratible = [...isolatedSubtypeLists[i].matchAll(/(and )?([a-zA-Z-']+)( \(.+?\))?(, |\.)/g)];
			//Needed because matchAll is not supported:
			let iteratible = [];
			let regex = /(and )?([a-zA-Z-'’]+)( \(.+?\))?(, |\.)/g;
			let lastIndexes = {};
			let match;
			lastIndexes[regex.lastIndex] = true;
			while (match = regex.exec(isolatedSubtypeLists[i])) {
				lastIndexes[regex.lastIndex] = true;
				iteratible.push(match);
			}
			for (let j in iteratible) {
				allCreatureTypes.push(iteratible[j][2]);
			}
		}

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

		if (allCardsProbablyValid(allCards) === true) {
			fs.writeFileSync("data_files/finalAllCards.json", JSON.stringify(allCards));
			console.log("Finished updating all cards.");
			disperseFiles();
		} else {
			handleError(new Error(`allCards probably not valid. Issue: ${allCardsProbablyValid(allCards)}`));
		}
	} catch (err) {
		handleError(err);
	}
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
		writeCardList(allCards, "allCards.json", ["name", "names", "manaCost", "type", "rulesText", "power", "toughness", "loyalty", "layout", "legalities", "printingsName", "types", "side", "supertypes", "subtypes", "manaValue", "colors", "colorIndicator", "keywords", "playability", "colorIdentity"], "json");
		writeCardList(allCards, "public_html/question-editor/allCards.js", ["name", "names", "rulesText", "power", "toughness", "loyalty", "layout", "types", "type", "side", "supertypes", "subtypes", "manaValue", "colors", "colorIndicator", "manaCost", "keywords", "colorIdentity"], "js");

		//SearchLink mappings.
		updateSearchLinkMappings();

		console.log("Finished dispersing all cards");
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

const downloadAllFiles = function() {

	let finishedDownloads = 0;
	downloadFile("data_files/rawAllKeywords.json", "https://api.academyruins.com/keywords", function() {
		try {
			console.log("rawAllKeywords downloaded");
			const allKeywords = JSON.parse(fs.readFileSync("data_files/rawAllKeywords.json", "utf8"));
			if (Object.keys(allKeywords).length === 3 && allKeywords.keywordAbilities.length > 30) {
				for (let i in allKeywords.abilityWords) {
					allKeywords.abilityWords[i] = allKeywords.abilityWords[i][0].toUpperCase() + allKeywords.abilityWords[i].slice(1);
				}
				fs.writeFileSync("data_files/finalAllKeywords.json", JSON.stringify(allKeywords));
				finishedDownloads++;
				if (finishedDownloads === 7) {
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
		console.log("rawAllCards downloaded");
		finishedDownloads++;
		if (finishedDownloads === 7) {
			updateAllCards();
		}
	});

	const apiUrls = JSON.parse(fs.readFileSync("mostPlayedApiUrls.json", "utf8")); //URLs need to be hidden as the API is private.

	downloadFile("data_files/mostPlayedStandard.json", apiUrls.standard, function() {
		console.log("mostPlayedStandard downloaded");
		finishedDownloads++;
		if (finishedDownloads === 7) {
			updateAllCards();
		}
	});

	downloadFile("data_files/mostPlayedPioneer.json", apiUrls.pioneer, function() {
		console.log("mostPlayedPioneer downloaded");
		finishedDownloads++;
		if (finishedDownloads === 7) {
			updateAllCards();
		}
	});

	downloadFile("data_files/mostPlayedModern.json", apiUrls.modern, function() {
		console.log("mostPlayedModern downloaded");
		finishedDownloads++;
		if (finishedDownloads === 7) {
			updateAllCards();
		}
	});

	downloadFile("data_files/rawAllSets.json", "https://mtgjson.com/api/v5/AllPrintings.json", function() {
		console.log("rawAllSets downloaded");
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
				if (finishedDownloads === 7) {
					updateAllCards();
				}
			} else {
				handleError(new Error("allSetsUpdate array too short"));
			}
		} catch (err) {
			handleError(err);
		}
	});

	downloadFile("data_files/rawAllRules.json", "https://api.academyruins.com/allrules", function() {
		console.log("rawAllRules downloaded");
		try {
			const rawAllRules = fs.readFileSync("data_files/rawAllRules.json", "utf8");
			if (Object.keys(JSON.parse(rawAllRules)).length > 1000) {
				fs.writeFileSync("data_files/finalAllRules.json", rawAllRules);
				finishedDownloads++;
				if (finishedDownloads === 7) {
					updateAllCards();
				}
			} else {
				handleError(new Error("allRulesUpdate rules too short"));
			}
		} catch (err) {
			handleError(err);
		}
	});
}

downloadAllFiles();

const allCardsProbablyValid = function(allCards) {//MTGJSON has a tendency to break things, so we perform some checks on the data to try and prevent these errors from making it into RulesGuru data.
	const allCardNames = Object.keys(allCards);
	const testCardData = JSON.parse(fs.readFileSync("testCardData.json", "utf8"));
	const cardsThatShouldNotExist = ["Chaos Orb", "Goblin Game", "Target Minotaur", "B.F.M. (Big Furry Monster)", "Knight of the Kitchen Sink", "Smelt // Herd // Saw", "Extremely Slow Zombie", "Arlinn Kord Emblem", "Angel", "Saproling", "Imprision this Insolent Witch", "Intervention of Keranos", "Plot that spans Centuries", "Eight-and-a-Half-Tails Avatar", "Ashnod", "Ashling the Pilgrim Avatar", "Phoebe, Head of S.N.E.A.K.", "Rules Lawyer", "Angel of Unity", "Academy at Tolaria West", "All in Good Time", "Behold My Grandeur", "Reality Shaping", "Robot Chicken", "Metagamer", "Nerf War", "Sword of Dungeons & Dragons", "Dragon", "Richard Garfield, Ph.D.", "Proposal", "Phoenix Heart", "The Legend of Arena", "Fabled Path of Searo Point", "Only the Best", "Rarity", "1996 World Champion", "Shichifukujin Dragon", "Hymn of the Wilds", "A-Armory Veteran"];

	for (let cardName of cardsThatShouldNotExist) {
		if (allCardNames.includes(cardName)) {
			return `${cardName} exists. It should not.`;
		}
	}

	if (allCardNames.length < 20000) {return `Too few cards; only ${allCardNames.length}`;}

	const duplicatedCards = allCardNames.filter(function(item, index) {return allCardNames.indexOf(item) != index});
	if (duplicatedCards.length > 0) {return `${duplicatedCards[0]} (and ${duplicatedCards.length - 1} others) are duplicated.`;}

	for (let testCard in testCardData) {
		if (!allCardNames.includes(testCardData[testCard].name)) {return `${testCardData[testCard].name} doesn't exist.`;}

		if (testCard !== testCardData[testCard].name) {return `A card is entered under "${testCard}" but has name "${testCardData[testCard].name}".`;}

		const props = Object.keys(testCardData[testCard]);
		for (let prop of props) {
			if (!["printingsName", "printingsCode", "playability"].includes(prop)) {//These three can change with future releases. (So can all the others, but errata/bans/new formats is much rarer than a reprint.)
				if (JSON.stringify(testCardData[testCard][prop]) !== JSON.stringify(allCards[testCard][prop])) {
					return `${testCard}'s ${prop} property does not match. (New prop is ${JSON.stringify(allCards[testCard][prop]).slice(0,100)})`;
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
const testCards = ["Lightning Bolt", "Sylvan Library", "Selesnya Guildgate", "Curiosity", "Mogis's Warhound", "Phantom Carriage", "Wildsong Howler", "Aberrant Researcher", "Fire // Ice", "Illusion", "Breya, Etherium Shaper", "Accorder's Shield", "+2 Mace", "Erayo, Soratami Ascendant", "Kenzo the Hardhearted", "Shahrazad", "Brisela, Voice of Nightmares", "Graf Rats", "Bonecrusher Giant", "Treats to Share", "Mistform Ultimus", "Dungeon of the Mad Mage", "Dangerous", "Nameless Race", "Dryad Arbor", "Tamiyo, Compleated Sage", "Memory", "Progenitus", "Transguild Courier", "Bear Cub", "Branchloft Pathway", "Grist, the Hunger Tide", "Emeria, Shattered Skyclave", "Space Beleren", "Void Beckoner", "Ajani's Pridemate", "Unquenchable Fury", "Helm of Kaldra", "Herald of Anafenza", "Thunderheads", "Jiang Yanggu", "Teferi's Response", "Sol Ring", "Command Tower", "Forest", "Ranar the Ever-Watchful", "Hanweir Battlements", "Commander's Plate", "Black Knight", "Deathmist Raptor", "Absorb Vis", "Yidris, Maelstrom Wielder", "Pack Rat", "Dredge", "Conflux", "Tajuru Paragon", "Ghostfire", "Abstruse Interference", "Prossh, Skyraider of Kher", "Avenger of Zendikar", "Start // Finish", "Arlinn Kord", "Tamiyo's Journal", "Gruul Guildgate", "Black Dragon", "Smelt", "Erase", "Unholy Heat"];

	const testCardData = {};
	for (let card in allCards) {
		if (testCards.includes(allCards[card].name)) {
			testCardData[card] = allCards[card];
		}
	}
	fs.writeFileSync("testCardData.json", JSON.stringify(testCardData));
	*/
