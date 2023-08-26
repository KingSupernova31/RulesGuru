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
		"description": "Can participate in combat with no side effects",
		"rules": [
			{"preset":"Destructible with no side effects","orGroup":null},
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
			{"field":"Rules text","operator":"Does not contain:","value":"trigger","orGroup":null}
		],
	},
	{
		"description": "Destructible with no side effects",
		"rules": [
			{"preset":"Can exist self-sufficiently on battlefield","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"::name:: would be destroyed","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include:","value":"Indestructible","orGroup":null},
			{"field":"Rules text","operator":"Does not match:","value":"hen(ever)? .* (dies|(is|are) put into a graveyard|leaves the battlefield)","orGroup":null},
			{"field":"Rules text","operator":"Does not match:","value":"would (die|be put into a graveyard)","orGroup":null}
		],
	},
	{
		"description": "Spell to permanently exile one target creature",
		"rules": [
			{"preset":"Castable with no side effects","orGroup":null},
			{"field":"Rules text","operator":"Matches:","value":"Exile target (\\w+, )*(or )?(\\w+ or )?(creature|permanent)(?![a-z,A-Z ]*(with|if|card|that|an|and))","orGroup":null},
			{"field":"Types","operator":"Includes:","value":"Instant","orGroup":0},
			{"field":"Types","operator":"Includes:","value":"Sorcery","orGroup":0},
			{"field":"Rules text","operator":"Does not contain:","value":"choose","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"return it","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"return that","orGroup":null},
			{"field":"Rules text","operator":"Does not match:","value":"arget.*arget","orGroup":null},
		]
	},
	{
		"description": "Spell to permanently destroy one target creature",
		"rules": [
			{"preset":"Castable with no side effects","orGroup":null},
			{"field":"Rules text","operator":"Matches:","value":"Destroy target (\\w+, )*(or )?(\\w+ or )?(creature|permanent)(?![a-z,A-Z ]*(with|if|card|that|an|and))","orGroup":null},
			{"field":"Types","operator":"Includes:","value":"Instant","orGroup":0},
			{"field":"Types","operator":"Includes:","value":"Sorcery","orGroup":0},
			{"field":"Rules text","operator":"Does not contain:","value":"choose","orGroup":null},
			{"field":"Rules text","operator":"Does not match:","value":"arget.*arget","orGroup":null},
		],
	},
	{
		"description": "Draw cards and do nothing else",
		"rules": [
			{"field":"Rules text","operator":"Matches:","value":"^(Draw|Target player draws) \\w+ cards?\\.$","orGroup":null}
		],
	},
	{
		"description": "Tap for any amount of mana with no side effects",
		"rules": [
			{"field":"Rules text","operator":"Matches:","value":"(^|\\n){T}: Add ({[WUBRG0-9C]})+\\.($|\\n)","orGroup":null}
		],
	},
	{
		"description": "Spell to deal any amount of damage to any target",
		"rules": [
			{"preset":"Castable with no side effects","orGroup":null},
			{"field":"Rules text","operator":"Matches:","value":"(^|\\n)::name:: deals \\d damage to any target","orGroup":null},
			{"field":"Rules text","operator":"Does not contain:","value":"choose","orGroup":null},
			{"field":"Rules text","operator":"Does not match:","value":"arget.*arget","orGroup":null},
	],
	},
	{
		"description": "Enter as a copy of any nonland creature",
		"rules": [
			{"field":"Rules text","operator":"Matches:","value":"You may have ::name:: enter the battlefield as a copy of (any nonland permanent|a creature|any creature)(?! card)","orGroup":null}
		],
	},
]

if (typeof module === "object") {
	module.exports = presetTemplates;
};
