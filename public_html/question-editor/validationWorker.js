importScripts("cardNamesToIgnore.js");
importScripts("/globalResources/symbols.js");
importScripts("/globalResources/replaceExpressions.js");
importScripts("allCards.js");
importScripts("allRules.js");
importScripts("validateQuestion.js");
allCardNames = Object.keys(allCards);
let allSubtypes = [];

onmessage = function(message) {
	allSubtypes = message.data.allSubtypes;
	postMessage(validateQuestion(message.data.question, message.data.templateEmptyness, message.data.convertedTemplateStorage, message.data.currentAdminName, message.data.savedCardLists));
}
