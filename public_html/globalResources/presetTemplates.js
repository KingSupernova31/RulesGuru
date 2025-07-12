//JSON.stringify(createTemplate())
//Remember to remove extra backslashes from any regular expressions.

const presetTemplates = []; //TODO

let presetIds = [];
let presetDescriptions = [];
for (let preset of presetTemplates) {
	presetIds.push(preset.id);
	presetDescriptions.push(preset.id)
}
if (presetIds.length !== Array.from(new Set(presetIds)).length) {
	throw new Error("Duplicate preset IDs");
}
if (presetDescriptions.length !== Array.from(new Set(presetDescriptions)).length) {
	throw new Error("Duplicate preset descriptions");
}

if (typeof module === "object") {
	module.exports = presetTemplates;
};
