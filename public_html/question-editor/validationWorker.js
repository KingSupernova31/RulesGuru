importScripts("/public_data_files/cardNamesToIgnore.js");
importScripts("/globalResources/symbols.js");
importScripts("/globalResources/replaceExpressions.js");
importScripts("/public_data_files/allCardsSimple.js");
importScripts("/public_data_files/allRules.js");
importScripts("validateQuestion.js");
allCardNames = Object.keys(allCards);
let allSubtypes = [];

onmessage = function(message) {
	allSubtypes = message.data.allSubtypes;
	postMessage(validateQuestion(message.data.question, message.data.templateEmptyness, message.data.convertedTemplateStorage, message.data.currentAdminName, message.data.savedCardLists));
}
