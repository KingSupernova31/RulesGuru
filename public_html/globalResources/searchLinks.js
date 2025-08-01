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

const baseConvert = function(string, inputAlphabet, outputAlphabet) {
	if (string == "" || inputAlphabet == "" || outputAlphabet == "") {
		return "";
	}
	const add = (x, y, base) => {
		let z = [];
		const n = Math.max(x.length, y.length);
		let carry = 0;
		let i = 0;
		while (i < n || carry) {
			const xi = i < x.length ? x[i] : 0;
			const yi = i < y.length ? y[i] : 0;
			const zi = carry + xi + yi;
			z.push(zi % base);
			carry = Math.floor(zi / base);
			i++;
		}
		return z;
	}
	const multiplyByNumber = (num, power, base) => {
		if (num < 0) return null;
		if (num == 0) return [];
		let result = [];
		while (true) {
			num & 1 && (result = add(result, power, base));
			num = num >> 1;
			if (num === 0) break;
			power = add(power, power, base);
		}
		return result;
	}
	// decodeInput finds the position of each character in alphabet, thus
	// decoding the input string into a useful array.
	const decodeInput = (string) => {
		const digits = string.split('');
		let arr = [];
		for (let i = digits.length - 1; i >= 0; i--) {
			const n = inputAlphabet.indexOf(digits[i])
			// Continue even if character is not found (possibly a padding character.)
			// if (n == -1) return null;
			if (n == -1) continue;
			arr.push(n);
		}
		return arr;
	}
	const fromBase = inputAlphabet.length;
	const toBase = outputAlphabet.length;
	const digits = decodeInput(string);
	if (digits === null) return null;
	// Get an array of what each position of character should be.
	let outArray = [];
	let power = [1];
	for (let i = 0; i < digits.length; i++) {
		outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
		power = multiplyByNumber(fromBase, power, toBase);
	}
	// Finally, decode array into characters.
	let out = '';
	for (let i = outArray.length - 1; i >= 0; i--) {
		out += outputAlphabet[outArray[i]];
	}
	if (out === "") {
		return "0";
	} else {
		return out;
	}
}

//Returns a new sidebar settings object when given a searchlink string.
const convertSearchLinkToSettings = function(searchLink, searchLinkMappings) {
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
	if (binarySubString[0] === "0") {
		return false;
	}
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
	if (parseInt(legalityBinary, 2) > 4) {
		return false;
	}
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
	if (newSidebarSettings.tagsConjunc === undefined || newSidebarSettings.rulesConjunc === undefined || newSidebarSettings.cardsConjunc === undefined) {
		return false;
	}
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
			const expansion = searchLinkMappings.expansions[parseInt(binarySetArray[i], 2)];
			newSidebarSettings.expansions.push(expansion);
			if (expansion === undefined) {
				return false;
			}
		}
	}
	//Remaining settings.
	if (searchLink.indexOf("I") > - 1) {
		const remainingBinarySubStrings = searchLink.split("I");
		for (let i in remainingBinarySubStrings) {
			remainingBinarySubStrings[i] = baseConvert(remainingBinarySubStrings[i], base59alphabet, "01");
			//Remove leading "1".
			if (remainingBinarySubStrings[0] === "0") {
				return false;
			}
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
			if (searchLinkMappings.tags[parseInt(binaryTagsArray[i], 2)] === undefined) {
				return false;
			}
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
			if (searchLinkMappings.rules[parseInt(binaryRule, 2)] === undefined) {
				return false;
			}
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
			if (searchLinkMappings.cards[parseInt(binaryCardsArray[i], 2)] === undefined) {
				return false;
			}
			newSidebarSettings.cards.push(searchLinkMappings.cards[parseInt(binaryCardsArray[i], 2)]);
		}
	}
	return newSidebarSettings;
}

//Returns a searchLink string when given a sidebar settings object.
const convertSettingsToSearchLink = function(sidebarSettings, searchLinkMappings) {

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

if (typeof document === "object") {
	document.getElementById("searchLink").value = "https://rulesguru.org/?RG" + convertSettingsToSearchLink(sidebarSettings, searchLinkMappings) + "GG";
}

//Go to a random question if the URL contains a searchLink
if (typeof goToSearchLink === "undefined") {
	goToSearchLink = false;
}
if (goToSearchLink) {
	const result = convertSearchLinkToSettings(searchLink, searchLinkMappings);
	console.log("Logging for issue #104 on Github. (Section 1)")
	console.log(searchLink)
	console.log(result)
	if (result === false) {
		alert("The link you've followed is invalid. You'll be taken to the homepage.");
		returnToHome(false);
	} else {
		const newSidebarSettings = result;

		//Log this request so we know how often people are using searchLinks.
		const dataToLog = JSON.parse(JSON.stringify(newSidebarSettings));
		dataToLog.goToQuestionNum = goToQuestionNum;

		fetch("/logSearchLinkData", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(dataToLog)
		});

	  if ((typeof goToQuestionNum === "number")){ // Search link + specific question
	    document.getElementById("FOUCOverlay").style.display = "none";
		  document.getElementById("startPage").style.display = "none";
		  goToQuestion(goToQuestionNum, function() {
			  toggleAnimation("stop");
		  }, newSidebarSettings);
		} else {
			for (let i in newSidebarSettings) {
				sidebarSettings[i] = newSidebarSettings[i];
			}
			console.log("Logging for issue #104 on Github. (Section 2)")
			console.log(JSON.stringify(sidebarSettings))
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
}

if (typeof module === "object") {
	module.exports.convertSearchLinkToSettings = convertSearchLinkToSettings;
	module.exports.convertSettingsToSearchLink = convertSettingsToSearchLink;
};