//NOTE: officially, "protection from everything" is a variant, but I chose to leave it as argument

function parseRulesTextForKeywordAbilities(rulesText, keywords) {
	const numberKeywords = keywords.filter(
		keyword => keyword.actsAsNumber
	).map(
		keyword => keyword.keyword.toLowerCase()
	); //I'm assuming no variants do this
	let keywordsFound = [];
	const lines = rulesText.split(/(\r?\n|;)/); //we consider semicolons to act like line breaks
	lines: for (const line of lines) {
		let keywordsFoundOnLine = [];
		const segments = line.split(",");
		for (const segment of segments) {
			//we're going to check each segment to see if it's a keyword.
			//if it's *not* a keyword, we discard the entire line, since
			//no line ever contains both keyword and non-keyword segments.
			const { parse, wholeLine } = parseSegment(segment.trim(), line.trim(), keywords, numberKeywords);
			const parses = handleArrays(parse);
			if (parse !== null) {
				if (wholeLine) {
					//in this case, we throw out everything else we have, keep only this
					//parse, and then move on to the next line
					keywordsFoundOnLine = parses;
					break;
				} else {
					//normal case: found a keyword, continue to next segment
					keywordsFoundOnLine = keywordsFoundOnLine.concat(parses);
				}
			} else {
				//keyword and non-keyword abilities are never mixed on a line.
				//if we see a non-keyword ability, this isn't a keyword line.
				//toss it out and move onto the next one.
				continue lines;
			}
		}
		//if we made it here, append what we have!
		keywordsFound = keywordsFound.concat(keywordsFoundOnLine);
	}
	return keywordsFound;
}

function handleArrays(parse) {
	if (!parse) return null;
	let { keyword, variant: variants, argument: args, cost: costs } = parse;
	if (!Array.isArray(variants)) variants = [variants]; //note: right now this will never be an array, but...
	if (!Array.isArray(args)) args = [args];
	if (!Array.isArray(costs)) costs = [costs];
	//(also right now only at most one will be an array, but let's be general)
	const parses = [].concat(...variants.map(variant =>
		[].concat(...args.map(argument =>
			costs.map(cost => ({ keyword, variant, argument, cost }))
		))
	));
	return parses;
}

function parseSegment(segment, line, keywords, numberKeywords) {
	for (const keyword of keywords) {
		let { parse, wholeLine } = parseTextAsKeyword(segment, keyword, numberKeywords);
		if (wholeLine) {
			const { parse: wholeLineParse } = parseTextAsKeyword(line, keyword, numberKeywords);
			if (wholeLineParse !== null) {
				parse = wholeLineParse;
			} else {
				//if the whole line parse didn't work, make sure to report this as
				//a segment parse, not a whole line parse
				wholeLine = false;
			}
		}
		if (parse !== null) {
			return { parse, wholeLine };
		}
	}
	return { parse: null, wholeLine: false };
}

function parseTextAsKeyword(text, keyword, numberKeywords) {
	//the thing is, keywords may have variants.  so we better check all the variants.
	//put keyword last, check variants before it (they often have longer keyword text)
	const variants = keyword.variants ? [...keyword.variants, keyword] : [keyword];
	let wholeLine = Boolean(keyword.fromMultiple) || keyword.allowsCommas;
	for (const variant of variants) {
		const { parse, wholeLine: variantWholeLine } = parseTextAsKeywordOrVariant(text, variant, numberKeywords);
		wholeLine ||= variantWholeLine;
		if (parse !== null) {
			if (variant.keyword !== keyword.keyword) {
				//if it was a variant, we need to appropriately transform it before
				//returning it.
				return {
					parse: {
						...parse,
						variant: parse.keyword,
						keyword: keyword.keyword
					},
					wholeLine
				};
			} else {
				return { parse, wholeLine };
			}
		}
	}
	return { parse: null, wholeLine };
}

function parseTextAsKeywordOrVariant(text, variant, numberKeywords) {
	const keywordText = variant.keywordText || variant.keyword;
	const wholeLineFromVariant = Boolean(variant.fromMultiple) || variant.allowsCommas;
	if (Array.isArray(keywordText)) {
		//if the keyword text is an array, meaning multiple possibilities,
		//we'll have to try each one. I don't want to write a separate function
		//for that, we'll just call this one again.
		for (const possibility of keywordText) {
			const { parse, wholeLine } = parseTextAsKeywordOrVariant(
				text,
				{ ...variant, keywordText: possibility },
				numberKeywords
			);
			if (parse !== null) return { parse, wholeLine };
		}
		return { parse: null, wholeLine: wholeLineFromVariant };
	}
	//now: does it match the keyword/variant?
	//depends on the case.
	const type = variant.variantType || variant.argumentType;
	const requiredness = variant.variantType ? variant.variant : variant.argument;
	switch (type) {
		case "prefix": {
			const index = text.toLowerCase().indexOf(keywordText.toLowerCase());
			if (index !== -1) {
				const argument = text.slice(0, index) || null;
				if (argument === null && requiredness === "required") {
					return { parse: null, wholeLine: wholeLineFromVariant };
				}
				const rest = text.slice(index + keywordText.length).trim();
				const isActuallyVariant = variant.variantType === "prefix"; //as opposed to argument
				const { parse, wholeLine } = parseRestExcludingPrefix(rest, variant, numberKeywords, isActuallyVariant);
				if (parse === null) return { parse: null, wholeLine: wholeLine || wholeLineFromVariant };
				if (variant.variantType) {
					return {
						parse: {
							...parse,
							variant: argument
						},
						wholeLine: wholeLine || wholeLineFromVariant
					};
				} else {
					return {
						parse: {
							...parse,
							argument
						},
						wholeLine: wholeLine || wholeLineFromVariant
					};
				}
			} else {
				return { parse: null, wholeLine: wholeLineFromVariant };
			}
		}
		case "before": {
			//OK I guess this one's also a little annoying
			//note: we assume no regex-significant characters in the keyword text.
			//don't want to have to deal with escaping.
			const match = text.match(new RegExp(`(.*)\\b${keywordText}(.*)`, "i"));
			if (match) {
				const argument = match[1].trim() || null;
				if (argument === null && requiredness === "required") {
					return { parse: null, wholeLine: wholeLineFromVariant };
				}
				const rest = match[2].trim();
				//yes I copypasted some code here
				const isActuallyVariant = variant.variantType === "before"; //as opposed to argument
				const { parse, wholeLine } = parseRestExcludingPrefix(rest, variant, numberKeywords, isActuallyVariant);
				if (parse === null) return { parse: null, wholeLine: wholeLine || wholeLineFromVariant };
				if (variant.variantType) {
					return {
						parse: {
							...parse,
							variant: argument
						},
						wholeLine: wholeLine || wholeLineFromVariant
					};
				} else {
					return {
						parse: {
							...parse,
							argument
						},
						wholeLine: wholeLine || wholeLineFromVariant
					};
				}
			} else {
				if (text.trim().toLowerCase() === keywordText.toLowerCase() && requiredness === "optional") {
					return {
						parse: {
							keyword: variant.keyword
						},
						wholeLine: wholeLineFromVariant
					};
				} else {
					return { parse: null, wholeLine: wholeLineFromVariant };
				}
			}
		}
		default: {
			const match = text.match(new RegExp(`^${keywordText}(\\b|\\s|$)(.*)`, "i"))
			if (match) {
				const rest = match[2].trim();
				return parseRest(rest, variant, numberKeywords);
			} else {
				return { parse: null, wholeLine: wholeLineFromVariant };
			}
		}
	}
	//can't make it here, no need to do anything
}

function parseRestExcludingPrefix(rest, keyword, numberKeywords, isActuallyVariant) {
	if (!isActuallyVariant) {
		//usual case
		return parseRest(
			rest,
			{
				...keyword,
				//null out the argument that we've already processed
				argument: undefined,
				argumentType: undefined
			},
			numberKeywords
		);
	} else {
		//this case is currently unused
		return parseRest(
			rest,
			{
				...keyword,
				//null out the variant that we've already processed
				variant: undefined,
				variantType: undefined
			},
			numberKeywords
		);
	}
}

function parseRest(rest, keyword, numberKeywords) {
	const wholeLineFromKeyword = Boolean(keyword.fromMultiple) || keyword.allowsCommas;
	if (!keyword.variant) {
		//if there's no variant, we can skip straight to the argument and cost
		return parseArgumentAndCost(rest, keyword, numberKeywords);
	}
	if (keyword.variantType === "dashed") {
		//in this case, there can *only* be a variant. nothing else.
		if (rest.startsWith("—")) {
			const variant = rest.slice(1).trim();
			if (variant !== "") {
				return {
					parse: {
						keyword: keyword.keyword,
						variant
					},
					wholeLine: true
				};
			} else {
				return { parse: null, wholeLine: true };
			}
		} else {
			if (rest === "" && keyword.variant === "optional") {
				return {
					parse: {
						keyword: keyword.keyword
					},
					wholeLine: true
				};
			} else {
				return { parse: null, wholeLine: true };
			}
		}
	} else if (keyword.argument) {
		//in this case, we need to start by performing a split.
		//note that in this case, the argument (if present) *must* have a type other
		//than normal (so, dashed or numeric). this is what makes the split possible
		const { variant, argument: argumentText, wholeLine: wholeLineFromSplit } = splitByArgumentType(
			rest,
			keyword.argumentType,
			numberKeywords,
			Boolean(keyword.cost) //allow lonely X only when there's a cost
		);
		const { parse: recursiveParse, wholeLine: wholeLineFromRecursion } = parseArgumentAndCost(argumentText || "", keyword, numberKeywords);
		const wholeLine = wholeLineFromSplit || wholeLineFromRecursion || wholeLineFromKeyword;
		if (variant === "" && keyword.variant === "required") {
			return { parse: null, wholeLine };
		}
		if (recursiveParse === null) {
			return { parse: null, wholeLine };
		}
		return {
			parse: {
				...recursiveParse,
				variant: variant || null,
			},
			wholeLine
		};
	} else {
		//parse it like it's argument-cost, but modify appropriately
		const { parse: recursiveParse, wholeLine } = parseArgumentAndCost(
			rest,
			{
				...keyword,
				argument: keyword.variant,
				argumentType: keyword.variantType
			},
			numberKeywords
		);
		if (recursiveParse === null) {
			return { parse: null, wholeLine: wholeLine || wholeLineFromKeyword };
		}
		return {
			parse: {
				...recursiveParse,
				variant: recursiveParse.argument,
				argument: undefined
			},
			wholeLine: wholeLine || wholeLineFromKeyword
		};
	}
}

function parseArgumentAndCost(rest, keyword, numberKeywords) {
	const wholeLineFromKeyword = Boolean(keyword.fromMultiple) || keyword.allowsCommas;
	if (!keyword.argument) {
		//if there's no argument, just handle cost
		if (keyword.cost) {
			const { cost, wholeLine } = checkCost(rest, keyword.costMultiple, false);
			if (cost === null && (keyword.cost === "required" || rest !== "")) {
				return { parse: null, wholeLine: wholeLine || wholeLineFromKeyword }
			}
			return {
				parse: {
					keyword: keyword.keyword,
					cost
				},
				wholeLine //can leave this as-is; no argument, just cost, and we found it, so nothing to worry about
			};
		} else if (rest === "") {
			return {
				parse: {
					keyword: keyword.keyword
				},
				wholeLine: wholeLineFromKeyword
			};
		} else {
			//no keyword, no cost, but there's something left over? uh-oh
			return { parse: null, wholeLine: wholeLineFromKeyword };
		}
	} else if (keyword.reverseOrder) {
		//reverseOrder reverses the order of argument and cost. so cost, then dash, then argument
		const { variant: cost, argument, wholeLine } = splitOnDash(rest);
		//check that cost looks like a cost -- we won't use checkCost here as it's not the right mechanism;
		//this needs to be a mana cost
		if (
			(argument === null && keyword.argument === "required") ||
			(cost === null && keyword.cost === "required")
		) {
			return { parse: null, wholeLine: wholeLine || wholeLineFromKeyword };
		}
		if (!isManaCost(cost)) {
			return { parse: null, wholeLine: wholeLine || wholeLineFromKeyword };
		}
		return {
			parse: {
				keyword: keyword.keyword,
				argument,
				cost
			},
			wholeLine: wholeLine || wholeLineFromKeyword
		};
	} else if (keyword.argumentType === "dashed") {
		//in this case, there can *only* be a argument. nothing else.
		if (rest.startsWith("—")) {
			const argument = rest.slice(1).trim();
			if (argument !== "") {
				return {
					parse: {
						keyword: keyword.keyword,
						argument
					},
					wholeLine: true
				};
			} else {
				return { parse: null, wholeLine: true };
			}
		} else {
			if (rest === "" && keyword.argument === "optional") {
				return {
					parse: {
						keyword: keyword.keyword
					},
					wholeLine: true
				};
			} else {
				return { parse: null, wholeLine: true };
			}
		}
	} else if (keyword.cost) {
		//also start with a split
		//note: if argument is numeric, the cost should use a dash
		let argumentText, cost, wholeLineFromCost;
		if (keyword.argumentType === "numeric") {
			//yeah we gotta jigger things around some
			({ variant: argumentText, argument: cost, wholeLine: wholeLineFromCost } = splitOnDash(rest));
		} else {
			({
				argument: argumentText,
				cost,
				costText,
				wholeLine: wholeLineFromCost
			} = splitOnCostStart(rest, keyword.costMultiple, true)); //allow an X restriction
		}
		const { argument, wholeLine: wholeLineFromArgument } = checkType(argumentText, keyword.argumentType, numberKeywords, true); //allow X since there's a cost
		const wholeLine = wholeLineFromCost || wholeLineFromArgument || wholeLineFromKeyword;
		//check: if X is present, make sure it's in a way that makes sense
		//(note that "X, where..." doesn't have these requirements)
		if (argument === "X" !== Boolean((cost || "").match(/\bX\b/))) {
			return { parse: null, wholeLine };
		}
		//I wanted to have an additional check here, that if "X can't be 0" appears, that
		//X also appears elsewhere in the cost, but hell with it.  it's too much of a pain
		if (
			((keyword.argument === "required" || argumentText !== "") && argument === null) ||
			((keyword.cost === "required" || costText !== "") && cost === null)
		) {
			return { parse: null, wholeLine };
		}
		return {
			parse: {
				keyword: keyword.keyword,
				argument,
				cost
			},
			wholeLine
		};
	} else if (keyword.fromMultiple) {
		//oh boy!
		const keywordText = keyword.keywordText || keyword.keyword; //remember: we assume this ends in keyword.fromMultiple
		const base = keywordText.slice(0,-keyword.fromMultiple.length).trim();
		const preposition = keyword.fromMultiple;
		let args = [];
		//note that at this point, rest contains everything *after* the preposition
		let match;
		match = rest.match(new RegExp(
			`^([^,]+),\\s+${preposition}\\s+([^,]+),\\s+and\\s+${preposition}\\s+([^,]+)$`,
			"i"
		));
		if (match) {
			//three
			args = [match[1], match[2], match[3]]
		} else {
			match = rest.match(new RegExp(`^([^,]+)\\s+and\\s+${preposition}\\s+([^,]+)$`, "i"));
			if (match) {
				//two
				args = [match[1], match[2]]
			} else {
				if (rest.length > 0) { //may (unfortunately) contain commas! see Nevinyrral e.g.
					//one
					args = [rest];
				}
			}
		}
		if (args.length === 0) {
			return { parse: null, wholeLine: true };
		}
		//we've extracted the raw possibilities, but now we need to perform "each color" expansion
		const index = args.indexOf("each color");
		if (index !== -1) {
			const colors = ["white", "blue", "black", "red", "green"];
			args.splice(index, 1, ...colors);
		}
		return {
			parse: {
				keyword: keyword.keyword,
				argument: args
			},
			wholeLine: true
		};
	} else {
		//in this case just do a check
		const { argument, wholeLine } = checkType(rest, keyword.argumentType, numberKeywords, false);
		if (argument === null && (keyword.argument === "required" || rest !== "")) {
			return { parse: null, wholeLine: wholeLine || wholeLineFromKeyword };
		}
		return {
			parse: {
				keyword: keyword.keyword,
				argument
			},
			wholeLine: wholeLine || wholeLineFromKeyword
		};
	}
}

function checkCost(text, allowMultiple, allowXRestriction) {
	//does this look basically like a cost?
	if (allowMultiple) {
		const costs = parseMultipleCosts(text);
		if (costs) {
			return { cost: costs, wholeLine: false };
		}
	}
	if (isManaCost(text, allowXRestriction)) return { cost: text, wholeLine: false };
	if (text.startsWith("—")) {
		const cost = text.slice(1).trim() || null;
		return { cost, wholeLine: true };
	}
	return { cost: null, wholeLine: false };
}

function isManaCost(text, allowXRestriction) {
	//does this look basically like a mana cost? but allow or'ing some
	if (!allowXRestriction) {
		return Boolean(text.match(/^(\{[a-zA-Z0-9\/]+\})+(\s+or\s+(\{[a-zA-Z0-9\/]+\})+)?$/));
	} else {
		return Boolean(text.match(/^(\{[a-zA-Z0-9\/]+\})+(\s+or\s+(\{[a-zA-Z0-9\/]+\})+)?(\.\s+X\s+.*)?$/));
	}
}

function isDirectManaCost(text) {
	//does this look basically like a mana cost?
	return Boolean(text.match(/^(\{[a-zA-Z0-9\/]+\})+$/));
}

function parseMultipleCosts(text) {
	const match = text.match(/^((\{[a-zA-Z0-9\/]+\})+)\s+and\/or\s+((\{[a-zA-Z0-9\/]+\})+)$/);
	if (match) {
		return [match[1], match[3]];
	} else {
		return null;
	}
}

function checkType(text, type, numberKeywords, allowLonelyX) { //NOTE: returns argument even though may be variant
	switch(type) {
		//we assume it's not "prefix" or "before" as those are handled above
		case undefined:
			if (text.startsWith("—")) {
				//this shouldn't happen
				return { argument: null, wholeLine: false };
			} else if (text === "") {
				return { argument: null, wholeLine: false };
			} else {
				return { argument: text, wholeLine: false };
			}
		case "numeric":
			if (text.match(/^[0-9]+$/)) {
				//note: I'm assuming we don't have to deal with commas in numbers like
				//on The Millennium Calendar
				return { argument: text, wholeLine: false };
			} else if (text.startsWith("X, where X is")) {
				return { argument: text, wholeLine: true };
			} else if (text === "X") {
				//if we've got an X, uh-oh, we may need the whole line!
				//(where's the comma? not in this segment!)
				//...except in some cases we allow it anyway, if allowLonelyX is set...
				return { argument: allowLonelyX ? text : null, wholeLine: true };
			} else if (text.startsWith("—")) {
				const argument = text.slice(1).trim().toLowerCase();
				if (numberKeywords.includes(argument)) {
					return { argument, wholeLine: false };
				} else {
					return { argument: null, wholeLine: false };
				}
			} else {
				return { argument: null, wholeLine: false };
			}
		case "dashed":
			if (text.startsWith("—")) {
				const argument = text.slice(1).trim() || null;
				return { argument, wholeLine: true };
			} else {
				return { argument: null, wholeLine: false };
			}
	}
}

function splitOnCostStart(text, allowMultiple, allowXRestriction) {
	let braceIndex = text.indexOf("{");
	if (braceIndex === -1) braceIndex = Infinity;
	let dashIndex = text.indexOf("—");
	if (dashIndex === -1) dashIndex = Infinity;
	const index = Math.min(braceIndex, dashIndex);
	if (index !== Infinity) {
		const costText = text.slice(index);
		const argument = text.slice(0, index).trim(); //note: depending on context this could be a variant
		const { cost, wholeLine } = checkCost(costText, allowMultiple, allowXRestriction);
		return { argument, cost, costText, wholeLine };
	}
	//otherwise, both are infinity
	return { argument: text, cost: null, costText: "", wholeLine: false };
}

function splitByArgumentType(text, type, numberKeywords, allowLonelyX) {
	switch(type) {
		//note that case undefined should never occur!!
		case "numeric":
			return splitOnNumericStart(text, numberKeywords, allowLonelyX);
		case "dashed":
			return splitOnDash(text);
	}
}

function splitOnNumericStart(text, numberKeywords, allowLonelyX) {
	const numMatch = text.match(/\d/);
	const numIndex = numMatch ? numMatch.index : Infinity;
	let xIndex = text.indexOf("X, where X is");
	if (xIndex === -1) xIndex = Infinity;
	let bareXIndex = text.indexOf("X—");
	if (bareXIndex === -1) bareXIndex = text.endsWith("X") ? text.length - 1 : Infinity;
	let dashIndex = text.indexOf("—");
	if (dashIndex === -1) dashIndex = Infinity;
	const nonDashIndex = allowLonelyX
		? Math.min(numIndex, xIndex, bareXIndex)
		: Math.min(numIndex, xIndex);
	const index = Math.min(dashIndex, nonDashIndex);
	if (index === Infinity) {
		if (bareXIndex !== Infinity) {
			//note that this can only happen if allowLonelyX is false
			return { variant: text, argument: null, wholeLine: true };
		} else {
			return { variant: text, argument: null, wholeLine: false };
		}
	} else {
		if (dashIndex < nonDashIndex) {
			//in this case, we need to check whether it's followed
			//by a numeric keyword
			const argument = text.slice(dashIndex).trim(); //note: INCLUDE the dash! for later processing
			if (numberKeywords.includes(argument.slice(1).toLowerCase())) { //better remove it here though
				return {
					variant: text.slice(0, dashIndex).trim(),
					argument,
					wholeLine: false
				};
			}
		}
		//normal cases follow
		if (nonDashIndex === Infinity) {
			return { variant: text, argument: null, wholeLine: false };
		}
		return {
			variant: text.slice(0, nonDashIndex).trim(),
			argument: text.slice(nonDashIndex),
			wholeLine: index === bareXIndex
		};
	}
}

function splitOnDash(text) {
	const index = text.indexOf("—");
	if (index === -1) {
		return { variant: text, argument: null, wholeLine: false };
	}
	return {
		variant: text.slice(0, index).trim(),
		argument: text.slice(index+1).trim() || null, //don't include the dash
		wholeLine: true
	};
}

module.exports = {
	parse: parseRulesTextForKeywordAbilities
}
