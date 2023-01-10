"use strict";

//Handle rules selection in sidebar
if (typeof allRuleNumbers === "undefined") {
	window.allRuleNumbers = Object.keys(allRules);
}
let allRuleHeaders = new Set;
for (let i in allRuleNumbers) {
	allRuleHeaders.add(allRuleNumbers[i].slice(0,3))
}
allRuleHeaders = Array.from(allRuleHeaders);
let currentSidebarRules = [];
let addSidebarRule = function(rule) {
	const actuallyAddTheRule = function(rule) {
		if (!currentSidebarRules.includes(rule)) {
			let newRule = document.createElement("li");
			newRule.setAttribute("onclick", "currentSidebarRules.splice(currentSidebarRules.indexOf(this.textContent),1);this.parentElement.removeChild(this);event.stopPropagation();");
			newRule.appendChild(document.createTextNode(rule));
			document.getElementById("selectedRulesList").appendChild(newRule);
			document.getElementById("sidebarRuleInput").value = "";
			currentSidebarRules.push(rule);
		}
	}

	if (rule.charAt(rule.length - 1) === ".") {
		if (allRuleNumbers.includes(rule.slice(0, rule.length - 1)) || (window.location.href.includes("/question-editor") && rule !== "")) {
			actuallyAddTheRule(rule);
		}
	} else {
		if (allRuleNumbers.includes(rule) || allRuleHeaders.includes(rule) || (window.location.href.includes("/question-editor") && rule !== "")) {
			actuallyAddTheRule(rule);
		}
	}
};

//Handle cards selection in sidebar
if (typeof allCards === "undefined") {
	const allCardNames = [];
	for (let i in searchLinkMappings.cards) {
		if (!searchLinkCardNamesDiff.includes(Number(i))) {
			allCardNames.push(searchLinkMappings.cards[i])
		}
	}
	window.allCardNames = allCardNames;
} else {
	window.allCardNames = Object.keys(allCards);
}
allCardNames.sort();
let cardOptions = "";
for (let i in allCardNames) {
	cardOptions += `<option value="${allCardNames[i].replace(/"/g, `&quot;`)}" />`
}
const cardsDatalist = document.createElement("datalist");
cardsDatalist.setAttribute("id", "allCardsDatalist");
cardsDatalist.innerHTML = cardOptions;
//There's lag whenever a large datalist is part of the DOM, so we remove it when it's not needed.
document.getElementById("sidebarCardInput").addEventListener("focus", function(event) {
	document.querySelector("body").appendChild(cardsDatalist);
});
document.getElementById("sidebarCardInput").addEventListener("blur", function(event) {
	document.querySelector("body").removeChild(cardsDatalist);
});
let currentSidebarCards = [];
let addSidebarCard = function(card) {
	if (allCardNames.includes(card) && !currentSidebarCards.includes(card)) {
		let newCard = document.createElement("li");
		newCard.setAttribute("onclick", "currentSidebarCards.splice(currentSidebarCards.indexOf(this.textContent),1);this.parentElement.removeChild(this);event.stopPropagation();");
		newCard.appendChild(document.createTextNode(card));
		document.getElementById("selectedCardsList").appendChild(newCard);
		document.getElementById("sidebarCardInput").value = "";
		currentSidebarCards.push(card);
	}
};

document.getElementById("sidebar").addEventListener("change", function() {
	updateSidebarSettings();
})
const sidebarChangeObserver = new MutationObserver(updateSidebarSettings);
sidebarChangeObserver.observe(document.getElementById("sidebar"), {attributes: true, childList: true, subtree: true});

//Update sidebar preferences from sidebarSettings object.
Array.from(document.querySelectorAll("#sidebarLevel input")).forEach(function(element,index,array){
	if (sidebarSettings.level.includes(element.parentNode.textContent)) {
		element.checked = true;
	}
});
Array.from(document.querySelectorAll("#sidebarComplexity input")).forEach(function(element,index,array){
	if (sidebarSettings.complexity.includes(element.parentNode.textContent)) {
		element.checked = true;
	}
});
document.getElementById("sidebarLegalityDropdown").value = sidebarSettings.legality;
document.getElementById("sidebarPlayability").checked = sidebarSettings.playableOnly;
document.getElementById("cardDisplayFormat").value = sidebarSettings.cardDisplayFormat;
Array.from(document.querySelectorAll("input[name='tagsConjunc']")).forEach(function(element,index,array){
	if (sidebarSettings.tagsConjunc === element.parentNode.textContent) {
		element.checked = true;
	}
});
Array.from(document.querySelectorAll("input[name='rulesConjunc']")).forEach(function(element,index,array){
	if (sidebarSettings.rulesConjunc === element.parentNode.textContent) {
		element.checked = true;
	}
});
Array.from(document.querySelectorAll("input[name='cardsConjunc']")).forEach(function(element,index,array){
	if (sidebarSettings.cardsConjunc === element.parentNode.textContent) {
		element.checked = true;
	}
});
sidebarSettings.expansions.forEach(function(element,index,array) {
	addSidebarExpansion(element);
});
sidebarSettings.tags.forEach(function(element,index,array) {
	addSidebarTag(element);
});
sidebarSettings.rules.forEach(function(element,index,array) {
	addSidebarRule(element);
});
sidebarSettings.cards.forEach(function(element,index,array) {
	addSidebarCard(element);
});

document.getElementById("topBanner").appendChild(document.getElementById("settingsButton"));
if (!window.location.href.includes("question-editor")) {
	document.getElementById("settingsButton").style.display = "block";
}

togglePlayability();
