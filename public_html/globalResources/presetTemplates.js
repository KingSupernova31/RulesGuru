//JSON.stringify(createTemplate())
//Remember to remove extra backslashes from any regular expressions.

const presetTemplates = [
	{
		"description": "Can exist in library",
		"rules": [
			{"field":"Layout","operator":"Not:","value":"split (half)","orGroup":null},
			{"field":"Multi-part side","operator":"Not:","value":"b","orGroup":null}
		],
	},
	{
		"description": "Castable with no side effects",
		"rules": [
			{"field":"Types","operator":"Doesn't include:","value":"Land","orGroup":null},
			{"field":"Layout","operator":"Is:","value":"split (half)","orGroup":100},
			{"field":"Layout","operator":"Is:","value":"modal double-faced","orGroup":100},
			{"field":"Layout","operator":"Is:","value":"adventurer","orGroup":100},
			{"field":"Layout","operator":"Is:","value":"normal","orGroup":100},
			{"field":"Layout","operator":"Is:","value":"prototype","orGroup":100},
			{"field":"Multi-part side","operator":"Is:","value":"a","orGroup":100},
			{"field":"Keywords","operator":"Includes:","value":"Fuse","orGroup":100},
			{"field":"Mana cost","operator":"Includes:","value":"{0}","orGroup":101},
			{"field":"Mana value","operator":">","value":"0","orGroup":101},
			{"field":"Rules text","operator":"Does not contain:","value":"this spell","orGroup":null}
		],
	},
	{
		"description": "Can exist self-sufficiently on battlefield",
		"rules": [
			{"field":"Types","operator":"Doesn't include:","value":"Instant","orGroup":null},
			{"field":"Types","operator":"Doesn't include:","value":"Sorcery","orGroup":null},
			{"field":"Toughness","operator":">","value":"0","orGroup":200},
			{"field":"Types","operator":"Doesn't include:","value":"Creature","orGroup":200},
			{"field":"Rules text","operator":"Does not match:","value":"(^|\\n)::name:: gets [+-]\\d+/-[1-9]","orGroup":null}],
	},
	{
		"description": "Targetable on battlefield with no side effects",
		"rules": [
			{"preset":"Can exist self-sufficiently on battlefield","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Hexproof","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Shroud","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Protection","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Ward","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"cast","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"target","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"activate","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"trigger","orGroup":null}],
	},
	{
		"description": "Destructible with no side effects",
		"rules": [
			{"preset":"Can exist self-sufficiently on battlefield","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"::name:: would be destroyed","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Indestructible","orGroup":null},
			{"field":"Rules text","operator":"Does not match:","value":"hen(ever)? .* (dies|(is|are) put into a graveyard|leaves the battlefield)","orGroup":null},
			{"field":"Rules text","operator":"Does not match:","value":"would (die|be put into a graveyard)","orGroup":null}],
	},
]

if (typeof module === "object") {
	module.exports = presetTemplates;
};
