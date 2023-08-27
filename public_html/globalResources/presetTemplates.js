//JSON.stringify(createTemplate())
//Remember to remove extra backslashes from any regular expressions.

const presetTemplates = [
	{
		"id": 0,
		"description": "Can exist in library",
		"rules": [
			{"field":"Layout","operator":"Not:","value":"split (half)","orGroup":0},
			{"field":"Multi-part side","operator":"Not:","value":"b","orGroup":1},
			{"field":"Multi-part side","operator":"Not:","value":"b","orGroup":2},
			{"field":"Multi-part side","operator":"Not:","value":"b","orGroup":3},
			{"field":"Multi-part side","operator":"Not:","value":"b","orGroup":4},
			{"field":"Multi-part side","operator":"Not:","value":"b","orGroup":5},
		],
	},
	{
		"id": 1,
		"description": "Castable with no side effects",
		"rules": [
			{"field":"Types","operator":"Doesn't include:","value":"Land","orGroup":null},
			{"field":"Layout","operator":"Is:","value":"split (half)","orGroup":0},
			{"field":"Layout","operator":"Is:","value":"modal double-faced","orGroup":0},
			{"field":"Layout","operator":"Is:","value":"adventurer","orGroup":0},
			{"field":"Layout","operator":"Is:","value":"normal","orGroup":0},
			{"field":"Layout","operator":"Is:","value":"prototype","orGroup":0},
			{"field":"Multi-part side","operator":"Is:","value":"a","orGroup":0},
			{"field":"Keywords","operator":"Includes:","value":"Fuse","orGroup":0},
			{"field":"Mana cost","operator":"Includes:","value":"{0}","orGroup":1},
			{"field":"Mana value","operator":">","value":"0","orGroup":1},
			{"field":"Rules text","operator":"Does not contain:","value":"this spell","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"choose","orGroup":null},
		],
	},
	{
		"id": 2,
		"description": "Can exist self-sufficiently on battlefield",
		"rules": [
			{"field":"Types","operator":"Doesn't include:","value":"Instant","orGroup":null},
			{"field":"Types","operator":"Doesn't include:","value":"Sorcery","orGroup":null},
			{"field":"Toughness","operator":">","value":"0","orGroup":0},
			{"field":"Types","operator":"Doesn't include:","value":"Creature","orGroup":0},
			{"field":"Rules text","operator":"Does not match:","value":"(^|\\n)::name:: gets [+-]\\d+/-[1-9]","orGroup":null}
		],
	},
	{
		"id": 3,
		"description": "Can participate in combat with no side effects",
		"rules": [
			{"preset":5,"orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"First strike","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Double strike","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Protection","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Absorb","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Indestructible","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"would be dealt damage","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"would be destroyed","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"would die","orGroup":null},
			{"field":"Types","operator":"Includes:","value":"Creature","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"attack","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"block","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"prevent","orGroup":null}
		]
	},
	{
		"id": 4,
		"description": "Targetable on battlefield with no side effects",
		"rules": [
			{"preset":2,"orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Hexproof","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Shroud","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Protection","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Ward","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"cast","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"target","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"activate","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"trigger","orGroup":null}
		],
	},
	{
		"id": 5,
		"description": "Destructible with no side effects",
		"rules": [
			{"preset":2,"orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"::name:: would be destroyed","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Indestructible","orGroup":null},
			{"field":"Rules text","operator":"Does not match:","value":"hen(ever)? .* (dies|(is|are) put into a graveyard|leaves the battlefield)","orGroup":null},
			{"field":"Rules text","operator":"Does not match:","value":"would (die|be put into a graveyard)","orGroup":null}
		],
	},
	{
		"id": 6,
		"description": "Instant or sorcery to permanently exile one target creature",
		"rules": [{"field":"Rules text","operator":"Matches:","value":"Exile target (\\w+, )*(or )?(\\w+ or )?(creature|permanent)(?![a-z,A-Z ]*(with|if|card|that|an|and))","orGroup":null},{"field":"Types","operator":"Includes:","value":"Instant","orGroup":200},{"field":"Types","operator":"Includes:","value":"Sorcery","orGroup":200},{"field":"Rules text","operator":"Does not contain:","value":"choose","orGroup":null},{"field":"Rules text","operator":"Does not contain:","value":"return it","orGroup":null},{"field":"Rules text","operator":"Does not contain:","value":"return that","orGroup":null},{"field":"Rules text","operator":"Does not match:","value":"arget.*arget","orGroup":null},{"field":"Rules text","operator":"Does not match:","value":"target[a-zA-Z ]*you( don't)?( own or)? control","orGroup":null},{"preset":1,"orGroup":null}]
	},
	{
		"id": 7,
		"description": "Instant or sorcery to permanently destroy one target creature",
		"rules": [
			{"preset":1,"orGroup":null},
			{"field":"Rules text","operator":"Matches:","value":"Destroy target (\\w+, )*(or )?(\\w+ or )?(creature|permanent)(?![a-z,A-Z ]*(with|if|card|that|an|and))","orGroup":null},
			{"field":"Types","operator":"Includes:","value":"Instant","orGroup":0},
			{"field":"Types","operator":"Includes:","value":"Sorcery","orGroup":0},
			{"field":"Rules text","operator":"Does not contain:","value":"choose","orGroup":null},
			{"field":"Rules text","operator":"Does not match:","value":"arget.*arget","orGroup":null},
		],
	},
	{
		"id": 8,
		"description": "Draw cards and do nothing else",
		"rules": [
			{"field":"Rules text","operator":"Matches:","value":"^(Draw|Target player draws) \\w+ cards?\\.$","orGroup":null}
		],
	},
	{
		"id": 9,
		"description": "Tap for any amount of mana with no side effects",
		"rules": [
			{"field":"Rules text","operator":"Matches:","value":"(^|\\n){T}: Add ({[WUBRG0-9C]})+\\.($|\\n)","orGroup":null}
		],
	},
	{
		"id": 10,
		"description": "Instant or sorcery to deal any amount of damage to any target",
		"rules": [
			{"preset":1,"orGroup":null},
			{"field":"Rules text","operator":"Matches:","value":"(^|\\n)::name:: deals \\d damage to any target","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"choose","orGroup":null},
			{"field":"Rules text","operator":"Does not match:","value":"arget.*arget","orGroup":null},
		],
	},
	{
		"id": 11,
		"description": "Enter as a copy of any nonland creature",
		"rules": [
			{"field":"Rules text","operator":"Matches:","value":"You may have ::name:: enter the battlefield as a copy of (any nonland permanent|a creature|any creature)(?! card)","orGroup":null}
		],
	},
	{
		"id": 12,
		"description": "Instant or sorcery that targets exactly one thing",
		"rules": [{"field":"Rules text","operator":"Contains:","value":"a target","orGroup":null},{"field":"Rules text","operator":"Does not match:","value":"(ne|wo|hree|our|ive|ix|ny number of|X|or more) target","orGroup":null},{"field":"Rules text","operator":"Contains:","value":"target","orGroup":null},{"field":"Rules text","operator":"Does not match:","value":"arget(.|\\\\n)*arget","orGroup":null},{"field":"Rules text","operator":"Does not match:","value":"\".*arget.*","orGroup":null},{"field":"Rules text","operator":"Does not contain:","value":"new target","orGroup":null},{"field":"Rules text","operator":"Does not match:","value":"becomes? (a|the) target","orGroup":null},{"field":"Rules text","operator":"Does not contain:","value":"be the target","orGroup":null},{"field":"Rules text","operator":"Does not match:","value":"that targets","orGroup":null},{"field":"Keywords","operator":"Doesn't include:","value":"Overload","orGroup":null},{"field":"Keywords","operator":"Doesn't include:","value":"Awaken","orGroup":null},{"field":"Types","operator":"Includes:","value":"Instant","orGroup":1},{"field":"Types","operator":"Includes:","value":"Sorcery","orGroup":1},{"field":"Rules text","operator":"Does not contain:","value":"upport","orGroup":null}],
	},
]

let presetIds = [];
let presetDescriptions = [];
for (let preset of presetTemplates) {
	presetIds.push(preset.id);
	presetDescriptions.push(preset.id)
}
if (presetIds.length !== Array.from(new Set(presetIds)).length) {
	handleError("Duplicate preset IDs");
}
if (presetDescriptions.length !== Array.from(new Set(presetDescriptions)).length) {
	handleError("Duplicate preset descriptions");
}

if (typeof module === "object") {
	module.exports = presetTemplates;
};
