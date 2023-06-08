/*Encoding scheme:

**Leading 1**
Level (4 bits)
Complexity (3 bits)
Legality (3 bits)
Playable Only (1 bit)
Tags Conjunc (2 bits)
Rules Conjunc (2 bits)
Cards Conjunc (2 bits)
Expansions (10 bits per expansion)
**Separator** ("I")
Tags (9 bits per tag)
**Separator** ("I")
Rules (12 bits per rule, 1 bit for if there's a period at the end.)
**Separator** ("I")
Cards (15 bits per card)

Expansions is skipped if legality isn't "Choose Expansions". All other seperators are skipped if there are no tags, rules, or cards.

Tags, rules, and cards all have a 1 at the beginning after the seperator to avoid one being all 0s.

*/


//Returns a new sidebar settings object when given a searchlink string.
const convertSearchLinkToSettings = function(searchLink) {
	const newSidebarSettings = {
		"level": [],
		"complexity": [],
		"legality": "",
		"expansions": [],
		"playableOnly": false,
		"tags": [],
		"tagsConjunc": "",
		"rules": [],
		"rulesConjunc": "",
		"cards": [],
		"cardsConjunc": ""
	};
	const base59alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFHJKLMNOPQSTUVWXYZ";

	let nextSeperator = searchLink.indexOf("I");
	let binarySubString;
	if (nextSeperator !== -1) {
		binarySubString = baseConvert(searchLink.slice(0, nextSeperator), base59alphabet, "01");
		searchLink = searchLink.slice(nextSeperator + 1);
	} else {
		binarySubString = baseConvert(searchLink, base59alphabet, "01");
	}

	//Remove leading 1.
	binarySubString = binarySubString.slice(1);
	//Level.
	const levelOptions = ["1", "2", "3", "Corner Case"];
	for (let i = 0 ; i < 4 ; i++) {
		if (binarySubString[i] === "1") {
			newSidebarSettings.level.push(levelOptions[i]);
		}
	}
	binarySubString = binarySubString.slice(4);
	//Complexity
	const complexityOptions = ["Simple", "Intermediate", "Complicated"];
	for (let i = 0 ; i < 3 ; i++) {
		if (binarySubString[i] === "1") {
			newSidebarSettings.complexity.push(complexityOptions[i]);
		}
	}
	binarySubString = binarySubString.slice(3);
	//Legality.
	const legalityOptions = ["Standard", "Pioneer", "Modern", "All of Magic", "Choose Expansions"];
	const legalityBinary = binarySubString.slice(0,3);
	newSidebarSettings.legality = legalityOptions[parseInt(legalityBinary, 2)];
	binarySubString = binarySubString.slice(3);
	//Playable Only.
	const playableOnly = Boolean(parseInt(binarySubString.slice(0, 1)));
	newSidebarSettings.playableOnly = playableOnly;
	binarySubString = binarySubString.slice(1);
	//Conjunctions.
	const conjuncMapping = {
		"00": "AND",
		"01": "OR",
		"10": "NOT"
	}
	newSidebarSettings.tagsConjunc = conjuncMapping[binarySubString.slice(0,2)];
	binarySubString = binarySubString.slice(2);
	newSidebarSettings.rulesConjunc = conjuncMapping[binarySubString.slice(0,2)];
	binarySubString = binarySubString.slice(2);
	newSidebarSettings.cardsConjunc = conjuncMapping[binarySubString.slice(0,2)];
	binarySubString = binarySubString.slice(2);
	//
	//Expansions. Skipped if legality isn't "choose Expansions".
	if (binarySubString.length > 0) {
		const binarySetArray = [];
		while (binarySubString.length > 0) {
			binarySetArray.push(binarySubString.slice(0, 10));
			binarySubString = binarySubString.slice(10);
		}
		newSidebarSettings.expansions = [];
		for (let i in binarySetArray) {
			newSidebarSettings.expansions.push(searchLinkMappings.expansions[parseInt(binarySetArray[i], 2)]);
		}
	}
	//Remaining settings.
	if (searchLink.indexOf("I") > - 1) {
		const remainingBinarySubStrings = searchLink.split("I");
		for (let i in remainingBinarySubStrings) {
			remainingBinarySubStrings[i] = baseConvert(remainingBinarySubStrings[i], base59alphabet, "01");
			//Remove leading "1".
			remainingBinarySubStrings[i] = remainingBinarySubStrings[i].slice(1, remainingBinarySubStrings[i].length)
		}

		//Tags
		const binaryTagsArray = [];
		while (remainingBinarySubStrings[0].length > 0) {
			binaryTagsArray.push(remainingBinarySubStrings[0].slice(0, 9));
			remainingBinarySubStrings[0] = remainingBinarySubStrings[0].slice(9);
		}
		newSidebarSettings.tags = [];
		for (let i in binaryTagsArray) {
			newSidebarSettings.tags.push(searchLinkMappings.tags[parseInt(binaryTagsArray[i], 2)]);
		}

		//Rules 12 + 1
		const binaryRulesArray = [];
		while (remainingBinarySubStrings[1].length > 0) {
			binaryRulesArray.push(remainingBinarySubStrings[1].slice(0, 13));
			remainingBinarySubStrings[1] = remainingBinarySubStrings[1].slice(13);
		}
		newSidebarSettings.rules = [];
		for (let i in binaryRulesArray) {
			const binaryRule = binaryRulesArray[i].slice(0, 12);
			const isStrict = binaryRulesArray[i].slice(12) === "1";
			let rule = searchLinkMappings.rules[parseInt(binaryRule, 2)];
			if (isStrict) {
				rule += ".";
			}
			newSidebarSettings.rules.push(rule);
		}

		//Cards
		const binaryCardsArray = [];
		while (remainingBinarySubStrings[2].length > 0) {
			binaryCardsArray.push(remainingBinarySubStrings[2].slice(0, 15));
			remainingBinarySubStrings[2] = remainingBinarySubStrings[2].slice(15);
		}
		newSidebarSettings.cards = [];
		for (let i in binaryCardsArray) {
			newSidebarSettings.cards.push(searchLinkMappings.cards[parseInt(binaryCardsArray[i], 2)]);
		}
	}
	return newSidebarSettings;
}

//Returns a searchLink string when given a sidebar settings object.
const convertSettingsToSearchLink = function(sidebarSettings) {

	let binarySubString = "1",
			finalString = "",
			base59alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFHJKLMNOPQSTUVWXYZ";
	const padToLengthWithZeros = function(string, length) {
		while (string.length < length) {
			string = "0" + string;
		}
		return string;
	}
	//Level.
	const levelOptions = ["1", "2", "3", "Corner Case"];
	for (let i = 0 ; i < levelOptions.length ; i++) {
		if (sidebarSettings.level.includes(levelOptions[i])) {
			binarySubString += "1";
		} else {
			binarySubString += "0";
		}
	}
	//Complexity.
	const complexityOptions = ["Simple", "Intermediate", "Complicated"];
	for (let i = 0 ; i < complexityOptions.length ; i++) {
		if (sidebarSettings.complexity.includes(complexityOptions[i])) {
			binarySubString += "1";
		} else {
			binarySubString += "0";
		}
	}
	//Legality.
	const legalityOptions = ["Standard", "Pioneer", "Modern", "All of Magic", "Choose Expansions"];
	let legalityBinary = legalityOptions.indexOf(sidebarSettings.legality).toString(2);
	legalityBinary = padToLengthWithZeros(legalityBinary, 3);
	binarySubString += legalityBinary;
	//Playable Only.
	binarySubString += Number(sidebarSettings.playableOnly).toString();
	//Conjunctions.
	const conjuncMapping = {
		"AND": "00",
		"OR": "01",
		"NOT": "10"
	}
	binarySubString += conjuncMapping[sidebarSettings.tagsConjunc];
	binarySubString += conjuncMapping[sidebarSettings.rulesConjunc];
	binarySubString += conjuncMapping[sidebarSettings.cardsConjunc];
	//Expansions. Skipped if legality isn't "choose Expansions".
	if (sidebarSettings.legality === "Choose Expansions") {
		for (let i in sidebarSettings.expansions) {
			binarySubString += padToLengthWithZeros(searchLinkMappings.expansions.indexOf(sidebarSettings.expansions[i]).toString(2), 10);
		}
	}
	finalString += baseConvert(binarySubString, "01", base59alphabet);
	if (sidebarSettings.tags.length > 0 || sidebarSettings.rules.length > 0 || sidebarSettings.cards.length > 0) {

		//Tags
		binarySubString = "";
		for (let i in sidebarSettings.tags) {
			binarySubString += padToLengthWithZeros(searchLinkMappings.tags.indexOf(sidebarSettings.tags[i]).toString(2), 9);
		}
		finalString += "I";
		//Add a leading 1 to keep leading 0s.
		if (binarySubString.length > 0) {
			binarySubString = "1" + binarySubString;
		}
		finalString += baseConvert(binarySubString, "01", base59alphabet);

		//Rules
		binarySubString = "";
		for (let i in sidebarSettings.rules) {
			let isStrict,
					rule;
			if (sidebarSettings.rules[i].charAt(sidebarSettings.rules[i].length - 1) === ".") {
				isStrict = true;
				rule = sidebarSettings.rules[i].slice(0, sidebarSettings.rules[i].length - 1);
			} else {
				isStrict = false;
				rule = sidebarSettings.rules[i];
			}
			binarySubString += padToLengthWithZeros(searchLinkMappings.rules.indexOf(rule).toString(2), 12);
			//Add a bit for whether the period is there or not.
			if (isStrict) {
				binarySubString += "1";
			} else {
				binarySubString += "0";
			}
		}
		finalString += "I";
		//Add a leading 1 to keep leading 0s.
		if (binarySubString.length > 0) {
			binarySubString = "1" + binarySubString;
		}
		finalString += baseConvert(binarySubString, "01", base59alphabet);

		//Cards
		binarySubString = "";
		for (let i in sidebarSettings.cards) {
			binarySubString += padToLengthWithZeros(searchLinkMappings.cards.indexOf(sidebarSettings.cards[i]).toString(2), 15);
		}
		finalString += "I";
		//Add a leading 1 to keep leading 0s.
		if (binarySubString.length > 0) {
			binarySubString = "1" + binarySubString;
		}
		finalString += baseConvert(binarySubString, "01", base59alphabet);
	}

	return finalString;
}

document.getElementById("searchLink").value = "https://rulesguru.net/?RG" + convertSettingsToSearchLink(sidebarSettings) + "GG";

//Go to a random question if the URL contains a searchLink
if (typeof goToSearchLink === "undefined") {
	goToSearchLink = false;
}
if (goToSearchLink) {
	const newSidebarSettings = convertSearchLinkToSettings(searchLink);
	for (let i in newSidebarSettings) {
		sidebarSettings[i] = newSidebarSettings[i];
	}

	//Log this request so we know how often people are using searchLinks.
	const dataToLog = JSON.parse(JSON.stringify(sidebarSettings));
	dataToLog.goToQuestionNum = goToQuestionNum;
	const httpRequest = new XMLHttpRequest();
	httpRequest.open("POST", "/logSearchLinkData", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send(JSON.stringify(dataToLog));

  if ((typeof goToQuestionNum === "number")){ // Search link + specific question
    document.getElementById("FOUCOverlay").style.display = "none";
	  document.getElementById("startPage").style.display = "none";
	  goToQuestion(goToQuestionNum, function() {
		  toggleAnimation("stop");
	  });
	} else {
	  if (typeof doSomethingOnSidebarSettingsUpdate !== "undefined") {
		  doSomethingOnSidebarSettingsUpdate();
	  }
	  displayNextRandomQuestion();
	  let intervalID = {"intervalID": 0};
	  intervalID.intervalID = setInterval(function(intervalID) {
		  if (nextQuestion) {
			  setTimeout(function() {
				  toggleAnimation("stop");
				  setTimeout(function() {
					  alert(`You've been linked to a specific set of search criteria. You'll be shown a random question that matches those criteria, and can click "next question" to see more matching questions. To view or change your search criteria, click the settings button in the upper left.`);
				  }, 20);
			  }, 0)
			  clearInterval(intervalID.intervalID);
		  }
	  }, 100, intervalID);
  }
}
