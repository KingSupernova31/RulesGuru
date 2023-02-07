"use strict";

document.getElementById("topBannerRightText").appendChild(document.getElementById("rulesLink"));
document.getElementById("topBannerRightText").appendChild(document.getElementById("adminAboutLink"));

let questionObj = {
	"cardLists": [],
	"cardTemplates": []
};
//Fill in options for the tag input.
const populateAdminTagsDropdown = function() {
	let options = "";
	for (let i in allTags) {
		options += "<option value=\"" + allTags[i].replace(/"/g, "&quot;") + "\" />";
	}
	document.getElementById("tagsList").innerHTML = options;
}
populateAdminTagsDropdown();

if (typeof allCardNames !== undefined) {
	window.allCardNames = Object.keys(allCards);
}
let allCardNamesLowerCase = Object.keys(allCards);
allCardNamesLowerCase.forEach(function(element, index) {
	allCardNamesLowerCase[index] = element.toLowerCase();
});

const updateQuestionInfoFields = function() {
	if (currentQuestionData.status) {
		document.getElementById("questionInfo").style.display = "block";
		document.getElementById("currentID").textContent = currentQuestionData.id;
		if (currentQuestionData.status === "finished") {
			document.getElementById("status").textContent = "Finished";
			document.getElementById("status").style.color = "green";
		} else if (currentQuestionData.status === "pending") {
			document.getElementById("status").textContent = "Pending";
			document.getElementById("status").style.color = "orange";
		} else if (currentQuestionData.status === "awaiting verification") {
			const verificationsNeeded = [];
			for (let role of ["grammarGuru", "templateGuru", "rulesGuru"]) {
				if (currentQuestionData.verification[role] === null) {
					verificationsNeeded.push(role);
				}
			}
			document.getElementById("status").textContent = "Awaiting Verification: " + convertRolesToHumanText(verificationsNeeded);
			document.getElementById("status").style.color = "blue";
		}
	} else {
		document.getElementById("questionInfo").style.display = "none";
	}
}

//Handle tag entry.
let currentTags = [];
const addTag = function(tag) {
	if (tag.length > 3 && !currentTags.includes(tag) && allTags.includes(tag)) {
		let newTag = document.createElement("li");
		newTag.addEventListener("click", removeTag);
		newTag.appendChild(document.createTextNode(tag));
		document.getElementById("tagList").appendChild(newTag);
		document.getElementById("tagInput").value = "";
		currentTags.push(tag);
		if (previewWindow) {
			previewWindow.parentData.questionObj.tags = currentTags;
			previewWindow.parentData.updateText = true;
			validateWithWorker();
		}
	}
};
const removeTag = function() {
	currentTags.splice(currentTags.indexOf(this.textContent),1);
	this.parentElement.removeChild(this);
	if (previewWindow) {
		previewWindow.parentData.questionObj.tags = currentTags;
		previewWindow.parentData.updateText = true;
		validateWithWorker();
	}
};

//Handle card generator entry.
let allCardsDatalist = document.createElement("datalist");
allCardsDatalist.setAttribute("id", "allCardsDatalist");
allCardsDatalist.innerHTML = cardOptions;

let cardGeneratorNum = 1;

let oldTemplateValue,
		oldMultiEntryValue;

let templateObserver;
const addCardGenerator = function() {
	//Create all necessary elements.
	let newCardGenerator = document.createElement("li");
	let image = document.createElement("img");
	let label = document.createElement("h4");
	let input = document.createElement("input");
	let lineBreak = document.createElement("br");
	let templateButton = document.createElement("button");
	let multiEntryButton = document.createElement("button");
	let modeSwitch = document.createElement("button");
	let cardCount = document.createElement("p");
	let subCardGeneratorList = document.createElement("ul");
	let subCardGeneratorTemplate = document.createElement("ul");

	//Assign classes.
	newCardGenerator.setAttribute("class", "cardGenerator");
	image.setAttribute("class", "cardGeneratorX");
	label.setAttribute("class", "cardGeneratorLabel");
	templateButton.setAttribute("class", "templateButton specialButtonBlack");
	multiEntryButton.setAttribute("class", "multiEntryButton specialButtonBlack");
	modeSwitch.setAttribute("class", "modeSwitchButton specialButtonBlack");
	cardCount.setAttribute("class", "cardCount")
	subCardGeneratorList.setAttribute("class", "subCardGeneratorList");
	subCardGeneratorTemplate.setAttribute("class", "subCardGeneratorTemplate");

	//Misc attributes.
	newCardGenerator.setAttribute("id", `cardGenerator${cardGeneratorNum}`);
	image.setAttribute("src", "/globalResources/icons/red-x.png");
	label.textContent = "Card Generator " + (cardGeneratorNum) + " (List) :";
	input.setAttribute("list", "allCardsDatalist");
	templateButton.textContent = "View";
	multiEntryButton.textContent = "View";
	modeSwitch.textContent = "Switch to Template";
	cardCount.textContent = "(0)";

	//Delete the generator when clicked, deincrementing the ids of the following generator.
	image.addEventListener("click", function(event) {
		if (confirm(`Delete card generator ${Number(this.parentElement.id.slice(13))}?`)) {
			questionObj.cardLists.splice(this.parentElement.id.slice(13) - 1, 1);
			questionObj.cardTemplates.splice(this.parentElement.id.slice(13) - 1, 1);
			convertedTemplateStorage.splice(this.parentElement.id.slice(13) - 1, 1)
			let regex = new RegExp(`\\[card ${this.parentElement.id.slice(13)}\\]`, "g");
			let question = document.getElementById("question");
			let answer = document.getElementById("answer");
			question.value = question.value.replace(regex, `[deleted]`);
			answer.value = answer.value.replace(regex, `[deleted]`);
			for (let i = Number(this.parentElement.id.slice(13)) ; document.getElementById(`cardGenerator${i}`) ; i++) {
				if (document.getElementById(`cardGenerator${i}`).childNodes[6].textContent === "Switch to Template") {
					document.getElementById(`cardGenerator${i}`).getElementsByTagName('h4')[0].textContent = `Card generator ${i - 1} (List):`;
				} else {
					document.getElementById(`cardGenerator${i}`).getElementsByTagName('h4')[0].textContent = `Card generator ${i - 1} (Template):`;
				}
				document.getElementById(`cardGenerator${i}`).setAttribute("id", `cardGenerator${i - 1}`);
				question.value = question.value.replace(new RegExp(`\\[card ${i }\\]`, "g"), `[card ${i - 1}]`);
				answer.value = answer.value.replace(new RegExp(`\\[card ${i}\\]`, "g"), `[card ${i - 1}]`);
			}
			cardGeneratorNum--;
			this.parentElement.remove();
		}
	});

	//There's lag whenever a large datalist is part of the DOM, so we remove it when it's not needed.
	input.addEventListener("focus", function(event) {
		document.querySelector("body").appendChild(allCardsDatalist);
	});
	input.addEventListener("blur", function(event) {
		document.querySelector("body").removeChild(allCardsDatalist);
	});
	//Add cards to the displayed list when the user presses enter.
	input.addEventListener("keypress", function(event) {
		if (event.keyCode === 13 && allCardNamesLowerCase.includes(this.value.toLowerCase())) {
			for (let i in allCardNames) {
				if (allCardNames[i].toLowerCase() === this.value.toLowerCase()) {
					this.value = allCardNames[i];
				}
			}
			if (!questionObj.cardLists[this.parentElement.id.slice(13) - 1].includes(this.value)) {
				let newCard = document.createElement("li");
				let image = document.createElement("img");
				newCard.setAttribute("class", "subCard");
				newCard.addEventListener("click", function(event) {
					questionObj.cardLists[this.parentElement.parentElement.id.slice(13) - 1].splice(questionObj.cardLists[this.parentElement.parentElement.id.slice(13) - 1].indexOf(this.textContent),1);
					this.parentElement.parentElement.childNodes[7].textContent = `(${questionObj.cardLists[this.parentElement.parentElement.id.slice(13) - 1].length})`;
					this.parentElement.removeChild(this);
					event.stopPropagation();
				});
				image.setAttribute("src", "/globalResources/icons/red-x.png");
				image.setAttribute("class", "subCardGeneratorX");
				newCard.appendChild(image);
				newCard.appendChild(document.createTextNode(this.value));
				this.parentElement.getElementsByTagName('ul')[0].appendChild(newCard);
				questionObj.cardLists[this.parentElement.id.slice(13) - 1].push(this.value);
				this.value = "";
				this.parentElement.childNodes[7].textContent = `(${questionObj.cardLists[this.parentElement.id.slice(13) - 1].length})`;
			}
		}
	});

	//Multi-entry
	multiEntryButton.addEventListener("click", function(event) {
		document.getElementById("cardGeneratorgreyout").style.display = "block";
		document.getElementById("multiEntryDiv").style.display = "block";
		document.getElementById("multiEntryText").value = questionObj.cardLists[this.parentElement.id.slice(13) - 1].join("\n");
		document.querySelector("#multiEntryDiv h3").textContent = `Edit list ${Number(this.parentElement.id.slice(13))}`;
		document.querySelector("#multiEntryDiv p").textContent = `Add or remove cards from card list ${Number(this.parentElement.id.slice(13))}. Each card must be on its own line, and spelled correctly.`;
		var x = window.scrollX;
		var y = window.scrollY;
		document.getElementById("multiEntryText").select();
		if (previewWindow) {
			previewWindow.parentData.currentGeneratorOpen = true;
			previewWindow.parentData.currentGeneratorStatusChanged = true;
			previewWindow.parentData.currentGeneratorType = "list";
			updatePreviewForMultiEntry();
		}
		oldMultiEntryValue = document.getElementById("multiEntryText").value;
	});

	//Templates
	templateButton.addEventListener("click", function(event) {
		const templateNum = Number(this.parentElement.id.slice(13) - 1);
		document.getElementById("cardGeneratorgreyout").style.display = "block";
		document.getElementById("templateScrollContainer").style.display = "block";
		document.querySelector("#templateDiv h3").textContent = `Add rules to template ${templateNum + 1}`;
		document.getElementById("addORGroupButton").textContent = "Add OR group";
		for (let i in questionObj.cardTemplates[templateNum]) {
			addTemplateRule(questionObj.cardTemplates[templateNum][i].field, questionObj.cardTemplates[templateNum][i].operator, questionObj.cardTemplates[templateNum][i].value, questionObj.cardTemplates[templateNum][i].fieldOption, questionObj.cardTemplates[templateNum][i].orGroup);
		}
		oldTemplateValue = createTemplate();
		if (previewWindow) {
			const validatedTemplate = validateTemplate(oldTemplateValue);
			previewWindow.parentData.currentGeneratorOpen = true;
			previewWindow.parentData.currentGeneratorStatusChanged = true;
			previewWindow.parentData.currentGeneratorType = "template";
			previewWindow.parentData.currentGenerator = templateConvert(validatedTemplate.templateWithValidRulesOnly, allCards);
			previewWindow.parentData.currentGeneratorErrors = validatedTemplate.templateErrors;
		}
	});
	convertedTemplateStorage.push([]);

	//Switch between template and list mode
	modeSwitch.addEventListener("click", function(event) {
		switchModes(event.target.parentNode.id);
	});

	//Add all the elements to the DOM.
	newCardGenerator.appendChild(image);
	newCardGenerator.appendChild(label);
	newCardGenerator.appendChild(input);
	newCardGenerator.appendChild(lineBreak);
	newCardGenerator.appendChild(templateButton);
	newCardGenerator.appendChild(multiEntryButton);
	newCardGenerator.appendChild(modeSwitch);
	newCardGenerator.appendChild(cardCount);
	newCardGenerator.appendChild(subCardGeneratorList);
	newCardGenerator.appendChild(subCardGeneratorTemplate);
	document.getElementById("cardGenerators").appendChild(newCardGenerator);

	cardGeneratorNum++;
	questionObj.cardLists.push([]);
	questionObj.cardTemplates.push([]);
}

//Create a list of all subtypes.
const subtypeRules = ["205.3g", "205.3h", "205.3i", "205.3j", "205.3k", "205.3m"];
const isolatedSubtypeLists = [];
const allSubtypes = [];
for (let i in subtypeRules) {
	isolatedSubtypeLists.push(allRules[subtypeRules[i]].ruleText.match(/The \w+ types are ((and )?([a-zA-Z-'’]+)( \(.+?\))?(, |\.))+/)[0]);
}
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
		allSubtypes.push(iteratible[j][2]);
	}
}
allSubtypes.sort();
let subtypeOptions = "";
for (let i in allSubtypes) {
	subtypeOptions += "<option value=\"" + allSubtypes[i].replace(/"/g, "&quot;") + "\" />";
};
const subtypeDatalist = document.createElement("datalist");
subtypeDatalist.setAttribute("id", "subtypeDatalist");
subtypeDatalist.innerHTML = subtypeOptions;
document.body.appendChild(subtypeDatalist);

allKeywords.keywordAbilities.sort();
let keywordOptions = "";
for (let i in allKeywords.keywordAbilities) {
	keywordOptions += "<option value=\"" + allKeywords.keywordAbilities[i].replace(/"/g, "&quot;") + "\" />";
};
const keywordDatalist = document.createElement("datalist");
keywordDatalist.setAttribute("id", "keywordDatalist");
keywordDatalist.innerHTML = keywordOptions;
document.body.appendChild(keywordDatalist);

let templateErrors = [];
const createTemplate = function() {
	let template = [];
	let rules = document.getElementsByClassName("templateRule");

	for (let i = 0 ; i < rules.length ; i++) {
		let rule;
		if (rules[i].childNodes.length === 4) {
			rule = {
				"field": rules[i].childNodes[1].textContent,
				"operator": rules[i].childNodes[2].value,
				"value": rules[i].childNodes[3].value,
				"orGroup": isNaN(Number(rules[i].dataset.orgroup)) ? null : Number(rules[i].dataset.orgroup),
			}
		} else if (rules[i].childNodes.length === 5) {
			rule = {
				"field": rules[i].childNodes[1].textContent,
				"fieldOption": rules[i].childNodes[2].value,
				"operator": rules[i].childNodes[3].value,
				"value": rules[i].childNodes[4].value,
				"orGroup": isNaN(Number(rules[i].dataset.orgroup)) ? null : Number(rules[i].dataset.orgroup),
			}
		}
		template.push(rule);
	}
	return template;
};

let currentQuestionData = {};

const validateTemplate = function(inputTemplate) {
	const template = JSON.parse(JSON.stringify(inputTemplate));
	templateErrors = [];

	for (let i in template) {
		let thisRuleErrored = false;
		//Blank fields
		if (!["Toughness", "Power", "Loyalty", "Mana cost"].includes(template[i].field)) {
			if (template[i].value === "") {
				templateErrors.push(`${template[i].field} cannot be blank.`);
				thisRuleErrored = true;
			}
		}
		//Invalid subtypes
		if (template[i].field === "Subtypes") {
			if (!allSubtypes.includes(template[i].value)) {
				templateErrors.push(`"${template[i].value}" is not a valid subtype.`);
				thisRuleErrored = true;
			}
		}
		//Invalid mana cost
		if (template[i].field === "Mana cost") {
			const allowedSymbols = ["{W}", "{U}", "{B}", "{R}", "{G}", "{X}", "{Y}", "{C}", "{S}", "{P}", "{W/P}", "{U/P}", "{B/P}", "{R/P}", "{G/P}", "{2/W}", "{2/U}", "{2/B}", "{2/R}", "{2/G}", "{W/U}", "{W/B}", "{U/B}", "{U/R}", "{B/R}", "{B/G}", "{R/W}", "{R/G}", "{G/W}", "{G/U}", "{W/U/P}", "{W/B/P}", "{U/B/P}", "{U/R/P}", "{B/R/P}", "{B/G/P}", "{R/W/P}", "{R/G/P}", "{G/W/P}", "{G/U/P}", "::white::", "::blue::", "::black::", "::red::", "::green::", "::hybrid::", "::generic::", "::phyrexian::"];
			let workingSymbolString = template[i].value;
			outerloop: while (workingSymbolString.length > 0) {
				for (let symbol of allowedSymbols) {
					if (workingSymbolString.startsWith(symbol)) {
						workingSymbolString = workingSymbolString.slice(symbol.length);
						continue outerloop;
					}
				}
				templateErrors.push(`Cannot parse "${workingSymbolString}" as one or more valid mana symbols.`)
				thisRuleErrored = true;
				break;
			}
		}
		//Regexes
		if (template[i].field === "Rules text") {
			if (template[i].operator === "Matches:" || template[i].operator === "Does not match:") {
				try {
					new RegExp(template[i].value);
				} catch (error) {
					templateErrors.push(`"${template[i].value}" is not a valid regular expression.`);
					thisRuleErrored = true;
				}
			}
		}
		//Power, toughness, and loyalty with <>.
		if (["Toughness", "Power", "Loyalty"].includes(template[i].field)) {
			if (template[i].operator === ">" || template[i].operator === "<") {
				if (!/^\d+$/.test(template[i].value)) {
					templateErrors.push(`"${template[i].value}" is not a valid ${template[i].field[0].toLowerCase() + template[i].field.slice(1)} with operator "${template[i].operator}".`);
					thisRuleErrored = true;
				}
			}
		}
		//Power, toughness, and loyalty with =.
		if (["Toughness", "Power", "Loyalty"].includes(template[i].field)) {
			if (template[i].operator === "=") {
				if (!/^[0-9*\-+X]+$/.test(template[i].value)) {
					templateErrors.push(`"${template[i].value}" is not a valid ${template[i].field[0].toLowerCase() + template[i].field.slice(1)} with operator "=".`);
					thisRuleErrored = true;
				}
			}
		}
		if (thisRuleErrored) {
			template.splice(i, 1);
			i--;
		}
	}

	return {
		"templateWithValidRulesOnly": template,
		"templateErrors": templateErrors
	};
}

const switchModes = function(generatorId) {
	const generator = document.getElementById(generatorId);
	const genNum = generatorId.slice(13);
	if (generator.childNodes[6].textContent === "Switch to Template") {
		generator.childNodes[6].textContent = "Switch to List";
		generator.childNodes[2].style.display = "none";
		generator.childNodes[5].style.display = "none";
		generator.childNodes[4].style.display = "inline";
		generator.childNodes[8].style.display = "none";
		generator.childNodes[9].style.display = "";
		generator.childNodes[7].textContent = "(" + generator.childNodes[9].childNodes.length + ")";
		generator.childNodes[1].textContent = "Card Generator " + genNum + " (Template):";
	} else if (generator.childNodes[6].textContent === "Switch to List") {
		generator.childNodes[6].textContent = "Switch to Template";
		generator.childNodes[2].style.display = "inline";
		generator.childNodes[5].style.display = "inline";
		generator.childNodes[4].style.display = "none";
		generator.childNodes[8].style.display = "";
		generator.childNodes[9].style.display = "none";
		generator.childNodes[7].textContent = "(" + generator.childNodes[8].childNodes.length + ")";
		generator.childNodes[1].textContent = "Card Generator " + genNum + " (List):";
	}
}

let datalistNum = 0;
const addTemplateRule = function(field, operator, value, fieldOption, orGroup) {
	let deleteButton = document.createElement("img");
	deleteButton.setAttribute("src", "/globalResources/icons/red-x.png");
	deleteButton.setAttribute("class", "templateRuleDeleteButton");
	//Delete the rule when clicked.
	deleteButton.addEventListener("click", function(event) {
			this.parentElement.remove();
	});
	let rule = document.createElement("div");
	rule.setAttribute("class", "templateRule");
	if (orGroup !== undefined) {
		rule.dataset.orgroup = orGroup;
	} else {
		rule.dataset.orgroup = "null";
	}
	let label = document.createElement("p");
	label.addEventListener("click", labelListener);
	label.textContent = field;
	let operatorSelect = document.createElement("select");
	let operators = [];
	let fieldOptions = [];
	let values = [];
	let valuesText = [];
	let tooltip;
	switch (field) {
		case "Layout":
			operators = ["Is:", "Not:"];
			values = ["normal", "split (half)", "split (full)", "flip", "transforming double-faced", "modal double-faced", "meld", "adventurer"];
			valuesText = ["Normal", "Split (half)", "Split (full)", "Flip", "Transforming Double-Faced", "Modal Double-Faced", "Meld", "Adventurer"];
			break;
		case "Multi-part side":
			operators = ["Is:", "Not:"];
			values = ["a", "b"];
			valuesText = ["A", "B"];
			tooltip = `"A": Front face of a double-faced card, unflipped flip card, left half of a split card, unmelded face of a meld card default characteristics of an adventurer card.
			<br><br>
			"B": Back face of a double-faced card, flipped flip card, right half of a split card, melded face of a meld pair, alternative characteristics of an adventurer card.`;
			break;
		case "Colors":
			operators = ["Includes:", "Doesn't include:"];
			values = ["White", "Blue", "Black", "Red", "Green"];
			break;
		case "Color indicator":
			operators = ["Includes:", "Doesn't include:"];
			values = ["White", "Blue", "Black", "Red", "Green"];
			break;
		case "Color identity":
			operators = ["Includes:", "Doesn't include:"];
			values = ["White", "Blue", "Black", "Red", "Green"];
			break;
		case "Mana cost":
			operators = ["Includes:", "Doesn't include:", "Exactly:"];
			tooltip = `The order of the symbols doesn't matter. You can use ::generic::, ::phyrexian::, ::hybrid::, and ::[color]:: to match multiple symbols.<br><br>If "Doesn't include" is selected, only cards that don't have <b>all</b> of those symbols are returned. If "don't have <b>any</b>" is the desired query, use multiple "Doesn't include" rules.`;
			break;
		case "Mana value":
			operators = ["=", ">", "<"];
			break;
		case "Supertypes":
			operators = ["Includes:", "Doesn't include:"];
			values = ["Basic", "Legendary", "Snow", "World"];
			break;
		case "Types":
			operators = ["Includes:", "Doesn't include:"];
			values = ["Artifact", "Creature", "Enchantment", "Instant", "Land", "Planeswalker", "Sorcery", "Tribal"];
			break;
		case "Subtypes":
			operators = ["Includes:", "Doesn't include:"];
			values = allSubtypes;
			break;
		case "Rules text":
			operators = ["Contains:", "Does not contain:", "Matches:", "Does not match:"];
			tooltip = `You can substitute "::name::" for the name of the card. Mana symbols and other symbols can be included in braces, the full list of symbols is on the admin information page. "Contains" and "Does not contain" are case-insensitive plaintext, "Matches" and "Does not match" are case-sensitive regular expressions.`;
			break;
		case "Keywords":
			operators = ["Includes:", "Doesn't include:"];
			values = allKeywords.keywordAbilities.concat(allKeywords.keywordActions);
			break;
		case "Power":
			operators = ["=", ">", "<"];
			tooltip = `Non-numerical powers such as "1+*" are supported. The ">" and "<" operators will not return cards with non-numerical powers.`;
			break;
		case "Toughness":
			operators = ["=", ">", "<"];
			tooltip = `Non-numerical toughnesses such as "1+*" are supported. The ">" and "<" operators will not return cards with non-numerical toughnesses.`;
			break;
		case "Loyalty":
			operators = ["=", ">", "<"];
			tooltip = `Non-numerical loyalties such as "X" are supported. The ">" and "<" operators will not return cards with non-numerical loyalties.`;
			break;
		case "Number of":
			fieldOptions = ["Colors", "Color identity", "Color indicator", "Keywords", "Subtypes", "Supertypes", "Types"];
			operators = ["=", ">", "<"];
			break;
	}

	if (fieldOptions.length > 0) {
		var fieldOptionsSelect = document.createElement("select");
		for (let i in fieldOptions) {
			const currentOp = document.createElement("option");
			currentOp.textContent = fieldOptions[i];
			fieldOptionsSelect.appendChild(currentOp);
		}
		if (fieldOption) {fieldOptionsSelect.value = fieldOption;}
	}

	for (let i in operators) {
		const currentOp = document.createElement("option");
		currentOp.textContent = operators[i];
		operatorSelect.appendChild(currentOp);
	}
	if (operator) {operatorSelect.value = operator;}
	let valueInput;
	if (values.length > 0 && values.length <= 10) {
		valueInput = document.createElement("select");
		for (let i in values) {
			const currentVal = document.createElement("option");
			if (valuesText.length > 0) {
				currentVal.textContent = valuesText[i];
				currentVal.value = values[i];
			} else {
				currentVal.textContent = values[i];
			}
			valueInput.appendChild(currentVal);
		}
	} else {
		if (["Rules text", "Mana cost"].includes(field)) {
			valueInput = document.createElement("textarea");
			valueInput.addEventListener("focus", function() {
				this.parentNode.childNodes[3].style.height = "6rem";
			});
			valueInput.addEventListener("blur", function() {
				this.parentNode.childNodes[3].style.width = "";
				this.parentNode.childNodes[3].style.height = "";
			});
		} else {
			valueInput = document.createElement("input");
		}
		if (values.length > 0) {
			if (field === "Subtypes") {
				datalistNum++;
				const datalist = document.createElement("datalist");
				datalist.setAttribute("id", "datalist" + datalistNum);
				datalist.innerHTML = subtypeOptions;
				document.body.appendChild(datalist);
				//valueInput.setAttribute("list", "datalist" + datalistNum);
				valueInput.setAttribute("list", "subtypeDatalist");
			} else if (field === "Keywords") {
				datalistNum++;
				const datalist = document.createElement("datalist");
				datalist.setAttribute("id", "datalist" + datalistNum);
				datalist.innerHTML = keywordOptions;
				document.body.appendChild(datalist);
				//valueInput.setAttribute("list", "datalist" + datalistNum);
				valueInput.setAttribute("list", "keywordDatalist");
			}
		}
	}
	if (tooltip) {
		label.setAttribute("tooltip", tooltip.replace(/"/, "&quot"));
	}
	valueInput.setAttribute("class", "templateInput");
	//Converts single right quotes to apostrophes in template fields.
	valueInput.addEventListener("input", function(event) {
		setTimeout(function(srcElement) {
			srcElement.value = srcElement.value.replace(/’/g, "'");
		}, 0, event.srcElement)
	});

	if (field === "Mana value") {
		rule.classList.add("templateRuleWithLongName");
	}

	if (value) {valueInput.value = value;}
	rule.appendChild(deleteButton);
	rule.appendChild(label);
	if (fieldOptionsSelect) {
		rule.appendChild(fieldOptionsSelect);
		rule.classList.add("templateRuleWithExtra");
	} else {

	}
	rule.appendChild(operatorSelect);
	rule.appendChild(valueInput);
	document.getElementById("templateRules").appendChild(rule);
}

const addOrGroup = function() {
	const rules = document.getElementsByClassName("templateRule");
	let allOrGroupsInUse = [];
	for (let rule of rules) {
		if (rule.dataset.orgroup && rule.dataset.orgroup !== "null") {
			allOrGroupsInUse.push(isNaN(Number(rule.dataset.orgroup)) ? null : Number(rule.dataset.orgroup));
		}
	}
	for (let i = 0 ; i < 5 ; i++) {
		if (!allOrGroupsInUse.includes(i)) {
			currentORGroup = i;
			break;
		}
	}

	if (document.getElementById("addORGroupButton").textContent === "Add OR group") {
		document.getElementById("addORGroupButton").textContent = "Done";
		selectingORGroup = true;
	} else {
		document.getElementById("addORGroupButton").textContent = "Add OR group";
		selectingORGroup = false;
	}
}

let currentORGroup;
let selectingORGroup = false;
const labelListener = function() {
	if (!selectingORGroup) {
		return;
	}
	if (this.parentNode.dataset.orgroup === "null") {
		this.parentNode.dataset.orgroup = currentORGroup;
	} else if (this.parentNode.dataset.orgroup === currentORGroup.toString()) {
		this.parentNode.dataset.orgroup = "null";
	}
}

//Close the template box and add the template to the questionObj.
const processTemplateBox = function() {
	let template = createTemplate();
	let validatedTemplate = validateTemplate(template);
	if (validatedTemplate.templateErrors.length === 0) {
		const templateNum = document.getElementById("templateBoxHeading").textContent.slice(22) - 1;
		closeTemplateBox();
		questionObj.cardTemplates[templateNum] = template;
		displayTemplateCardSet(template, templateNum);
	} else {
		alert(validatedTemplate.templateErrors.join("\n"));
	}
	selectingORGroup = false;
}

const closeTemplateBox = function() {
	document.getElementById("cardGeneratorgreyout").style.display = "none";
	document.getElementById("templateScrollContainer").style.display = "none";
	document.getElementById("templateRules").innerHTML = "";
	if (previewWindow) {
		previewWindow.parentData.currentGeneratorOpen = false;
		previewWindow.parentData.currentGeneratorStatusChanged = true;
	}
	selectingORGroup = false;
}

const createQuestionObj = function() {
	const newQuestionObj = {};

	newQuestionObj.level = document.getElementById("level").value;
	newQuestionObj.complexity = document.getElementById("complexity").value;
	newQuestionObj.tags = currentTags;
	newQuestionObj.question = document.getElementById("question").value;
	newQuestionObj.answer = document.getElementById("answer").value;

	//Combine the card lists and templates into one array for submission.
	let finalCardGeneratorArray = JSON.parse(JSON.stringify(questionObj.cardLists));
	for (let i = 0 ; i < finalCardGeneratorArray.length ; i++) {
		if (document.getElementById(`cardGenerator${i + 1}`).childNodes[6].textContent === "Switch to List") {
			finalCardGeneratorArray[i] = questionObj.cardTemplates[i];
		}
	}
	newQuestionObj.cardGenerators = finalCardGeneratorArray;
	return newQuestionObj;
}

const askUserToValidateQuestion = function(validation) {
	if (validation.errors.length > 0) {
		alert(validation.errors[0]);
		return false;
	}
	for (let i = 0 ; i < validation.warnings.length ; i++) {
		if (!confirm(validation.warnings[i] + " Continue anyway?")) {
			return false;
		}
	}
	return true;
}

const getIntersectionOfAdminRolesAndQuestionVerification = function(lookingFor) {
	const result = [];
	for (let role of ["grammarGuru", "templateGuru", "rulesGuru"]) {
		if (lookingFor === "verified") {
			if (currentQuestionData.verification && currentLoggedInAdmin.roles[role] && typeof currentQuestionData.verification[role] === "number") {
				result.push(role);
			}
		} else {
			if (currentQuestionData.verification && currentLoggedInAdmin.roles[role] && currentQuestionData.verification[role] === null) {
				result.push(role);
			}
		}
	}
	return result;
};

const convertRolesToHumanText = function(roles) {
	const humanNames = [];

	for (let role of roles) {
		if (role === "grammarGuru") {
			humanNames.push("Grammar");
		}
		if (role === "templateGuru") {
			humanNames.push("Templates");
		}
		if (role === "rulesGuru") {
			humanNames.push("Rules");
		}
	}

	let humanString = "";
	humanNames.forEach((item, i) => {
		if (humanString.length > 0) {
			humanString += ", ";
		}
		humanString += item;
	});
	return humanString;
};

const updateButtonsAndUnsavedChanges = function(unsavedChanges) {
	turnOffQuestionStuffObserver();
	questionHasUnsavedChanges = unsavedChanges;
	const applicableVerifiedRoles = getIntersectionOfAdminRolesAndQuestionVerification("verified");
	const applicableUnverifiedRoles = getIntersectionOfAdminRolesAndQuestionVerification("unverified");
	//Update button
	if (questionHasUnsavedChanges && currentQuestionData.status === "pending") {
		document.getElementById("updateButton").style.display = "block";
		document.getElementById("updateButton").textContent = "Update";
	} else {
		document.getElementById("updateButton").style.display = "none";
	}
	//Change status upwards button
	if (currentQuestionData.status === "pending") {
		document.getElementById("changeStatusUpwards").style.display = "block";
		document.getElementById("changeStatusUpwards").textContent = "Approve";
	} else if (currentQuestionData.status === "awaiting verification") {
		if (applicableUnverifiedRoles.length > 0) {
			document.getElementById("changeStatusUpwards").style.display = "block";
			document.getElementById("changeStatusUpwards").textContent = "Verify: " + convertRolesToHumanText(applicableUnverifiedRoles);
		} else {
			document.getElementById("changeStatusUpwards").style.display = "none";
		}
	} else if (currentQuestionData.status === "finished") {
		document.getElementById("changeStatusUpwards").style.display = "none";
	} else {
		document.getElementById("changeStatusUpwards").style.display = "none";
	}
	//Change status downwards button
	if (currentQuestionData.status === "pending") {
		document.getElementById("changeStatusDownwards").style.display = "none";
	} else if (currentQuestionData.status === "awaiting verification") {
		if (currentLoggedInAdmin.id === currentQuestionData.verification.editor) {
			document.getElementById("changeStatusDownwards").style.display = "block";
			document.getElementById("changeStatusDownwards").textContent = "Unapprove";
		} else if (applicableVerifiedRoles.length > 0) {
			document.getElementById("changeStatusDownwards").style.display = "block";
			document.getElementById("changeStatusDownwards").textContent = "Unverify: " + convertRolesToHumanText(applicableVerifiedRoles);
		} else {
			document.getElementById("changeStatusDownwards").style.display = "none";
		}
	} else if (currentQuestionData.status === "finished") {
		document.getElementById("changeStatusDownwards").style.display = "none";
	} else {
		document.getElementById("changeStatusDownwards").style.display = "none";
	}
	//Duplicate button
	if (currentQuestionData.id) {
		document.getElementById("submitButton").textContent = "Duplicate Question";
	} else {
		document.getElementById("submitButton").textContent = "Submit as New Question";
	}

	if (questionHasUnsavedChanges) {
		document.getElementById("changeStatusUpwards").textContent = "Update & " + document.getElementById("changeStatusUpwards").textContent;
		document.getElementById("changeStatusDownwards").textContent = "Update & " + document.getElementById("changeStatusDownwards").textContent;
	} else {
		turnOnQuestionStuffObserver();
	}
};

const update = function() {
	document.getElementById("cursorStyle").innerHTML = "* {cursor: wait !important;}";
	setTimeout(function() { //This forces the cursor to update immediately since it waits for all synchronous code to finish.
		const requestObj = {
			"questionObj": createQuestionObj(),
			"password": document.getElementById("password").value
		}
		if (currentQuestionData.status === "finished") {
			if (!askUserToValidateQuestion(validateSync(requestObj.questionObj))) {
				document.getElementById("cursorStyle").innerHTML = "";
				return;
			}
		}
		requestObj.questionObj.id = currentQuestionData.id;
		requestObj.questionObj.submitterName = document.getElementById("submitterName").value.trim();
		const httpRequest = new XMLHttpRequest();
		httpRequest.timeout = 5000;
		httpRequest.onabort = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an error updating the question. (Request aborted.) Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.onerror = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an unknown error updating the question. Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.ontimeout = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an error updating the question. (Request timed out.) Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.onload = function() {
			document.getElementById("cursorStyle").innerHTML = "";
			if (httpRequest.status === 200) {
				if (httpRequest.response) {
					getQuestionCount();
					const response = JSON.parse(httpRequest.response);
					if (response.message === "Incorrect password." || response.message === "That question doesn't exist.") {
					} else {
						setTimeout(getQuestionsList, 50, displayQuestionsList);
					}
					if (response.message === `Question #${requestObj.questionObj.id} updated successfully.`) {
						updateButtonsAndUnsavedChanges(false);
					}
					alert(response.message);
				} else {
					alert("There was an error updating the question. (Server returned no response.) Please check your internet connection and try again. If the problem persists, please report the issue.");
				}
			} else {
				alert(`There was an error updating the question. (Server returned status code ${httpRequest.status}.) Please check your internet connection and try again. If the problem persists, please report the issue.`)
			}
		}
		httpRequest.open("POST", "/updateQuestion", true);
		httpRequest.setRequestHeader("Content-Type", "application/json");
		httpRequest.send(JSON.stringify(requestObj));
	}, 0);
};

const submit = function() {
	document.getElementById("cursorStyle").innerHTML = "* {cursor: wait !important;}";
	setTimeout(function() {//This forces the cursor to update immediately since it waits for all synchronous code to finish.
		const requestObj = {
			"questionObj": createQuestionObj(),
			"password": document.getElementById("password").value
		}
		if (!askUserToValidateQuestion(validateSync(requestObj.questionObj))) {
			document.getElementById("cursorStyle").innerHTML = "";
			return;
		}
		if (!currentQuestionData.id) {
			requestObj.questionObj.submitterName = currentLoggedInAdmin.name;
		}
		//Send the request.
		const httpRequest = new XMLHttpRequest();
		httpRequest.timeout = 5000;
		httpRequest.onabort = function() {
			document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an error submitting your question. (Request aborted.) Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.onerror = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an unknown error submitting your question. Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.ontimeout = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an error submitting your question. (Request timed out.) Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.onload = function() {
			document.getElementById("cursorStyle").innerHTML = "";
			if (httpRequest.status === 200) {
				if (httpRequest.response) {
					getQuestionCount();
					const response = JSON.parse(httpRequest.response);
					if (response.error) {
						alert(response.message);
					} else {
						turnOffQuestionStuffObserver();
						if (!currentQuestionData.id) {
							if (currentLoggedInAdmin.roles.owner) {
								document.getElementById("questionSubmitterNameFieldOwner").style.display = "block";
							} else {
								document.getElementById("questionSubmitterNameFieldEditor").style.display = "block";
								document.getElementById("questionSubmitterNameFieldEditor").textContent = "Submitted by " + currentLoggedInAdmin.name || "";
							}
							document.getElementById("submitterName").value = currentLoggedInAdmin.name;
						}
						currentQuestionData.id = response.id;
						currentQuestionData.status = response.status;
						currentQuestionData.verification = response.verification;
						updateQuestionInfoFields();
						getTagData();
						updateButtonsAndUnsavedChanges(false);
						alert(response.message);
						setTimeout(getQuestionsList, 50, displayQuestionsList);
					}
				} else {
					alert("There was an error submitting your question. (Server returned no response.) Please report this error.");
				}
			} else {
				alert(`There was an error submitting your question. (Server returned status code "${httpRequest.status}".) Please report this error.`);
			}
		}
		httpRequest.open("POST", "/submitAdminQuestion", true);
		httpRequest.setRequestHeader("Content-Type", "application/json");
		httpRequest.send(JSON.stringify(requestObj));
	}, 0);
}

const executeClearFieldsButton = function() {
	if (questionHasUnsavedChanges) {
		if (confirm('Your question has unsaved changes. Clear all fields anyway?')) {
			clearFields();
		}
	} else {
		clearFields();
	}
}

const clearFields = function() {
	turnOffQuestionStuffObserver();
	document.getElementById("level").value = "";
	document.getElementById("complexity").value = "";
	currentTags = [];
	document.getElementById("tagList").innerHTML = "";
	document.getElementById("tagInput").value = "";
	document.getElementById("question").value = "";
	document.getElementById("answer").value = "";
	document.getElementById("cardGenerators").innerHTML = "";
	document.getElementById("questionSubmitterNameFieldOwner").style.display = "none";
	document.getElementById("questionSubmitterNameFieldEditor").style.display = "none";
	document.getElementById("submitterName").value = "";
	document.getElementById("getQuestionIdInput").value = "";
	currentQuestionData = {};
	updateQuestionInfoFields();
	cardGeneratorNum = 1;
	questionObj = {
		"cardLists": [],
		"cardTemplates": []
	};
	updateButtonsAndUnsavedChanges(false);
}

const getUnfinishedQuestion = function() {
	if (questionHasUnsavedChanges) {
		if (!confirm('Your question has unsaved changes. Load new question anyway?')) {
			return;
		}
	}

	document.getElementById("cursorStyle").innerHTML = "* {cursor: wait !important;}";
	const httpRequest = new XMLHttpRequest();
	httpRequest.timeout = 5000;
	httpRequest.onabort = function() {
		document.getElementById("cursorStyle").innerHTML = "";
		alert("Error: abort");
	}
	httpRequest.onerror = function() {
		document.getElementById("cursorStyle").innerHTML = "";
		alert("Error: error");
	}
	httpRequest.ontimeout = function() {
		document.getElementById("cursorStyle").innerHTML = "";
		alert("Error: timeout");
	}
	httpRequest.onload = function() {
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				const response = JSON.parse(httpRequest.response);
				document.getElementById("cursorStyle").innerHTML = "";
				if (response.error) {
					alert(response.message);
				} else {
					currentQuestionData.id = response.question.id;
					currentQuestionData.status = response.question.status;
					currentQuestionData.verification = response.question.verification;
					populateFields(response.question);
				}
			} else {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("Error: Server returned no response.");
			}
		} else {
			document.getElementById("cursorStyle").innerHTML = "";
			alert(`Error: Status code "${httpRequest.status}".`);
		}
	}
	httpRequest.open("POST", "/getUnfinishedQuestion", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send(JSON.stringify({"password": document.getElementById("password").value}));
}

const populateFields = function(question) {
	clearFields();
	turnOffQuestionStuffObserver();
	document.getElementById("level").value = question.level;
	document.getElementById("complexity").value = question.complexity;
	for (let i in question.tags) {
		addTag(question.tags[i]);
	}
	document.getElementById("question").value = question.question;
	document.getElementById("answer").value = question.answer;

	//Fix for a bug, can remove once all pending questions have been finished.
	if (!question.cardGenerators) {
		alert("This shouldn't have happened, let Isaac know. You can continue editing without issue.")
		question.cardGenerators = [];
	}

	for (let i = 0 ; i < question.cardGenerators.length ; i++) {
		addCardGenerator();
		if (typeof question.cardGenerators[i][0] === "string") {
			for (let j in question.cardGenerators[i]) {
				let event = new Event("keypress");
				event.keyCode = 13;
				let element = document.querySelector(`#cardGenerator${i + 1} input`);
				element.value = question.cardGenerators[i][j];
				element.dispatchEvent(event);
			}
		} else {
			document.querySelector("#templateDiv h3").textContent = `Add rules to template ${i - - 1}`;
			for (let j in question.cardGenerators[i]) {
				addTemplateRule(question.cardGenerators[i][j].field, question.cardGenerators[i][j].operator, question.cardGenerators[i][j].value, question.cardGenerators[i][j].fieldOption, question.cardGenerators[i][j].orGroup);
			}
			processTemplateBox();
			switchModes(`cardGenerator${i + 1}`);
		}
	}

	document.getElementById("submitterName").value = question.submitterName || "";
	if (currentLoggedInAdmin.roles.owner) {
		if (question.id) {
			document.getElementById("questionSubmitterNameFieldOwner").style.display = "block";
		}
	} else {
		if (question.id && question.submitterName) {
			document.getElementById("questionSubmitterNameFieldEditor").style.display = "block";
			document.getElementById("questionSubmitterNameFieldEditor").textContent = "Submitted by " + question.submitterName || "";
		}
	}

	currentQuestionData = {
		"status": question.status,
		"id": question.id,
		"verification": question.verification
	};
	updateQuestionInfoFields();
	updateButtonsAndUnsavedChanges(false);
	document.getElementById("cursorStyle").innerHTML = "";

	document.getElementById("forceStatusNewId").value = "";
}

let activeGetQuestionIdRequest = null;

const getQuestionId = function(id) {
	if (questionHasUnsavedChanges) {
		if (!confirm('Your question has unsaved changes. Load new question anyway?')) {
			return;
		}
	}
	if (activeGetQuestionIdRequest) {
			activeGetQuestionIdRequest.abort();
	}
	document.getElementById("cursorStyle").innerHTML = "* {cursor: wait !important;}";
	const httpRequest = new XMLHttpRequest();
	activeGetQuestionIdRequest = httpRequest;
	httpRequest.timeout = 5000;
	httpRequest.onabort = function() {
		document.getElementById("cursorStyle").innerHTML = "";
		console.log("Request aborted");
	}
	httpRequest.onerror = function() {
		document.getElementById("cursorStyle").innerHTML = "";
		alert("Error: error");
	}
	httpRequest.ontimeout = function() {
		document.getElementById("cursorStyle").innerHTML = "";
		alert("Error: timeout");
	}
	httpRequest.onload = function() {
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				if (httpRequest.response === "Incorrect password.") {
					document.getElementById("cursorStyle").innerHTML = "";
					alert("Error: Incorrect password.");
				} else {
					if (httpRequest.response === "That question doesn't exist.") {
						document.getElementById("cursorStyle").innerHTML = "";
						alert("Error: That question doesn't exist.");
					} else {
						populateFields(JSON.parse(httpRequest.response));
					}
				}
			} else {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("Error: Server returned no response.");
			}
		} else {
			document.getElementById("cursorStyle").innerHTML = "";
			alert(`Error: Status code "${httpRequest.status}".`);
		}
	}
	httpRequest.open("POST", "/getSpecificAdminQuestion", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send(JSON.stringify({"password": document.getElementById("password").value, "id": id}));
}

document.getElementById("getQuestionIdInput").addEventListener("keypress", function(event) {
	if (event.keyCode === 13 && this.value !== "") {
		getQuestionId(this.value);
	}
})

const processMultiEntry = function() {
	let cardList = document.getElementById('multiEntryText').value.split("\n");
	for (let i = 0 ; i < cardList.length ; i++) {
		cardList[i] = cardList[i].trim();
		if (cardList[i] === "") {
			cardList.splice(i, 1);
			i--;
		}
	}
	if (JSON.stringify(cardList) === `[""]`) {
		cardList = [];
	}
	for (let i = 0 ; i < cardList.length ; i++) {
		if (!allCardNamesLowerCase.includes(cardList[i].toLowerCase())) {
			if (confirm(`${cardList[i]} is not a valid card. Delete it and continue?`)) {
				cardList.splice(i, 1);
				i--;
			} else {
				document.getElementById('multiEntryText').value = cardList.join("\n");
				return;
			}
		}
	}
	let affectedList = Number(document.getElementById("multiEntryHeading").textContent.slice(10));
	let element = document.querySelector(`#cardGenerator${affectedList} input`);
	let event = new Event("keypress");
	event.keyCode = 13;

	questionObj.cardLists[affectedList - 1] = [];
	document.querySelector(`#${document.getElementById(`cardGenerator${affectedList}`).id} ul`).innerHTML = "";
	document.querySelector(`#${document.getElementById(`cardGenerator${affectedList}`).id}`).childNodes[7].textContent = "(0)";

	for (let i in cardList) {
		element.value = cardList[i];
		element.dispatchEvent(event);
	}
	element.value = "";

	closeMultiEntry();
}

const closeMultiEntry = function() {
	document.getElementById("cardGeneratorgreyout").style.display = "none";
	document.getElementById("multiEntryDiv").style.display = "none";
	document.getElementById("multiEntryText").value = "";
	window.onscroll=function(){};
	if (previewWindow) {
		previewWindow.parentData.currentGeneratorOpen = false;
		previewWindow.parentData.currentGeneratorStatusChanged = true;
	}
}

const convertTypingRealTime = function(element) {
	let newValue = element.value,
			cursorPos = element.selectionStart;
	if (element.selectionStart !== element.selectionEnd) {
		return;
	}
	//General text changes:

	//Remove double spaces.
	newValue = newValue.replace(/ {2,}/g, function(match, offset) {
		if (offset < cursorPos && cursorPos < offset + match.length) {//Do nothing if the cursor is within the spaces.
			return match;
		} else {
			if (offset < cursorPos) {
				cursorPos = cursorPos - (match.length - 1);
			}
			return " ";
		}
	});

	//Replace quotes with better quotes.
	newValue = newValue.replace(/’/g, "'");
	newValue = newValue.replace(/“/g, "\"");
	newValue = newValue.replace(/”/g, "\"");

	//Capitalize the first letter at the beginning of a sentence after a parenthetical statement.
	newValue = newValue.replace(/\. \([^()]+?\) ([a-z])/g, function(match, capt1, index) {
		const letterToReplace = index + match.length;
		if (letterToReplace === cursorPos || letterToReplace === cursorPos + 1) {
			return match;
		}
		return match.slice(0, -1) + capt1[0].toUpperCase() + capt1.substring(1);
	});
	//Capitalize the first letter at the beginning of a sentence after another sentance.
	newValue = newValue.replace(/\. ([a-z])/g, function(match, capt1, index) {
		const letterToReplace = index + match.length;
		if (letterToReplace === cursorPos || letterToReplace === cursorPos + 1) {
			return match;
		}
		return match.slice(0, -1) + capt1[0].toUpperCase() + capt1.substring(1);
	});
	//Capitalize the first letter of the first sentence.
	if (newValue[0]) {
		if (![0, 1].includes(cursorPos)) {
			newValue = newValue[0].toUpperCase() + newValue.substring(1);
		}
	}

	//Turn unbracketed expressions into bracketed ones.
	let stringsToExpresify = ["card 1", "card 2", "card 3", "card 4", "card 5", "card 6", "card 7", "card 8", "card 9", "card 10", "card 11", "card 12", "card 13", "card 14", "card 15", "AP", "NAP", "NAP1", "NAP2", "NAP3", "APa", "APb", "NAPa", "NAPb", "+1", "+2", "+3", "+4", "+5", "-1", "-2", "-3", "-4", "-5", "-6", "-7", "-8", "-9", "-10", "-11", "-12", "-13", "-14", "-15"];//Also rule citations, and card names
	const stringsToSymbolfy = ["W", "U", "B", "R", "G", "C", "S", "P", "W/P", "U/P", "B/P", "R/P", "G/P", "2/W", "2/U", "2/B", "2/R", "2/G", "W/U", "W/B", "U/B", "U/R", "B/R", "B/G", "R/W", "R/G", "G/W", "G/U", "W/U/P", "W/B/P", "U/B/P", "U/R/P", "B/R/P", "B/G/P", "R/W/P", "R/G/P", "G/W/P", "G/U/P", "E", "T", "Q", "CHAOS"];

	const allCardNamesMinusWords = JSON.parse(JSON.stringify(allCardNames)).filter(name => !cardNamesToIgnore.includes(name));
	stringsToExpresify = stringsToExpresify.concat(allCardNamesMinusWords);

	const expressionRegex = new RegExp("(^|\\s)(" + stringsToExpresify.join("|").replace(/\+/g, "\\+") + ")($|\\s|[.,;])", "gi");
	newValue = newValue.replace(expressionRegex, function(match, capt1, capt2, capt3, offset) {
		if (offset + capt1.length <= cursorPos && cursorPos <= offset + capt1.length + capt2.length) {//Do nothing if the cursor is within the symbol or the adjacent characters.
			return match;
		} else {
			if (offset < cursorPos) {
				cursorPos += 2;
			}
			return capt1 + "[" + capt2 + "]" + capt3;
		}
	})

	const symbolRegex = new RegExp("(^|\\s)(" + stringsToSymbolfy.join("|").replace(/\+/g, "\\+") + ")($|\\s|[.,;])", "gi");
	newValue = newValue.replace(symbolRegex, function(match, capt1, capt2, capt3, offset) {
		if (offset + capt1.length <= cursorPos && cursorPos <= offset + capt1.length + capt2.length) {//Do nothing if the cursor is within the symbol or the adjacent characters.
			return match;
		} else {
			if (offset < cursorPos) {
				cursorPos += 2;
			}
			return capt1 + "{" + capt2 + "}" + capt3;
		}
	})

	const ruleCitationRegex = /(^|\s|\(|\/)(\d{3}(?:\.\d\d?[a-z]?)?)($|\s|[;:\)\/])/g;
	newValue = newValue.replace(ruleCitationRegex, function(match, capt1, capt2, capt3, offset) {
		if (offset + capt1.length <= cursorPos && cursorPos <= offset + capt1.length + capt2.length) {//Do nothing if the cursor is within the symbol or the adjacent characters.
			return match;
		} else {
			if (offset < cursorPos) {
				cursorPos += 2;
			}
			return capt1 + "[" + capt2 + "]" + capt3;
		}
	})

	//Set card generator expressions to lowercase.
	newValue = newValue.replace(/\[card \d+\]/gi, function(match) {
		return match.toLowerCase();
	});

	//Convert card name expressions to "card 1" etc expressions.
	const assignedCards = {};
	newValue = newValue.replace(/\[.+?\]/g, function(match, offset) {
		let cardName = match.slice(1, match.length - 1);
		if (/card \d+/.test(cardName)) {
			if (questionObj.cardLists[Number(cardName.match(/card (\d+)/)[1]) - 1]) {
				return match;
			} else {
				addCardGenerator();
				return match;
			}
		} else if (allCardNamesLowerCase.includes(cardName.toLowerCase())) {
			for (let i in allCardNames) {
				if (allCardNames[i].toLowerCase() === cardName.toLowerCase()) {
					cardName = allCardNames[i];
				}
			}
			if (!assignedCards[cardName]) {
				let foundCardlistIndex = questionObj.cardLists.findIndex(function (element) {
					return JSON.stringify(element) === `["${cardName}"]`;
				})
				if (foundCardlistIndex > -1 && document.querySelector(`#cardGenerator${foundCardlistIndex + 1} .modeSwitchButton`).textContent === "Switch to Template") {
					assignedCards[cardName] = `[card ${questionObj.cardLists.findIndex(function (element) {
						return element.includes(cardName) && element.length === 1;
					}) + 1}]`;
				} else {
					addCardGenerator();
					assignedCards[cardName] = "[card " + (cardGeneratorNum - 1) + "]";
					const event = new Event("keypress");
					event.keyCode = 13;
					const newListInput = document.querySelector(`#cardGenerator${cardGeneratorNum - 1} input`);
					newListInput.value = cardName;
					newListInput.dispatchEvent(event);
				}
			}
			if (cursorPos >= offset + match.length) {//If the cursor was after the expression, move it by the change distance.
				cursorPos += (assignedCards[cardName].length - 2) - cardName.length;
			} else if (offset < cursorPos && cursorPos < offset + match.length) {//If the cursor was inside the expression, move it to right afterwards.
				cursorPos = offset + assignedCards[cardName].length;
			}
			return assignedCards[cardName];
		} else {
			return match;
		}
	});

	//Set card generator expressions with a too-high number to the proper number.
	newValue = newValue.replace(/\[card (\d+)(?=\])/gi, function(match, capt1) {
		if (Number(capt1) > questionObj.cardLists.length) {
			if (capt1.length !== String(questionObj.cardLists.length)) {
				cursorPos -= capt1.length - String(questionObj.cardLists.length).length;
			}
			return "[card " + String(questionObj.cardLists.length);
		} else {
			return "[card " + capt1;
		}
	});

	//Capitalize player name expressions.
	const playerNames = ["NAP1", "NAP2", "NAP3", "APa", "APb", "NAPa", "NAPb", "AP", "NAP"];
	for (let i = 0 ; i < playerNames.length ; i++) {
		newValue = newValue.replace(new RegExp("\\[" + playerNames[i] + "\\]", "ig"), "[" + playerNames[i] + "]");
	}

	//Capitalize mana symbols.
	for (let i = 0 ; i < stringsToSymbolfy.length ; i++) {
		newValue = newValue.replace(new RegExp("\\{" + stringsToSymbolfy[i] + "\\}", "ig"), "{" + stringsToSymbolfy[i] + "}");
	}
	element.value = newValue;
	element.setSelectionRange(cursorPos, cursorPos);
}

document.getElementById("question").addEventListener("input", function() {
	setTimeout(function() {
		convertTypingRealTime(document.getElementById("question"));
	}, 0)
});
document.getElementById("answer").addEventListener("input", function() {
	setTimeout(function() {
		convertTypingRealTime(document.getElementById("answer"));
	}, 0)
});
document.addEventListener("selectionchange", function() {
	setTimeout(function() {
		convertTypingRealTime(document.getElementById("question"));
		convertTypingRealTime(document.getElementById("answer"));
	}, 0)
});

const convertedTemplateStorage = [];
const displayTemplateCardSet = function(template, num) {
	const convertedTemplate = templateConvert(template, allCards);
	const affectedSubCardGenerator = document.querySelector(`#cardGenerator${num + 1} > .subCardGeneratorTemplate`);
	affectedSubCardGenerator.innerHTML = "";
	for (let i = 0 ; i < convertedTemplate.length ; i++) {
		let newCard = document.createElement("li");
		newCard.setAttribute("class", "subCard");
		newCard.appendChild(document.createTextNode(convertedTemplate[i]));
		affectedSubCardGenerator.appendChild(newCard);
	}
	document.querySelector(`#cardGenerator${num + 1} > .cardCount`).textContent = "(" + convertedTemplate.length + ")";
	convertedTemplateStorage[num] = convertedTemplate;
}

let questionsListOpen = false;
bindButtonAction(document.getElementById("showQuestionsListButton"), function() {
	if (questionsListOpen) {
		document.getElementById("questionsListCount").style.display = "none";
		document.getElementById("questionsListDisplay").style.display = "none";
		document.getElementById("settingsButton").style.display = "none";
		document.getElementById("showQuestionsListButton").innerHTML = "Show Questions List";
		questionsListOpen = false;
		document.getElementById("hideWhenQuestionsListOpen").style.display = "block";
	} else {
		getQuestionsList(displayQuestionsList);
		document.getElementById("questionsListCount").style.display = "block";
		document.getElementById("questionsListDisplay").style.display = "block";
		document.getElementById("settingsButton").style.display = "block";
		document.getElementById("showQuestionsListButton").innerHTML = "Hide Questions List";
		questionsListOpen = true;
		document.getElementById("hideWhenQuestionsListOpen").style.display = "none";
	}
});

const doSomethingOnSidebarSettingsUpdate = function() {
	getQuestionsList(displayQuestionsList);
}

//Make a request for all questions that fit the current parameters.
let getQuestionTimeoutId = 0;
let currentPendingQuestionsListRequest = null;
const getQuestionsList = function(callback, timeout) {
	if (currentPendingQuestionsListRequest) {
		currentPendingQuestionsListRequest.abort();
	}
	document.getElementById("questionsListDisplay").classList.add("awaitingUpdate");
	let response;
	clearTimeout(getQuestionTimeoutId);

	const httpRequest = new XMLHttpRequest();
	httpRequest.timeout = timeout;
	httpRequest.onabort = function() {
		if (!timeout) {
			getQuestionTimeoutId = setTimeout(getQuestionsList, 1000, callback);
		}
	};
	httpRequest.onerror = function() {
		if (!timeout) {
			getQuestionTimeoutId = setTimeout(getQuestionsList, 1000, callback);
		}
	};
	httpRequest.ontimeout = function() {
		if (!timeout) {
			getQuestionTimeoutId = setTimeout(getQuestionsList, 1000, callback);
		}
	};
	httpRequest.onload = function() {
		document.getElementById("questionsListDisplay").classList.remove("awaitingUpdate");
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				const response = JSON.parse(httpRequest.response)
				if (!response.error && callback) {
					callback(response);
				}
			} else {
				if (!timeout) {
					getQuestionTimeoutId = setTimeout(getQuestionsList, 1000, callback);
				}
			}
		} else {
			if (!timeout) {
				getQuestionTimeoutId = setTimeout(getQuestionsList, 1000, callback);
			}
		}
	};
	httpRequest.open("POST", "/getQuestionsList", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send(JSON.stringify({
		"settings": sidebarSettings
	}));
	currentPendingQuestionsListRequest = httpRequest;
};

const displayQuestionsList = function(questionsList) {
	//document.getElementById("questionsListDisplay").style.height = `${1.13 * questionsList.length}rem`;
	document.getElementById("questionsListDisplay").value = questionsList.join("\n");
	document.getElementById("questionsListDisplay").value += "\n"; //Newline to make the click detenction work.
	document.getElementById("questionsListCount").textContent = questionsList.length + " matching questions:";
}

//Load a question when clicked in the questions list.
document.getElementById("questionsListDisplay").addEventListener("mouseup", function() {
	if (event.offsetX < this.clientWidth){ // Ignore a click on scrollbar
		const lineNum = this.value.substr(0, this.selectionStart).split("\n").length;
		if (!isNaN(parseInt(this.value.split("\n")[lineNum - 1]))) {
			getQuestionId(parseInt(this.value.split("\n")[lineNum - 1]));
		}
	}
});

//Prevent double-clicking in the questions list from selecting text.
document.getElementById("questionsListDisplay").addEventListener("mousedown", function(event) {
	if (event.detail > 1) {
		event.preventDefault();
	}
});

document.getElementById("password").addEventListener("keypress", function(event) {
	if (event.keyCode === 13 && this.value !== "") {
		login();
	}
})
const login = function() {
	document.getElementById("cursorStyle").innerHTML = "* {cursor: wait !important;}";

	const httpRequest = new XMLHttpRequest();
	httpRequest.timeout = 5000;
	httpRequest.onabort = function() {
			document.getElementById("cursorStyle").innerHTML = "";
			alert("There was an error validating your login. (Request aborted.) Please check your internet connection and try again. If the problem persists, please report the issue.");
	}
	httpRequest.onerror = function() {
			document.getElementById("cursorStyle").innerHTML = "";
			alert("There was an unknown error validating your login. Please check your internet connection and try again. If the problem persists, please report the issue.");
	}
	httpRequest.ontimeout = function() {
			document.getElementById("cursorStyle").innerHTML = "";
			alert("There was an error validating your login. (Request timed out.) Please check your internet connection and try again. If the problem persists, please report the issue.");
	}
	httpRequest.onload = function() {
		document.getElementById("cursorStyle").innerHTML = "";
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				try {
					const response = JSON.parse(httpRequest.response);
					currentLoggedInAdmin = {
						"name": response.name,
						"roles": response.roles,
						"id": response.id
					};
					document.getElementById("passwordLabel").style.display = "none";
					document.getElementById("loginButton").style.display = "none";
					document.getElementById("logOutButton").style.display = "block";
					document.getElementById("welcomeText").innerHTML = `Welcome ${response.name.split(" ")[0]}!`;
					document.getElementById("welcomeText").style.display = "inline";
					if (currentLoggedInAdmin.roles.owner) {
						document.getElementById("ownerOnly").style.display = "block";
					}
					if (document.getElementById("questionInfo").style.display === "block") {
						if (currentLoggedInAdmin.roles.owner) {
							document.getElementById("questionSubmitterNameFieldOwner").style.display = "block";
						} else {
							document.getElementById("questionSubmitterNameFieldEditor").style.display = "block";
						}
					}
					if (thereIsAUrlQuestion) {
						document.getElementById("getQuestionIdInput").value = thereIsAUrlQuestion;
						document.getElementById("getQuestionButton").click();
					}
					getQuestionCount();
				} catch (e) {
					alert(httpRequest.response);
				}
				if (thereIsASavedQuestion) {
					populateFields(savedQuestionState);
					updateButtonsAndUnsavedChanges(true);
				}
			} else {
				alert("There was an error validating your login. (Server returned no response.) Please check your internet connection and try again. If the problem persists, please report the issue.");
			}
		} else {
			alert(`There was an error validating your login. (Server returned status code ${httpRequest.status}.) Please check your internet connection and try again. If the problem persists, please report the issue.`)
		}
	}
	httpRequest.open("POST", "/validateLogin", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send(JSON.stringify({"password": document.getElementById("password").value}));
}

//Change the approve/unapprove button if the question is updated.
let questionHasUnsavedChanges = false;
const mutationObserverCallback = function() {
	updateButtonsAndUnsavedChanges(true);
};

const questionStuffObserver = new MutationObserver(mutationObserverCallback);
const turnOffQuestionStuffObserver = function() {
	questionStuffObserver.disconnect();
	document.getElementById("questionStuffDiv").removeEventListener("input", mutationObserverCallback);
	document.getElementById("submitterName").removeEventListener("input", mutationObserverCallback);
};
const turnOnQuestionStuffObserver = function() {
	document.getElementById("questionStuffDiv").addEventListener("input", mutationObserverCallback);
	document.getElementById("submitterName").addEventListener("input", mutationObserverCallback);
	questionStuffObserver.observe(document.getElementById("questionStuffDiv"), {attributes: true, childList: true, subtree: true});
};

const changeStatusUpwards = function() {
	document.getElementById("cursorStyle").innerHTML = "* {cursor: wait !important;}";
	setTimeout(function() {//This forces the cursor to update immediately since it waits for all synchronous code to finish.
		const requestObj = {
			"questionObj": createQuestionObj(),
			"password": document.getElementById("password").value,
			"statusChange": "increase",
			"changes": null
		}
		if (!askUserToValidateQuestion(validateSync(requestObj.questionObj))) {
			document.getElementById("cursorStyle").innerHTML = "";
			return;
		}
		if (currentQuestionData.status === "awaiting verification" && questionHasUnsavedChanges) {
			const userInput = prompt("Please enter a description of the changes you made to this question. This will be sent to this question's editor so that they can better avoid these sorts of issues next time.");
			if (userInput === null) {
				document.getElementById("cursorStyle").innerHTML = "";
				return;
			} else if (userInput.trim().length === 0) {
				alert("Canceled due to no description of changes.");
				document.getElementById("cursorStyle").innerHTML = "";
				return;
			} else {
				requestObj.changes = userInput.trim();
			}
		}
		//Send the request.
		requestObj.questionObj.id = currentQuestionData.id;
		requestObj.questionObj.submitterName = document.getElementById("submitterName").value.trim();
		const httpRequest = new XMLHttpRequest();
		httpRequest.timeout = 5000;
		httpRequest.onabort = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an error approving the question. (Request aborted.) Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.onerror = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an unknown error approving the question. Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.ontimeout = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an error approving the question. (Request timed out.) Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.onload = function() {
			getQuestionCount();
			document.getElementById("cursorStyle").innerHTML = "";
			if (httpRequest.status === 200) {
				if (httpRequest.response) {
					const response = JSON.parse(httpRequest.response);
					if (!response.error) {
						turnOffQuestionStuffObserver();
						currentQuestionData.status = response.newStatus;
						currentQuestionData.verification = response.newVerification;
						updateQuestionInfoFields();
						updateButtonsAndUnsavedChanges(false);
						alert(response.message);
						setTimeout(getQuestionsList, 50, displayQuestionsList);
					} else {
						alert(response.message);
					}
				} else {
					alert("There was an error approving the question. (Server returned no response.) Please check your internet connection and try again. If the problem persists, please report the issue.");
				}
			} else {
				alert(`There was an error approving the question. (Server returned status code ${httpRequest.status}.) Please check your internet connection and try again. If the problem persists, please report the issue.`)
			}
		}
		httpRequest.open("POST", "/changeQuestionStatus", true);
		httpRequest.setRequestHeader("Content-Type", "application/json");
		httpRequest.send(JSON.stringify(requestObj));
	}, 0);
};

const changeStatusDownwards = function() {
	document.getElementById("cursorStyle").innerHTML = "* {cursor: wait !important;}";
	setTimeout(function() {//This forces the cursor to update immediately since it waits for all synchronous code to finish.
		//Make the request.
		const requestObj = {
			"questionObj": createQuestionObj(),
			"password": document.getElementById("password").value,
			"statusChange": "decrease"
		}
		//Send the request.
		requestObj.questionObj.id = currentQuestionData.id;
		requestObj.questionObj.submitterName = document.getElementById("submitterName").value.trim();
		const httpRequest = new XMLHttpRequest();
		httpRequest.timeout = 5000;
		httpRequest.onabort = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an error unapproving the question. (Request aborted.) Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.onerror = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an unknown error unapproving the question. Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.ontimeout = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an error unapproving the question. (Request timed out.) Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.onload = function() {
			getQuestionCount();
			document.getElementById("cursorStyle").innerHTML = "";
			if (httpRequest.status === 200) {
				if (httpRequest.response) {
					const response = JSON.parse(httpRequest.response);
					if (!response.error) {
						turnOffQuestionStuffObserver();
						currentQuestionData.status = response.newStatus;
						currentQuestionData.verification = response.newVerification;
						updateQuestionInfoFields();
						updateButtonsAndUnsavedChanges(false);
						alert(response.message);
						setTimeout(getQuestionsList, 50, displayQuestionsList);
					} else {
						alert(response.message);
					}
				} else {
					alert("There was an error unapproving the question. (Server returned no response.) Please check your internet connection and try again. If the problem persists, please report the issue.");
				}
			} else {
				alert(`There was an error unapproving the question. (Server returned status code ${httpRequest.status}.) Please check your internet connection and try again. If the problem persists, please report the issue.`)
			}
		}
		httpRequest.open("POST", "/changeQuestionStatus", true);
		httpRequest.setRequestHeader("Content-Type", "application/json");
		httpRequest.send(JSON.stringify(requestObj));
	}, 0);
};

//Event listeners for canceling multi entry and template boxes.
document.getElementById("cancelTemplateBox").addEventListener("click", function() {
	if (JSON.stringify(oldTemplateValue) !== JSON.stringify(createTemplate())) {
		if (confirm('Cancel changes?')) {
			closeTemplateBox();
		}
	} else {
		closeTemplateBox();
	}
});
document.getElementById("cancelMultiEntryBox").addEventListener("click", function() {
	if (oldMultiEntryValue.trim() !== document.getElementById("multiEntryText").value.trim()) {
		if (confirm('Cancel changes?')) {
			closeMultiEntry();
		}
	} else {
		closeMultiEntry();
	}
});

//Persist password across reloads.
document.getElementById("password").addEventListener("input", function() {
	localStorage.setItem("adminPassword", document.getElementById("password").value);
});
document.getElementById("password").value = localStorage.getItem("adminPassword");

//Handle mobile view.
const moveElementsOnResize = function() {
	if (window.matchMedia("only screen and (max-width: 40rem)").matches) {
		document.getElementById("questionStuffDiv").insertBefore(document.getElementById("clearFields"), document.getElementById("levelLabel"));

		document.getElementById("questionStuffDiv").insertBefore(document.getElementById("iHaveNoIdeaWhyThisNeedsToBeHereButIfItGoesAwayTheButtonIsGiant"), document.getElementById("tags"));

		document.getElementById("questionStuffDiv").insertBefore(document.getElementById("cardGenerators"), document.getElementById("tags"));
	} else {
		document.getElementById("questionStuffDiv").insertBefore(document.getElementById("levelLabel"), document.getElementById("clearFields"));

		document.getElementById("questionStuffDiv").insertBefore(document.getElementById("tags"), document.getElementById("iHaveNoIdeaWhyThisNeedsToBeHereButIfItGoesAwayTheButtonIsGiant"));

		document.getElementById("questionStuffDiv").appendChild(document.getElementById("cardGenerators"));
	}
}
window.addEventListener("resize", function() {
	moveElementsOnResize();
});
moveElementsOnResize();

let oldWorker;
const validateWithWorker = function() {
	if (typeof oldWorker === "object") {
		oldWorker.terminate();
	}
	previewWindow.parentData.greyoutValidation = true;
	const previewValidationWorker = new Worker("validationWorker.js");
	previewValidationWorker.onmessage = function(message) {
		previewWindow.parentData.greyoutValidation = false;
		previewWindow.parentData.questionValidation = message.data;
		previewWindow.parentData.updateText = true;
	}
	const templateEmptyness = [];
	for (let i = 0 ; i < questionObj.cardLists.length ; i++) {
		templateEmptyness.push(document.querySelector(`#cardGenerator${i + 1} > .modeSwitchButton`).textContent === "Switch to List" && document.querySelector(`#cardGenerator${i + 1} .subCardGeneratorTemplate`).childNodes.length === 0);
	}
	previewValidationWorker.postMessage({
		"allSubtypes": allSubtypes,
		"question": createQuestionObj(),
		"templateEmptyness": templateEmptyness,
		"convertedTemplateStorage": convertedTemplateStorage,
	});
	oldWorker = previewValidationWorker;
}

const validateSync = function(question) {
	const templateEmptyness = [];
	for (let i = 0 ; i < questionObj.cardLists.length ; i++) {
		templateEmptyness.push(document.querySelector(`#cardGenerator${i + 1} > .modeSwitchButton`).textContent === "Switch to List" && document.querySelector(`#cardGenerator${i + 1} .subCardGeneratorTemplate`).childNodes.length === 0);
	}
	return validateQuestion(question, templateEmptyness, null, allCards, allRules);
}

//Handle preview window.
let previewWindow;
bindButtonAction(document.getElementById("previewButton"), function() {
	if (previewWindow === undefined || previewWindow.parent === null) {
		openPreview();
	} else {
		previewWindow.focus()
	}
});
const openPreview = function() {
	previewWindow = window.open("/question-editor/previewData.html");
	previewWindow.parentData = {
		"questionObj": {
			"question": document.getElementById("question").value,
			"answer": document.getElementById("answer").value,
			"id": document.getElementById("currentID").textContent,
			"submitterName": document.getElementById("submitterName").value.trim(),
			"level": document.getElementById("level").value,
			"complexity": document.getElementById("complexity").value
		},
		"updateText": true,
		"updateAll": true,
		"allRules": allRules,
		"allCards": allCards,
	};
	previewWindow.parentData.questionValidation = {
		"errors": [],
		"warnings": []
	};
	validateWithWorker();
	if (document.getElementById("templateScrollContainer").style.display === "block") {
		previewWindow.parentData.currentGenerator = templateConvert(createTemplate(), allCards);
		if (templateErrors.length > 0) {
			previewWindow.parentData.currentGeneratorErrors = validateTemplate(previewWindow.parentData.currentGenerator).templateErrors;
		} else {
			previewWindow.parentData.currentGeneratorErrors = [];
		}
		previewWindow.parentData.currentGeneratorChanged = true;
		previewWindow.parentData.currentGeneratorStatusChanged = true;
		previewWindow.parentData.currentGeneratorType = "template";
		previewWindow.parentData.currentGeneratorOpen = true;
	}
	if (document.getElementById("multiEntryDiv").style.display === "block") {
		if (createMultiEntryCardList().invalidCards.length > 0) {
			const errors = [];
			createMultiEntryCardList().invalidCards.forEach(function(card) {
				errors.push(`"${card}" is not a valid card.`);
			});
			previewWindow.parentData.currentGeneratorErrors = errors;
		} else {
			updatePreviewForMultiEntry();
		}
		previewWindow.parentData.currentGeneratorChanged = true;
		previewWindow.parentData.currentGeneratorStatusChanged = true;
		previewWindow.parentData.currentGeneratorType = "list";
		previewWindow.parentData.currentGeneratorOpen = true;
	}
	changePreviewAll();
	previewCardChangeObserver.observe(document.getElementById("cardGenerators"), {attributes: true, childList: true, subtree: true});
	setInterval(function() {
		if (previewChangeMade) {
			if (previewWindow) {
				changePreviewAll();
			}
			previewChangeMade = false;
		}
	}, 100);

	let oldValues = [document.getElementById("question").value, document.getElementById("answer").value, document.getElementById("currentID").textContent, document.getElementById("submitterName").value.trim()];

	setInterval(function() {
		let newValues = [document.getElementById("question").value, document.getElementById("answer").value, document.getElementById("currentID").textContent, document.getElementById("submitterName").value.trim()];
		for (let i = 0 ; i < oldValues.length ; i++) {
			if (oldValues[i] !== newValues[i]) {
				if (previewWindow) {
					changePreviewText();
				}
				oldValues = newValues;
				break;
			}
		}
	}, 100);
}

const changePreviewText = function() {
	previewWindow.parentData.questionObj.answer = document.getElementById("answer").value;
	previewWindow.parentData.questionObj.question = document.getElementById("question").value;
	previewWindow.parentData.questionObj.id = document.getElementById("currentID").textContent;
	previewWindow.parentData.questionObj.submitterName = document.getElementById("submitterName").value.trim();
	previewWindow.parentData.questionObj.tags = currentTags;
	previewWindow.parentData.updateText = true;
	validateWithWorker();
}

const changePreviewAll = function() {
	//Combine the card lists and templates into one array.
	let finalCardGeneratorArray = JSON.parse(JSON.stringify(questionObj.cardLists));

	//Replace cardlists with templates if that's what's used.
	for (let i = 0 ; i < finalCardGeneratorArray.length ; i++) {
		if (document.getElementById(`cardGenerator${i + 1}`).childNodes[6].textContent === "Switch to List") {
			finalCardGeneratorArray[i] = convertedTemplateStorage[i];
		}
	};
	previewWindow.parentData.questionObj.answer = document.getElementById("answer").value;
	previewWindow.parentData.questionObj.question = document.getElementById("question").value;
	previewWindow.parentData.questionObj.id = document.getElementById("currentID").textContent;
	previewWindow.parentData.questionObj.submitterName = document.getElementById("submitterName").value.trim();
	previewWindow.parentData.questionObj.cardLists = finalCardGeneratorArray;
	previewWindow.parentData.questionObj.tags = currentTags;
	previewWindow.parentData.questionObj.level = document.getElementById("level").value;
	previewWindow.parentData.questionObj.complexity = document.getElementById("complexity").value;
	previewWindow.parentData.updateAll = true;
	validateWithWorker();
}

const updateLevelOrComplexity = function() {
	if (previewWindow) {
		previewWindow.parentData.questionObj.level = document.getElementById("level").value;
		previewWindow.parentData.questionObj.complexity = document.getElementById("complexity").value;
		previewWindow.parentData.updateExtras = true;
		validateWithWorker();
	}
}
document.getElementById("level").addEventListener("change", updateLevelOrComplexity);
document.getElementById("complexity").addEventListener("change", updateLevelOrComplexity);

let previewChangeMade = false;
const previewCardChangeObserver = new MutationObserver(function() {previewChangeMade = true;});

let oldTemplate;
setInterval(function() {
	if (document.getElementById("templateScrollContainer").style.display === "block") {
		const newTemplate = createTemplate();
		if (JSON.stringify(oldTemplate) !== JSON.stringify(newTemplate)) {
			oldTemplate = newTemplate;
			if (previewWindow) {
				const validatedTemplate = validateTemplate(newTemplate);
				if (validatedTemplate.templateErrors.length > 0) {
					previewWindow.parentData.currentGeneratorErrors = validatedTemplate.templateErrors;
				} else {
					previewWindow.parentData.currentGeneratorErrors = [];
				}
				previewWindow.parentData.currentGenerator = templateConvert(validatedTemplate.templateWithValidRulesOnly, allCards);
				previewWindow.parentData.currentGeneratorChanged = true;
			}
		}
	}
}, 100);

document.getElementById("multiEntryText").addEventListener("input", function() {
	updatePreviewForMultiEntry();
})

const updatePreviewForMultiEntry = function() {

	const result = createMultiEntryCardList();

	if (previewWindow) {
		if (result.invalidCards.length > 0) {
			const errors = [];
			result.invalidCards.forEach(function(card) {
				errors.push(`"${card}" is not a valid card.`);
			});
			previewWindow.parentData.currentGeneratorErrors = errors;
		} else {
			previewWindow.parentData.currentGeneratorErrors = [];
			previewWindow.parentData.currentGenerator = result.validCards;
		}
		previewWindow.parentData.currentGeneratorChanged = true;
	}
}

const createMultiEntryCardList = function() {
	const allMultiEntryCards = document.getElementById("multiEntryText").value.split("\n");
	let validCards = [];
	let invalidCards = [];

	for (let i = 0 ; i < allMultiEntryCards.length ; i++) {
		allMultiEntryCards[i] = allMultiEntryCards[i].trim();
		if (allMultiEntryCards[i] === "") {
			allMultiEntryCards.splice(i, 1);
			i--;
		}
	}

	for (let i in allMultiEntryCards) {
		let cardIsInvalid = true;
		for (let j in allCardNames) {
			if (allMultiEntryCards[i].toLowerCase() === allCardNames[j].toLowerCase()) {
				validCards.push(allCardNames[j]);
				cardIsInvalid = false;
			}
		}
		if (cardIsInvalid) {
			invalidCards.push(allMultiEntryCards[i]);
		}
	}

	return {
					"validCards": validCards,
					"invalidCards": invalidCards
				}
}

//Link dirctly to a question and load saved data on reload.
let thereIsASavedQuestion = false,
		thereIsAUrlQuestion = false;
let savedQuestionState;
if (window.location.href.includes("?")) {
	const questionNum = Number(window.location.href.match(/\/?(\d+)$/)[1]);
	if (document.getElementById("password").value.length === 0) {
		document.getElementById("getQuestionIdInput").value = questionNum;
		document.getElementById("getQuestionButton").click();
	} else {
		thereIsAUrlQuestion = questionNum;
	}
	history.replaceState({}, "", `./`);
} else {
	savedQuestionState = localStorage.getItem("savedQuestionState");
	if (savedQuestionState && savedQuestionState.length > 2) {
		savedQuestionState = JSON.parse(savedQuestionState);
		thereIsASavedQuestion = true;
	} else {
		updateButtonsAndUnsavedChanges(false);
	}
}

bindButtonAction(document.getElementById("showTagEditorButton"), function() {
	document.getElementById("tagEditor").style.display = "block";
	document.getElementById("ownerOptionsGreyout").style.display = "block";
});

bindButtonAction(document.getElementById("showAdminEditorButton"), function() {
	document.getElementById("adminEditor").style.display = "block";
	document.getElementById("ownerOptionsGreyout").style.display = "block";
	getAdminData();
});

document.getElementById("tagEditorAddRemoveSelect").addEventListener("change", function() {
	if (this.value === "Change") {
		document.getElementById("tagEditorAddRemoveIntoDiv").style.display = "block";
	} else {
		document.getElementById("tagEditorAddRemoveIntoDiv").style.display = "none";
	}
	if (this.value === "Add") {
		document.getElementById("tagEditorAddRemoveCount1").style.display = "none";
	} else {
		document.getElementById("tagEditorAddRemoveCount1").style.display = "inline";
	}
});

document.getElementById("tagEditorSuggestionsSelect").addEventListener("change", function() {
	if (this.value === "Tag") {
		document.getElementById("tagEditorSuggestionsListsContainerTag").style.display = "flex";
	} else {
		document.getElementById("tagEditorSuggestionsListsContainerTag").style.display = "none";
	}
	if (this.value === "Rule") {
		document.getElementById("tagEditorSuggestionsListsContainerRule").style.display = "flex";
	} else {
		document.getElementById("tagEditorSuggestionsListsContainerRule").style.display = "none";
	}
	if (this.value === "Ranges") {
		document.getElementById("tagEditorSuggestionsInput").style.display = "none";
		document.getElementById("tagEditorSuggestionsListsContainerRanges").style.display = "block";
	} else {
		document.getElementById("tagEditorSuggestionsListsContainerRanges").style.display = "none";
		document.getElementById("tagEditorSuggestionsInput").style.display = "inline";
	}
});

bindButtonAction(document.getElementById("tagEditorCancelButton"), function() {
	document.getElementById("tagEditor").style.display = "none";
	document.getElementById("ownerOptionsGreyout").style.display = "none";
	document.getElementById("tagEditorAddRemoveInput1").value = "";
	document.getElementById("tagEditorAddRemoveInput2").value = "";
});

const clearAdminEditorFields = function() {
	document.getElementById("adminEditorInputName").value = "";
	document.getElementById("adminEditorInputPassword").value = "";
	const adminEditorRolesCheckboxes = document.querySelectorAll("#adminEditorRolesList input");
	for (let i = 0 ; i < adminEditorRolesCheckboxes.length ; i++) {
		adminEditorRolesCheckboxes[i].checked = false;
	}
	document.getElementById("adminEditorInputEmailAddress").value = "";
	document.getElementById("adminEditorInputEmailFrequency").value = "Never";
	document.getElementById("adminEditorInputEditLogEmails").value = "False";
}

bindButtonAction(document.getElementById("adminEditorCancelButton"), function() {
	document.getElementById("adminEditor").style.display = "none";
	document.getElementById("ownerOptionsGreyout").style.display = "none";
	clearAdminEditorFields();
});

const switchTabs = function(event) {
	const tagEditorTabs = document.getElementsByClassName("tagEditorTab");
	for (let i = 0 ; i < tagEditorTabs.length ; i++) {
		tagEditorTabs[i].classList.remove("activeTab");
	}
	const tagEditorPages = document.getElementsByClassName("tagEditorPage");
	for (let i = 0 ; i < tagEditorPages.length ; i++) {
		tagEditorPages[i].style.display = "none";
	}
	event.target.classList.add("activeTab");
	document.getElementById("tagEditor" + event.target.id.slice(12)).style.display = "block";
	event.target.blur();
}

const tagEditorTabs = document.getElementsByClassName("tagEditorTab");
for (let i = 0 ; i < tagEditorTabs.length ; i++) {
	bindButtonAction(tagEditorTabs[i], switchTabs);
}

const populateTagsEditorList = function() {
	const tagEditorList = document.getElementById("tagEditorList");
	for (let i in allTags) {
		const tagName = document.createElement("li");
		tagName.textContent = allTags[i] + " ";
		tagEditorList.appendChild(tagName);
		const tagNum = document.createElement("b");
		tagNum.textContent = "(" + tagData[allTags[i]].count + ")";
		tagName.appendChild(tagNum);
	}
}
let allTagNames = [];//This shouldn't be here. findthis
let tagData = {};
const getTagData = function() {
	document.getElementById("tagEditorList").classList.add("awaitingUpdate");
	const httpRequest = new XMLHttpRequest();
	httpRequest.timeout = 10000;
	httpRequest.onabort = function() {
		alert("getTagData aborted");
		document.getElementById("tagEditorList").classList.remove("awaitingUpdate");
	};
	httpRequest.onerror = function() {
		alert("getTagData errored");
		document.getElementById("tagEditorList").classList.remove("awaitingUpdate");
	};
	httpRequest.ontimeout = function() {
		alert("getTagData timeout");
		document.getElementById("tagEditorList").classList.remove("awaitingUpdate");
	};
	httpRequest.onload = function() {
		if (httpRequest.status === 200) {
			tagData = JSON.parse(httpRequest.response);
			allTagNames = Object.keys(tagData);
			allTagNames.sort();
			turnOffQuestionStuffObserver();
			populateTagsEditorList();
			populateSidebarTagsDropdown();
			populateAdminTagsDropdown();
			turnOnQuestionStuffObserver();
		} else {
			alert("getTagData status code " + httpRequest.status)
		}
		document.getElementById("tagEditorList").classList.remove("awaitingUpdate");
	};
	httpRequest.open("GET", "/getTagData", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send();
};
getTagData();

document.getElementById("tagEditorAddRemoveInput1").addEventListener("input", function() {
	let count = 0;
	if (tagData[document.getElementById("tagEditorAddRemoveInput1").value]) {
		count = tagData[document.getElementById("tagEditorAddRemoveInput1").value].count;
	}
	document.getElementById("tagEditorAddRemoveCount1").textContent = "(" + count + ")";
});

document.getElementById("tagEditorAddRemoveInput2").addEventListener("input", function() {
	let count = 0;
	if (tagData[document.getElementById("tagEditorAddRemoveInput2").value]) {
		count = tagData[document.getElementById("tagEditorAddRemoveInput2").value].count;
	}
	document.getElementById("tagEditorAddRemoveCount2").textContent = "(" + count + ")";
});

let newEvent = new Event("mouseup");
document.getElementById("tagEditorTabSuggestions").dispatchEvent(newEvent);

bindButtonAction(document.getElementById("loginButton"), login);

window.addEventListener("beforeunload", function(event) {
	if (previewWindow) {
		previewWindow.close();
	}
});

const populateAdminNamesDropdown = function(adminData) {
	let options = "";
	for (let i in adminData) {
		if (Object.values(adminData[i].roles).includes(true)) {
			options += "<option>" + adminData[i].name.replace(/"/g, "&quot;") + "</option>";
		}
	}
	for (let i in adminData) {
		if (!Object.values(adminData[i].roles).includes(true)) {
			options += "<option>" + adminData[i].name.replace(/"/g, "&quot;") + "</option>";
		}
	}
	document.getElementById("adminNames").innerHTML = options;
	populateAdminEditorFields(document.getElementById("adminNames"));
}

let newAdminData = [];

const getAdminData = function() {
	const httpRequest = new XMLHttpRequest();
	httpRequest.timeout = 10000;
	httpRequest.onabort = getAdminData;
	httpRequest.onerror = getAdminData;
	httpRequest.ontimeout = getAdminData;
	httpRequest.onload = function() {
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				if (httpRequest.response === "Unauthorized") {
					throw new Error("Unauthorized")
				} else {
					newAdminData = JSON.parse(httpRequest.response);
					populateAdminNamesDropdown(newAdminData);
				}
			} else {
				getAdminData();
			}
		} else {
			getAdminData();
		}
	}
	httpRequest.open("POST", "/getAdminData", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send(JSON.stringify({
		"includeSensitiveData": true,
		"password": document.getElementById("password").value
	}));
}

const populateAdminEditorFields = function(admin) {
	let currentAdmin;
	for (let i in newAdminData) {
		if (newAdminData[i].name === admin.childNodes[admin.selectedIndex].textContent) {
			currentAdmin = newAdminData[i];
		}
	}

	document.getElementById("adminEditorInputName").value = currentAdmin.name;
	document.getElementById("adminEditorInputPassword").value = currentAdmin.password;
	const adminEditorRolesCheckboxes = document.querySelectorAll("#adminEditorRolesList input");
	for (let i = 0 ; i < adminEditorRolesCheckboxes.length ; i++) {
		const adminObjectKey = adminEditorRolesCheckboxes[i].id.slice(11, 12).toLowerCase() + adminEditorRolesCheckboxes[i].id.slice(12);
		adminEditorRolesCheckboxes[i].checked = currentAdmin.roles[adminObjectKey];
	}
	document.getElementById("adminEditorInputEmailAddress").value = currentAdmin.emailAddress;
	document.getElementById("adminEditorInputEmailFrequency").value = currentAdmin.reminderEmailFrequency;
	document.getElementById("adminEditorInputEditLogEmails").value = currentAdmin.sendSelfEditLogEmails.toString()[0].toUpperCase() + currentAdmin.sendSelfEditLogEmails.toString().slice(1);
};

const updateAdminData = function() {
	let currentAdmin;
	const adminNamesElement = document.getElementById("adminNames");
	let id = 0;
	for (let i in newAdminData) {
		if (newAdminData[i].name === adminNamesElement.childNodes[adminNamesElement.selectedIndex].textContent) {
			currentAdmin = newAdminData[i];
			id = Number(i);
		}
	}
	currentAdmin.id = id;
	currentAdmin.name = document.getElementById("adminEditorInputName").value;
	currentAdmin.password = document.getElementById("adminEditorInputPassword").value;
	const adminEditorRolesCheckboxes = document.querySelectorAll("#adminEditorRolesList input");
	for (let i = 0 ; i < adminEditorRolesCheckboxes.length ; i++) {
		const adminObjectKey = adminEditorRolesCheckboxes[i].id.slice(11, 12).toLowerCase() + adminEditorRolesCheckboxes[i].id.slice(12);
		currentAdmin.roles[adminObjectKey] = adminEditorRolesCheckboxes[i].checked;
	}
	currentAdmin.emailAddress = document.getElementById("adminEditorInputEmailAddress").value;
	currentAdmin.reminderEmailFrequency = document.getElementById("adminEditorInputEmailFrequency").value;
	currentAdmin.sendSelfEditLogEmails = document.getElementById("adminEditorInputEditLogEmails").value === "True";
}

document.getElementById("adminNames").addEventListener("change", function(event) {
	populateAdminEditorFields(event.srcElement);
});

const performAdminEdit = function() {
	//Make sure everything is fine.
	const owners = [];
	for (let i in newAdminData) {
		if (newAdminData[i].roles.owner) {
			owners.push(newAdminData[i].name);
		}
	}
	if (owners.length === 0) {
		alert("You've removed yourself as the site owner without specifying a new one. You probably don't want to do that.");
		return;
	}
	if (owners.length > 1) {
		alert(`${owners[0]} and ${owners[1]} can't both be owners. What are you, a communist‽`);
		return;
	}
	for (let i in newAdminData) {
		if (!Object.values(newAdminData[i].roles).includes(true) && newAdminData[i].reminderEmailFrequency !== "Never") {
			alert(`You probably shouldn't be sending emails to ${newAdminData[i].name} if they're no longer an admin.`);
			return;
		}
	}

	function subsets(set, n) {
	  if(!Number.isInteger(n) || n < 0 || n > set.size) return function*(){}();
	  var subset = new Array(n),
	      iterator = set.values();
	  return (function* backtrack(index, remaining) {
	    if(index === n) {
	      yield subset.slice();
	    } else {
	      for(var i=0; i<set.size; ++i) {
	        subset[index] = iterator.next().value; /* Get first item */
	        set.delete(subset[index]); /* Remove it */
	        set.add(subset[index]); /* Insert it at the end */
	        if(i <= remaining) {
	          yield* backtrack(index+1, remaining-i);
	        }
	      }
	    }
	  })(0, set.size-n);
	}
	for (let subset of subsets(new Set(newAdminData), 2)) {
		if (subset[0].name === subset[1].name) {
			alert(`You have two people both named ${subset[0].name}.`);
			return;
		}
		if ((subset[0].emailAddress === subset[1].emailAddress) && subset[0].emailAddress !== "") {
			alert(`Both ${subset[0].name} and ${subset[1].name} have the same email address.`);
			return;
		}
		if (subset[0].password === subset[1].password) {
			alert(`Both ${subset[0].name} and ${subset[1].name} have the same password.`);
			return;
		}
	}

	//Do stuff.
	document.getElementById("adminEditor").style.display = "none";
	document.getElementById("ownerOptionsGreyout").style.display = "none";
	const httpRequest = new XMLHttpRequest();
	httpRequest.timeout = 10000;
	httpRequest.onabort = function() {
		alert("Aborted");
	}
	httpRequest.onerror = function() {
		alert("Errored");
	}
	httpRequest.ontimeout = function() {
		alert("Timed out.");
	}
	httpRequest.onload = function() {
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				alert(httpRequest.response + "\nReload the page if you edited yourself.");
			} else {
				alert("Error: No response.");
			}
		} else {
			alert(`Error: Server returned status code ${httpRequest.status}`);
		}
	}
	httpRequest.open("POST", "/updateAdminData", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send(JSON.stringify({
		"password": document.getElementById("password").value,
		"adminData": JSON.stringify(newAdminData)
	}));
	newAdminData = [];
	clearAdminEditorFields();
};

const updateAdminName = function(nameInput) {
	let currentAdmin;
	const adminNamesElement = document.getElementById("adminNames");
	for (let i in newAdminData) {
		if (newAdminData[i].name === adminNamesElement.childNodes[adminNamesElement.selectedIndex].textContent) {
			currentAdmin = newAdminData[i];
		}
	}
	currentAdmin.name = nameInput.value;
	adminNamesElement.childNodes[adminNamesElement.selectedIndex].textContent = nameInput.value;
}

const addNewAdmin = function() {
	newAdminData.push({
		"id": newAdminData.length,
		"name": "",
		"password": "",
		"roles": {
			"editor": true,
			"grammarGuru": false,
			"templateGuru": false,
			"rulesGuru": false,
			"owner": false
		},
		"emailAddress": "",
		"reminderEmailFrequency": "Never",
		"sendSelfEditLogEmails": false
	});
	populateAdminNamesDropdown(newAdminData);
	document.getElementById("adminNames").value = "";
	populateAdminEditorFields(document.getElementById("adminNames"));
}

let currentLoggedInAdmin = {};

if (document.getElementById("password").value.length > 0) {
	login();
}

bindButtonAction(document.getElementById("logOutButton"), function() {
	localStorage.setItem("adminPassword", "");
	location.reload();
});

const getCursorXY = (input, selectionPoint) => {
  const {
    offsetLeft: inputX,
    offsetTop: inputY,
  } = input
  // create a dummy element that will be a clone of our input
  const div = document.createElement('div')
  // get the computed style of the input and clone it onto the dummy element
  const copyStyle = getComputedStyle(input)
  for (const prop of copyStyle) {
    div.style[prop] = copyStyle[prop]
  }
  // we need a character that will replace whitespace when filling our dummy element if it's a single line <input/>
  const swap = '.'
  const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value
  // set the div content to that of the textarea up until selection
  const textContent = inputValue.substr(0, selectionPoint)
  // set the text content of the dummy element div
  div.textContent = textContent
  if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
  // if a single line input then the div needs to be single line and not break out like a text area
  if (input.tagName === 'INPUT') div.style.width = 'auto'
  // create a marker element to obtain caret position
  const span = document.createElement('span')
  // give the span the textContent of remaining content so that the recreated dummy element is as close as possible
  span.textContent = inputValue.substr(selectionPoint) || '.'
  // append the span marker to the div
  div.appendChild(span)
  // append the dummy element to the body
  document.body.appendChild(div)
  // get the marker position, this is the caret position top and left relative to the input
  const { offsetLeft: spanX, offsetTop: spanY } = span
  // lastly, remove that dummy element
  // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered
  document.body.removeChild(div)
  // return an object with the x and y of the caret. account for input positioning so that you don't need to wrap the input
  return {
    x: inputX + spanX,
    y: spanY - inputY,
  }
}

//Persist question data.
setInterval(function() {
	if (questionHasUnsavedChanges) {
		savedQuestionState = createQuestionObj();
		if (currentQuestionData.id) {
			savedQuestionState.id = currentQuestionData.id;
		}
		if (currentQuestionData.status) {
			savedQuestionState.status = currentQuestionData.status;
		}
		if (currentQuestionData.verification) {
			savedQuestionState.verification = currentQuestionData.verification;
		}
		localStorage.setItem("savedQuestionState", JSON.stringify(savedQuestionState));
	} else {
		localStorage.setItem("savedQuestionState", "{}");
	}
}, 500);

const updateAndForceStatus = function(newStatus, newId) {
	if (!currentQuestionData.id) {
		alert("There is no question loaded.");
		return;
	}
	document.getElementById("cursorStyle").innerHTML = "* {cursor: wait !important;}";
	setTimeout(function() {//This forces the cursor to update immediately since it waits for all synchronous code to finish.
		const questionData = createQuestionObj();
		questionData.id = newId || currentQuestionData.id
		questionData.submitterName = document.getElementById("submitterName").value.trim();
		const requestObj = {
			"password": document.getElementById("password").value,
			"newStatus": newStatus,
			"id": currentQuestionData.id,
			"newId": newId,
			"questionData": questionData
		}
		//Send the request.
		const httpRequest = new XMLHttpRequest();
		httpRequest.timeout = 5000;
		httpRequest.onabort = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an error setting the question status. (Request aborted.) Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.onerror = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an unknown error setting the question status. Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.ontimeout = function() {
				document.getElementById("cursorStyle").innerHTML = "";
				alert("There was an error setting the question status. (Request timed out.) Please check your internet connection and try again. If the problem persists, please report the issue.");
		}
		httpRequest.onload = function() {
			getQuestionCount();
			document.getElementById("cursorStyle").innerHTML = "";
			if (httpRequest.status === 200) {
				if (httpRequest.response) {
					const response = JSON.parse(httpRequest.response);
					if (!response.error) {
						turnOffQuestionStuffObserver();
						currentQuestionData.status = response.newStatus;
						currentQuestionData.verification = response.newVerification;
						if (response.newId) {
							currentQuestionData.id = response.newId;
						}
						document.getElementById("forceStatusNewId").value = "";
						updateQuestionInfoFields();
						updateButtonsAndUnsavedChanges(false);
						alert(response.message);
						setTimeout(getQuestionsList, 50, displayQuestionsList);
					} else {
						alert(response.message);
					}
				} else {
					alert("There was an error setting the question status. (Server returned no response.) Please check your internet connection and try again. If the problem persists, please report the issue.");
				}
			} else {
				alert(`There was an error setting the question status. (Server returned status code ${httpRequest.status}.) Please check your internet connection and try again. If the problem persists, please report the issue.`)
			}
		}
		httpRequest.open("POST", "/updateAndForceStatus", true);
		httpRequest.setRequestHeader("Content-Type", "application/json");
		httpRequest.send(JSON.stringify(requestObj));
	}, 0);
};

bindButtonAction(document.getElementById("forceUpdateButton"), function() {
	let newStatus;
	if (document.getElementById("forceStatusPending").checked) {
		newStatus = "pending";
	} else if (document.getElementById("forceStatusFinished").checked) {
		newStatus = "finished";
	}
	if (document.getElementById("forceStatusNewId").value.trim() === "") {
		updateAndForceStatus(newStatus);
	} else {
		const newId = Number(document.getElementById("forceStatusNewId").value.trim());
		if (newId < 1 || newId > 9999 || isNaN(newId)) {
			alert("Invalid new ID");
			return;
		}
		updateAndForceStatus(newStatus, newId);
	}
});

const getQuestionCount = async function() {
	const httpRequest = new XMLHttpRequest();
	httpRequest.onload = function() {
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				const questionCount = JSON.parse(httpRequest.response);

				const descriptionMapping = {
					"pending": "pending questions",
					"awaitingVerificationGrammar": "questions awaiting grammar verification",
					"awaitingVerificationTemplates": "questions awaiting template verification",
					"awaitingVerificationRules": "questions awaiting rules verification",
				}

				const roleMapping = {
					"editor": "pending",
					"templateGuru": "awaitingVerificationTemplates",
					"grammarGuru": "awaitingVerificationGrammar",
					"rulesGuru": "awaitingVerificationRules",
				}

				let roles = [];
				Object.entries(currentLoggedInAdmin.roles).forEach(function(role) {
					if (role[1] && role[0] !== "owner") {
						roles.push(role[0]);
					}
				});

				roles = roles.map(role => roleMapping[role]);

				const combineStrings = function(strings) {
					if (strings.length === 1) {
						return strings[0];
					}
					if (strings.length === 2) {
						return strings[0] + " and " + strings[1];
					}
					let result = "";
					for (let i = 0 ; i < strings.length ; i++) {
						if (i === strings.length - 1) {
							result += "and " + strings[i];
						} else {
							result += strings[i] + ", ";
						}
					}
					return result;
				}

				const roleStrings = roles.map(role => questionCount[role] + " " + descriptionMapping[role]);

				document.getElementById("count").textContent = "There are " + combineStrings(roleStrings) + ".";
			}
		}
	};
	httpRequest.open("GET", "/getQuestionCount", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send();
}
setInterval(getQuestionCount, 60000);

let lastTimeRun = 0;
const updateEverythingBecauseICantFigureOutMyStupidCode = function() {
	if (Date.now() - lastTimeRun < 5000) {
		setTimeout(updateEverythingBecauseICantFigureOutMyStupidCode, 1000);
	} else {
		lastTimeRun = Date.now();
		if (previewWindow) {
			changePreviewAll()
		}
	}
}
document.getElementById("question").addEventListener("change", updateEverythingBecauseICantFigureOutMyStupidCode);
