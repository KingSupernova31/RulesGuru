importScripts("/globalResources/allKeywords.js");
importScripts("allCards.js");
importScripts("allRules.js");
importScripts("validateQuestion.js");
allCardNames = Object.keys(allCards);
let allSubtypes = [];

onmessage = function(message) {
	allSubtypes = message.data.allSubtypes;
	postMessage(validateQuestion(message.data.question, message.data.templateEmptyness));
}
