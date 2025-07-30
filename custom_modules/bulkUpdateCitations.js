"use strict";

const sqlite = require("sqlite3").verbose(),
		util = require("util");

const alphabet = "abcdefghijkmnpqrstuvwxyz";
//Returns the next letter of the alphabet, skipping "l" and "o".
const nextLetter = function(letter) {
	if (letter === "z") {throw new Error("No next letter");}
	return alphabet[alphabet.indexOf(letter) + 1];
}
const previousLetter = function(letter) {
	if (letter === "a") {throw new Error("No previous letter");}
	return alphabet[alphabet.indexOf(letter) - 1];
}
const letterAIsBeforeLetterB = function(letterA, letterB) {
	return alphabet.indexOf(letterA) < alphabet.indexOf(letterB);
}
const getTier = function(rule) {
	if (rule.length === 1) {return 0;}
	if (rule.length === 3) {return 1;}
	const c = rule.charCodeAt(rule.length - 1);
	if (c >= 48 && c <= 57) {return 2;}//Equivalent to /[0-9]$/.test(rule) but much faster; this is called a lot.
	return 3;
}
const filterToTier = function(rules, tier) {
	return rules.filter(r => getTier(r) === tier);
}
const getParent = function(rule) {
	const tier = getTier(rule);
	if (tier === 1) return rule[0];
	if (tier === 2) return rule.slice(0, 3);
	if (tier === 3) return rule.slice(0, rule.length - 1);
};
const sortRules = function(rules) {
	if (rules.length === 0) {return rules;}
	// Validate that all rules are at the same depth
	const firstTier = getTier(rules[0]);
	for (let rule of rules) {
		if (getTier(rule) !== firstTier) {
			throw new Error(`Rules must be at the same depth: ${rules[0]} (tier ${firstTier}) vs ${rule} (tier ${getTier(rule)})`);
		}
	}
	
	// Sort the rules
	rules.sort((a, b) => {
		const tier = getTier(a);
		if (tier === 1) {
			// Sort by numeric value: "100" vs "101"
			return parseInt(a) - parseInt(b);
		} else if (tier === 2) {
			// Sort by decimal part: "100.1" vs "100.2"
			const aDecimal = parseInt(a.split('.')[1]);
			const bDecimal = parseInt(b.split('.')[1]);
			return aDecimal - bDecimal;
		} else if (tier === 3) {
			// Sort by base rule then letter: "100.1a" vs "100.1b"
			const aBase = a.substring(0, a.length - 1);
			const bBase = b.substring(0, b.length - 1);
			const baseComparison = aBase.localeCompare(bBase);
			if (baseComparison !== 0) return baseComparison;
			
			const aLetter = a.slice(-1);
			const bLetter = b.slice(-1);
			return letterAIsBeforeLetterB(aLetter, bLetter) ? -1 : 1;
		}
		return 0;
	});
	
	return rules;
}

const getAllRuleNumsOfSameBranch = function(rule, rules) {
	const ruleTier = getTier(rule);
	const ruleParent = getParent(rule);
	return rules.filter(r => {
		// Must be same tier (depth)
		if (getTier(r) !== ruleTier) return false;
		
		// Must have same parent (same branch)
		return getParent(r) === ruleParent;
	});
}

const getFirstChildRuleNum = function(ruleNum) {
	const tier = getTier(ruleNum);
	
	if (tier === 0) {
		// Section numbers like "1" -> first main rule "100"
		const section = parseInt(ruleNum);
		return (section * 100).toString();
	} else if (tier === 1) {
		// Main rules like "100" -> first subrule "100.1"
		return `${ruleNum}.1`;
	} else if (tier === 2) {
		// Subrules like "100.1" -> first lettered rule "100.1a"
		return `${ruleNum}a`;
	} else if (tier === 3) {
		// Lettered rules don't have children
		return null;
	}
	
	return null;
}

const getNextRuleNumInBranch = function(ruleNum) {
	const tier = getTier(ruleNum);
	
	if (tier === 1) {
		// For main rules like "100" -> "101"
		const num = parseInt(ruleNum);
		return (num + 1).toString();
	} else if (tier === 2) {
		// For subrules like "100.1" -> "100.2"
		const parts = ruleNum.split('.');
		const main = parts[0];
		const sub = parseInt(parts[1]);
		return `${main}.${sub + 1}`;
	} else if (tier === 3) {
		// For lettered rules like "100.1a" -> "100.1b"
		const base = ruleNum.substring(0, ruleNum.length - 1);
		const letter = ruleNum.slice(-1);
		
		try {
			const next = nextLetter(letter);
			return `${base}${next}`;
		} catch (e) {
			return null; // Already at 'z', can't go next
		}
	}
	
	return null;
}

const getPreviousRuleInBranch = function(ruleNum) {
	const tier = getTier(ruleNum);
	
	if (tier === 1) {
		// For main rules like "101" -> "100", but "100", "200", "300" etc. have no previous
		const num = parseInt(ruleNum);
		const section = Math.floor(num / 100);
		const sectionStart = section * 100;
		
		// If this is the first rule of a section (100, 200, 300, etc.), no previous
		if (num === sectionStart) return null;
		
		return (num - 1).toString();
	} else if (tier === 2) {
		// For subrules like "100.2" -> "100.1"
		const parts = ruleNum.split('.');
		const main = parts[0];
		const sub = parseInt(parts[1]);
		if (sub <= 1) return null; // Can't go below .1
		return `${main}.${sub - 1}`;
	} else if (tier === 3) {
		// For lettered rules like "100.1b" -> "100.1a"
		const base = ruleNum.substring(0, ruleNum.length - 1);
		const letter = ruleNum.slice(-1);
		
		try {
			const prevLetter = previousLetter(letter);
			return `${base}${prevLetter}`;
		} catch (e) {
			return null; // Already at 'a', can't go previous
		}
	}
	
	return null;
}

const makeTree = function(rulesList) {
	const tree = [];
	
	// Process each section (1-9)
	for (let section = 1; section <= 9; section++) {
		const sectionNode = {
			originalRuleNum: section.toString(),
			subrules: []
		};
		
		// Get all tier 1 rules for this section (like "100", "101" for section 1)
		const tier1Rules = rulesList.filter(r => getTier(r) === 1 && getParent(r) === section.toString());
		sortRules(tier1Rules);
		
		for (const mainRule of tier1Rules) {
			const mainNode = {
				originalRuleNum: mainRule,
				subrules: []
			};
			
			// Get all tier 2 rules for this main rule (like "100.1", "100.2")
			const tier2Rules = rulesList.filter(r => getTier(r) === 2 && getParent(r) === mainRule);
			sortRules(tier2Rules);
			
			for (const subRule of tier2Rules) {
				const subNode = {
					originalRuleNum: subRule,
					subrules: []
				};
				
				// Get all tier 3 rules for this subrule (like "100.1a", "100.1b")
				const tier3Rules = rulesList.filter(r => getTier(r) === 3 && getParent(r) === subRule);
				sortRules(tier3Rules);
				
				for (const letteredRule of tier3Rules) {
					const letteredNode = {
						originalRuleNum: letteredRule,
						subrules: [] // Tier 3 rules don't have subrules
					};
					subNode.subrules.push(letteredNode);
				}
				
				mainNode.subrules.push(subNode);
			}
			
			sectionNode.subrules.push(mainNode);
		}
		
		// Only add section to tree if it has rules
		if (sectionNode.subrules.length > 0) {
			tree.push(sectionNode);
		}
	}
	
	return tree;
}

const relabelTree = function(tree) {
	// Traverse the tree and assign newRuleNum based on position
	for (let sectionIndex = 0; sectionIndex < tree.length; sectionIndex++) {
		const section = tree[sectionIndex];
		const sectionNum = (sectionIndex + 1).toString(); // Convert 0-8 to 1-9
		
		for (let mainIndex = 0; mainIndex < section.subrules.length; mainIndex++) {
			const mainRule = section.subrules[mainIndex];
			// Main rules: section * 100 + index (e.g., section 1, index 0 = "100")
			const mainRuleNum = (parseInt(sectionNum) * 100 + mainIndex).toString();
			mainRule.newRuleNum = mainRuleNum;
			
			for (let subIndex = 0; subIndex < mainRule.subrules.length; subIndex++) {
				const subRule = mainRule.subrules[subIndex];
				// Subrules: mainRule + "." + (index + 1) (e.g., "100.1")
				const subRuleNum = `${mainRuleNum}.${subIndex + 1}`;
				subRule.newRuleNum = subRuleNum;
				
				for (let letterIndex = 0; letterIndex < subRule.subrules.length; letterIndex++) {
					const letterRule = subRule.subrules[letterIndex];
					// Letter rules: subRule + alphabet letter (e.g., "100.1a")
					const letterRuleNum = `${subRuleNum}${alphabet[letterIndex]}`;
					letterRule.newRuleNum = letterRuleNum;
				}
			}
		}
	}
}

const findRuleByCurrentLocation = function(ruleNum, tree) {
	const location = ruleNumToTreeLocation(ruleNum);
	return getRuleByLocation(location, tree);
}

const findRuleByOriginalNum = function(ruleNum, tree) {
	function searchNode(node) {
		if (node.originalRuleNum === ruleNum) {
			return node;
		}
		for (let subrule of node.subrules) {
			const result = searchNode(subrule);
			if (result) return result;
		}
		return null;
	}
	for (let rule of tree) {
		const result = searchNode(rule);
		if (result) {return result;}
	}
	return null;
}

function subtractInPlace(arr1, arr2) {
	const set1 = new Set(arr1);
	for (const val of arr2) {
		if (!set1.has(val)) {
			throw new Error(`Element ${val} not found in the first array`);
		}
	}
	const toRemove = new Set(arr2);
	for (let i = arr1.length - 1; i >= 0; i--) {
		if (toRemove.has(arr1[i])) {
			arr1.splice(i, 1);
		}
	}
}

const getRuleByLocation = function(location, tree) {
	const editableLocation = [...location];
	let pos = tree[editableLocation.shift()];
	if (!pos) {return null;}
	while (editableLocation.length > 0) {
		pos = pos.subrules[editableLocation.shift()];
		if (!pos) {return null;}
	}
	return pos;
}
//This returns its theoretical location by rule number, not its actual current location.
const ruleNumToTreeLocation = function(ruleNum) {
	const tier = getTier(ruleNum);

	if (tier === 0) {
		return [Number(ruleNum) - 1];
	} else if (tier === 1) {
		// Main rule like "100"
		const num = parseInt(ruleNum);
		const section = Math.floor(num / 100);
		const sectionIndex = section - 1; // Convert 1-9 to 0-8
		const mainRuleIndex = num - (section * 100); // 100->0, 101->1, etc.
		return [sectionIndex, mainRuleIndex];
	} else if (tier === 2) {
		// Subrule like "100.1"
		const parts = ruleNum.split('.');
		const mainRule = parts[0];
		const subRuleNum = parseInt(parts[1]);
		
		const num = parseInt(mainRule);
		const section = Math.floor(num / 100);
		const sectionIndex = section - 1;
		const mainRuleIndex = num - (section * 100);
		const subRuleIndex = subRuleNum - 1; // Convert 1-based to 0-based
		
		return [sectionIndex, mainRuleIndex, subRuleIndex];
	} else if (tier === 3) {
		// Lettered rule like "100.1a"
		const letter = ruleNum.slice(-1);
		const baseRule = ruleNum.substring(0, ruleNum.length - 1);
		const parts = baseRule.split('.');
		const mainRule = parts[0];
		const subRuleNum = parseInt(parts[1]);
		
		const num = parseInt(mainRule);
		const section = Math.floor(num / 100);
		const sectionIndex = section - 1;
		const mainRuleIndex = num - (section * 100);
		const subRuleIndex = subRuleNum - 1;
		const letteredRuleIndex = alphabet.indexOf(letter);
		
		return [sectionIndex, mainRuleIndex, subRuleIndex, letteredRuleIndex];
	}
	
	return null;
}

const getFirstEmptySlotInSparseArray = function(arr) {
	let i = 0;
	while (true) {
		if (arr[i] === undefined) {return i;}
		i++;
	}
}

//Doesn't run the callback on top level nodes since those aren't considered "rules".
const crawlEachRule = function(tree, func) {
	const r = function(rule) {
		for (let subrule of rule.subrules) {
			func(subrule);
			r(subrule);
		}
	}
	for (let node of tree) {
		r(node);
	}
}

const getFinalTree = function(removed, added, moved, allRuleNums) {
	const tree = makeTree(allRuleNums);

	const ruleNumsToRemove = removed.concat(moved.map(m => m.from));
	const ruleNumsToAdd = added.concat(moved.map(m => m.to));
	if (ruleNumsToRemove.length !== Array.from(new Set(ruleNumsToRemove)).length) {
		throw new Error("Duplicate found in ruleNumsToRemove");
	}
	if (ruleNumsToAdd.length !== Array.from(new Set(ruleNumsToAdd)).length) {
		throw new Error("Duplicate found in ruleNumsToAdd");
	}

	//We first remove rules as indexed by their original number. Any that are being moved we save in a separate tree.
	const movedRules = [];
	for (let ruleNum of ruleNumsToRemove) {
		//We remove any removed or moved away rules from the branch.
		const branchName = getParent(ruleNum);
		//Have to search both because the parent might have already been removed from the tree.
		const branch = findRuleByOriginalNum(branchName, tree) || findRuleByOriginalNum(branchName, movedRules);
		const rule = branch.subrules.splice(branch.subrules.findIndex(r => r.originalRuleNum === ruleNum), 1)[0];

		if (moved.map(m => m.from).includes(ruleNum)) {
			movedRules.push(rule);
		}
	}

	//Then we add in all the new and moved rules. I think either depth-first or breadth-first works, all that matters is that parents are addressed before children.
	for (let tier = 1 ; tier <=3 ; tier++) {
		const thisTierAdditions = filterToTier(ruleNumsToAdd, tier);
		sortRules(thisTierAdditions);

		while (thisTierAdditions.length > 0) {
			const allAddedRulesOfSameBranch = getAllRuleNumsOfSameBranch(thisTierAdditions[0], thisTierAdditions);
			subtractInPlace(thisTierAdditions, allAddedRulesOfSameBranch);

			const branchNum = getParent(allAddedRulesOfSameBranch[0])
			const branch = findRuleByCurrentLocation(branchNum, tree) || findRuleByCurrentLocation(branchNum, movedRules);
			if (branch === null) {
				throw new Error("Attempting to modify subrules of a rule that doesn't exist.");
			}

			const newBranchRules = [];
			for (let addedRuleNum of allAddedRulesOfSameBranch) {

				let newRule;
				const moveData = moved.find(m => m.to === addedRuleNum);
				if (moveData) {
					newRule = movedRules.find(r => r.originalRuleNum === moveData.from);
					if (!newRule) {throw new Error("Could not find moved rule.")}
				} else {
					newRule = {
						"originalRuleNum": null,
						"subrules": [],
					}
				}

				const branchLocation = ruleNumToTreeLocation(addedRuleNum)[tier];
				newBranchRules[branchLocation] = newRule;
			}

			//We fill in the rest of the unchanged rules into the first available slot.
			for (let rule of branch.subrules) {
				const spot = getFirstEmptySlotInSparseArray(newBranchRules);
				newBranchRules[spot] = rule;
			}

			branch.subrules = newBranchRules;
		}
	}

	relabelTree(tree);
	
	return tree;
}

//Returns all rules whose existance is proven by the existance of ruleNum.
const getRequiredRuleNums = function(ruleNum) {
	const required = [ruleNum];
	const tier = getTier(ruleNum);
	
	if (tier === 1) {
		// For main rules like "202", need section start and all preceding rules in section
		const num = parseInt(ruleNum);
		const section = Math.floor(num / 100);
		const sectionStart = section * 100;
		
		// Add all rules from section start up to (but not including) this rule
		for (let i = sectionStart; i < num; i++) {
			required.push(i.toString());
		}
	} else if (tier === 2) {
		// For subrules like "202.3", need parent and all preceding subrules
		const parts = ruleNum.split('.');
		const mainRule = parts[0];
		const subNum = parseInt(parts[1]);
		
		// First get all requirements for the parent
		required.push(...getRequiredRuleNums(mainRule));
		required.push(mainRule); // Add the parent itself
		
		// Add all preceding subrules
		for (let i = 1; i < subNum; i++) {
			required.push(`${mainRule}.${i}`);
		}
	} else if (tier === 3) {
		// For lettered rules like "202.3b", need parent and all preceding letters
		const letter = ruleNum.slice(-1);
		const baseRule = ruleNum.substring(0, ruleNum.length - 1);
		const letterIndex = alphabet.indexOf(letter);
		
		// First get all requirements for the parent
		required.push(...getRequiredRuleNums(baseRule));
		required.push(baseRule); // Add the parent itself
		
		// Add all preceding lettered rules
		for (let i = 0; i < letterIndex; i++) {
			required.push(`${baseRule}${alphabet[i]}`);
		}
	}
	
	// Sort rules by tier, then within each tier
	const rulesByTier = {};
	for (const rule of required) {
		const ruleTier = getTier(rule);
		if (!rulesByTier[ruleTier]) rulesByTier[ruleTier] = [];
		rulesByTier[ruleTier].push(rule);
	}
	
	const sortedRequired = [];
	for (let tier = 1; tier <= 3; tier++) {
		if (rulesByTier[tier]) {
			sortRules(rulesByTier[tier]);
			sortedRequired.push(...rulesByTier[tier]);
		}
	}
	
	return sortedRequired;
}

//allruleNums only contains the rules in the new CR, not the old one, so we have to reconstruct what rules used to exist and don't anymore.
const constructMappingFunc = function(removed, added, moved, allRuleNums) {
	let expandedAllRuleNums = new Set(allRuleNums);

	//First we get any rules that we know for sure existed because a removed or moved-away rule would have required them in order to exist.
	for (let ruleNum of removed) {
		for (let r of getRequiredRuleNums(ruleNum)) {
			expandedAllRuleNums.add(r);
		}
	}
	for (let ruleData of moved) {
		for (let r of getRequiredRuleNums(ruleData.from)) {
			expandedAllRuleNums.add(r);
		}
	}

	let mapping = {};
	for (let ruleNum of removed) {
		mapping[ruleNum] = null;
	}

	const tree = getFinalTree(removed, added, moved, Array.from(expandedAllRuleNums));
	const assignMapping = function(rule) {
		if (rule.originalRuleNum) {
			mapping[rule.originalRuleNum] = rule.newRuleNum;
		}
	}
	crawlEachRule(tree, assignMapping);

	//Some old rules may not be in the tree because a preceding rule in the branch was removed, a new section was added, etc. We have no way to determine this just from the changes, so we have to wait until one is passed in and dynamically recreate where it should be mapped to.
	const mappingFunc = function(ruleNum) {
		if (!mapping[ruleNum]) {
			let lastRequiredRule = null;
			for (let r of getRequiredRuleNums(ruleNum)) {

				if (mapping[r]) {
					lastRequiredRule = r;
					continue;
				}

				if (lastRequiredRule === getParent(r)) {
					mapping[r] = getFirstChildRuleNum(mapping[lastRequiredRule]);
				} else {
					mapping[r] = getNextRuleNumInBranch(mapping[lastRequiredRule]);
				}
				lastRequiredRule = r;
			}
		}

		return mapping[ruleNum];
	}

	return {
		"mapFunc": mappingFunc,
		"mapFull": mapping,
	}
}

const replaceString = function(string, mapFunc) {
	return string.replaceAll(/\[(\d{3}(\.\d{1,3}([a-z])?)?)\]/g, (match, ruleNum) => {
		const result = mapFunc(ruleNum);
		if (!result) {throw new Error(`No mapping for rule ${ruleNum}`);}
		return `[${result}]`;
	});
}

const bulkUpdateCitations = async function(removed, added, moved, db, allRuleNums) {
	const {mapFunc, mapFull} = constructMappingFunc(removed, added, moved, allRuleNums);

	const promisifiedAll = util.promisify(db.all);
	const promisifiedRun = util.promisify(db.run);
	const dbAll = async function(arg1, arg2) {
		const result = await promisifiedAll.call(db, arg1, arg2);
		return result;
	};
	const dbRun = async function(arg1, arg2) {
		const result = await promisifiedRun.call(db, arg1, arg2);
		return result;
	};

	const result = await dbAll(`SELECT json FROM questions`);

	result.forEach(function(currentValue, index) {
		result[index] = JSON.parse(currentValue.json);
	});

	const returnObj = {
		"updatedQuestionIds": [],
		"questionIdsCitingRemovedRules": [],
		"updatedRules": {},
	};

	for (let i in result) {
		const oldQuestion = result[i].question;
		const oldAnswer = result[i].answer;
		result[i].question = replaceString(result[i].question, mapFunc);
		result[i].answer = replaceString(result[i].answer, mapFunc);
		if (oldQuestion !== result[i].question || oldAnswer !== result[i].answer) {
			returnObj.updatedQuestionIds.push(result[i].id);
		}
		if (result[i].question.includes("removed]") || result[i].answer.includes("removed]")) {
			returnObj.questionIdsCitingRemovedRules.push(result[i].id);
			throw new Error(`Question ${result[i].id} cites a removed rule.`);
		}
	}

	for (let ruleNum in mapFull) {
		if (ruleNum === mapFull[ruleNum]) {
			delete mapFull[ruleNum];
		}
	}
	returnObj.updatedRules = mapFull;


	for (let i in result) {
		if (returnObj.updatedQuestionIds.includes(result[i].id)) {
			await dbRun(`UPDATE questions SET json = '${JSON.stringify(result[i]).replace(/'/g,"''")}' WHERE id = ${result[i].id}`);
		}
	}

	return returnObj;
};

module.exports = bulkUpdateCitations;
