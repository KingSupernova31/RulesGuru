//JSON.stringify(createTemplate())
//Remember to remove extra backslashes from any regular expressions.

const presetTemplates = [
	{
		"id": 0,
		"description": "Can exist in non-battlefield, non-stack zones",
		"rules": [
			{"field":"Layout","operator":"Not","value":"split (half)","orGroup":null},
			{"field":"Multi-part side","operator":"Not","value":"b","orGroup":null},
		],
	},
	{
		"id": 1,
		"description": "Castable with no side effects",
		"rules": [{"field":"Types","operator":"Doesn't include","value":"Land","orGroup":null},{"field":"Layout","operator":"Is","value":"split (half)","orGroup":0},{"field":"Layout","operator":"Is","value":"modal double-faced","orGroup":0},{"field":"Layout","operator":"Is","value":"adventurer","orGroup":0},{"field":"Layout","operator":"Is","value":"normal","orGroup":0},{"field":"Layout","operator":"Is","value":"prototype","orGroup":0},{"field":"Multi-part side","operator":"Is","value":"a","orGroup":0},{"field":"Keywords","operator":"Includes","value":"Fuse","orGroup":0},{"field":"Mana cost","operator":"Includes","value":"{0}","orGroup":1},{"field":"Mana value","operator":">","value":"0","orGroup":1},{"field":"Rules text","operator":"Does not contain","value":"this spell","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"choose","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Demonstrate","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Storm","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Replicate","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Ripple","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Gravestorm","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Conspire","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Cascade","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Demonstrate","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Casualty","orGroup":null}],
	},
	{
		"id": 2,
		"description": "Can exist self-sufficiently on battlefield",
		"rules": [
			{"field":"Types","operator":"Doesn't include","value":"Instant","orGroup":null},
			{"field":"Types","operator":"Doesn't include","value":"Sorcery","orGroup":null},
			{"field":"Toughness","operator":">","value":"0","orGroup":0},
			{"field":"Types","operator":"Doesn't include","value":"Creature","orGroup":0},
			{"field":"Rules text","operator":"Does not match","value":"(^|\\n)::name:: gets [+-]\\d+/-[1-9]","orGroup":null}
		],
	},
	{
		"id": 3,
		"description": "Can participate in combat with no side effects (may still have LTB triggers/replacement effects)",
		"rules": [
			{"field":"Types","operator":"Includes","value":"Creature","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"attack","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"block","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"prevent","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"becomes tapped","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"damage","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Deathtouch","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Defender","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Double strike","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"First strike","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Flying","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Indestructible","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Intimidate","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Landwalk","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Lifelink","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Protection","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Reach","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Trample","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Vigilance","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Banding","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Rampage","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Flanking","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Shadow","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Horsemanship","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Fear","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Provoke","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Bushido","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Absorb","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Frenzy","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Poisonous","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Persist","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Wither","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Exalted","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Annihilator","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Infect","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Battle cry","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Dethrone","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Menace","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Renown","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Ingest","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Myriad","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Skulk","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Melee","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Afflict","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Mentor","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Decayed","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Training","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Enlist","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Toxic","orGroup":null},{"preset":13,"orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"walk","orGroup":null}
		]
	},
	{
		"id": 4,
		"description": "Targetable on battlefield with no side effects",
		"rules": [
			{"preset":2,"orGroup":null},
			{"field":"Keywords","operator":"Doesn't include","value":"Hexproof","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include","value":"Shroud","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include","value":"Protection","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include","value":"Ward","orGroup":null},
			{"field":"Rules text","operator":"Does not contain","value":"cast","orGroup":null},
			{"field":"Rules text","operator":"Does not contain","value":"target","orGroup":null},
			{"field":"Rules text","operator":"Does not contain","value":"activate","orGroup":null},
			{"field":"Rules text","operator":"Does not contain","value":"trigger","orGroup":null},
			{"field":"Rules text","operator":"Does not match","value":"(have|has) (hexproof|shroud|protection|ward)","orGroup":null}
		],
	},
	{
		"id": 5,
		"description": "Destructible with no side effects",
		"rules": [
			{"preset":2,"orGroup":null},
			{"field":"Rules text","operator":"Does not contain","value":"::name:: would be destroyed","orGroup":null},
			{"field":"Keywords","operator":"Doesn't include","value":"Indestructible","orGroup":null},
			{"field":"Rules text","operator":"Does not match","value":"hen(ever)? .* (dies|(is|are) put into a graveyard|leaves the battlefield)","orGroup":null},
			{"field":"Rules text","operator":"Does not match","value":"would (die|be put into a graveyard)","orGroup":null}
		],
	},
	{
		"id": 6,
		"description": "Instant or sorcery to permanently exile one target creature",
		"rules": [{"field":"Rules text","operator":"Matches","value":"Exile target (\\w+, )*(or )?(\\w+ or )?(creature|permanent)(?![a-z,A-Z ]*(with|if|card|that|an|and))","orGroup":null},{"field":"Types","operator":"Includes","value":"Instant","orGroup":0},{"field":"Types","operator":"Includes","value":"Sorcery","orGroup":0},{"field":"Rules text","operator":"Does not contain","value":"choose","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"return it","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"return that","orGroup":null},{"field":"Rules text","operator":"Does not match","value":"arget.*arget","orGroup":null},{"field":"Rules text","operator":"Does not match","value":"target[a-zA-Z ]*you( don't)?( own or)? control","orGroup":null},{"preset":1,"orGroup":null}]
	},
	{
		"id": 7,
		"description": "Instant or sorcery to permanently destroy one target creature",
		"rules": [
			{"preset":1,"orGroup":null},
			{"field":"Rules text","operator":"Matches","value":"Destroy target (\\w+, )*(or )?(\\w+ or )?(creature|permanent)(?![a-z,A-Z ]*(with|if|card|that|an|and))","orGroup":null},
			{"field":"Types","operator":"Includes","value":"Instant","orGroup":0},
			{"field":"Types","operator":"Includes","value":"Sorcery","orGroup":0},
			{"field":"Rules text","operator":"Does not contain","value":"choose","orGroup":null},
			{"field":"Rules text","operator":"Does not match","value":"arget.*arget","orGroup":null},
		],
	},
	{
		"id": 8,
		"description": "Draw cards and do nothing else",
		"rules": [
			{"field":"Rules text","operator":"Matches","value":"^(Draw|Target player draws) \\w+ cards?\\.$","orGroup":null}
		],
	},
	{
		"id": 9,
		"description": "Tap for any amount of mana with no side effects",
		"rules": [
			{"field":"Rules text","operator":"Matches","value":"(^|\\n){T}: Add ({[WUBRG0-9C]})+\\.($|\\n)","orGroup":null}
		],
	},
	{
		"id": 10,
		"description": "Instant or sorcery to deal any amount of damage to any target",
		"rules": [
			{"preset":1,"orGroup":null},
			{"field":"Rules text","operator":"Matches","value":"(^|\\n)::name:: deals \\d damage to any target","orGroup":null},
			{"field":"Rules text","operator":"Does not contain","value":"choose","orGroup":null},
			{"field":"Rules text","operator":"Does not match","value":"arget.*arget","orGroup":null},
		],
	},
	{
		"id": 11,
		"description": "Enter as a copy of any nonland creature",
		"rules": [
			{"field":"Rules text","operator":"Matches","value":"You may have ::name:: enter as a copy of (any nonland permanent|a creature|any creature)(?! card)","orGroup":null}
		],
	},
	{
		"id": 12,
		"description": "Instant or sorcery that targets exactly one thing",
		"rules": [{"field":"Rules text","operator":"Contains","value":"a target","orGroup":null},{"field":"Rules text","operator":"Does not match","value":"(ne|wo|hree|our|ive|ix|ny number of|X|or more) target","orGroup":null},{"field":"Rules text","operator":"Contains","value":"target","orGroup":null},{"field":"Rules text","operator":"Does not match","value":"arget(.|\\\\n)*arget","orGroup":null},{"field":"Rules text","operator":"Does not match","value":"\".*arget.*","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"new target","orGroup":null},{"field":"Rules text","operator":"Does not match","value":"becomes? (a|the) target","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"be the target","orGroup":null},{"field":"Rules text","operator":"Does not match","value":"that targets","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Overload","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Awaken","orGroup":null},{"field":"Types","operator":"Includes","value":"Instant","orGroup":1},{"field":"Types","operator":"Includes","value":"Sorcery","orGroup":1},{"field":"Rules text","operator":"Does not contain","value":"upport","orGroup":null}],
	},
	{
		"id": 13,
		"description": "Doesn't change its own type",
		"rules": [{"field":"Rules text","operator":"Does not match","value":"(is(n't)? an?|are|it's an?|becomes an?) (\\d\\/\\d )?(\\w+ )?(artifact|creature|land|battle|enchantment|planeswalker)","orGroup":null}],
	},
	{
		"id": 14,
		"description": "Only stack/battlefield abilities (including ETB/LTB) except CDAs, casting permissions, and command zone/outside the game abilities",
		"rules": [{"field":"Rules text","operator":"Does not contain","value":"if ::name:: is in your","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"if ::name:: is exiled","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"exile ::name:: from your","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"discard ::name::","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"::name:: isn't on the battlefield","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"return ::name:: from your","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"as long as ::name:: is in your","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"you cycle ::name::","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"put ::name:: from your hand","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"::name:: would be put into a graveyard from anywhere","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"::name:: is put into a graveyard from anywhere","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"reveal ::name:: from","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Haunt","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Madness","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Ninjutsu","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Dredge","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Transmute","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Forecast","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Recover","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Aura swap","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Reinforce","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Wither","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Unearth","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Infect","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Miracle","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Embalm","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Eternalize","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Encore","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Toxic","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Cycling","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Foretell","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Suspend","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Scavenge","orGroup":null}],
	},
	{
		"id": 15,
		"description": "Unconditional counterspell",
		"rules": [{"field":"Rules text","operator":"Contains","value":"Counter target spell.","orGroup":null},{"field":"Rules text","operator":"Does not contain","value":"\"","orGroup":null},{"field":"Rules text","operator":"Does not match","value":"Choose.*—","orGroup":null},{"field":"Types","operator":"Includes","value":"Instant","orGroup":null}],
	},
	{
		"id": 16,
		"description": "Doesn't affect only its own size",
		"rules": [{"field":"Rules text","operator":"Does not match","value":"(^|\\n)[^:]*(::name::|it|this creature) gets","orGroup":null},{"field":"Rules text","operator":"Does not match","value":"(^|\\n)[^:]*(::name::|it|this creature) (becomes|is).*/","orGroup":null},{"field":"Rules text","operator":"Does not match","value":"(^|\\n)[^:]*(::name::|it|this creature)'s power","orGroup":null},{"field":"Rules text","operator":"Does not match","value":"(^|\\n)[^:]*(::name::|it|this creature)'s toughness","orGroup":null},{"field":"Rules text","operator":"Does not match","value":"(^|\\n)[^:]*exchange its","orGroup":null}],
	},
	{
		"id": 17,
		"description": "No cast triggers on battlefield",
		"rules": [{"field":"Rules text","operator":"Does not match","value":"hen.*cast","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Extort","orGroup":null},{"field":"Keywords","operator":"Doesn't include","value":"Prowess","orGroup":null}],
	},
]

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
