"use strict";

document.querySelector("body").insertAdjacentHTML("beforeend", `
	<image id="settingsButton" class="bannerElement bannerLeft doNotCloseSidebarOnClick bannerImage" src="/globalResources/icons/settings.png">

	<div id="sidebar" class="doNotCloseSidebarOnClick">
		<br>
		<div id="sidebarLevel">
			<h4 tooltip="The amount and specificity of rules knowledge that's required.<br><br><b>1:</b> Questions about common interactions that could often occur in a tournament.<br><br><b>2:</b> Slightly rarer interactions that could still reasonably occur in tournament games.<br><br><b>3:</b> Significantly rarer interaction that rarely, if ever, come up in real games.<br><br><b>Corner Case:</b> Only the most knowledgeable rules gurus will know the answers to these questions.<br><br>An easy way to understand the difference between &quotlevel&quot and &quotcomplexity&quot is that &quotlevel&quot is the difficulty of finding an answer to the question, while &quotcomplexity&quot is the difficulty of understanding what's being asked in the first place.">Level:</h4>
			<label><input type="checkbox">1</label>
			<label><input type="checkbox">2</label>
			<label><input type="checkbox">3</label>
			<label><input type="checkbox">Corner Case</label>
		</div>
		<br>
		<div id="sidebarComplexity">
			<h4 tooltip="The number of different cards and interactions that must be kept track of.<br><br><b>Simple:</b> Straightforward questions about a specific interaction involving just a few cards.<br><br><b>Intermediate:</b> Questions about an interaction that requires many different cards, or questions that are more about keeping track of multiple objects than about a rules interaction.<br><br><b>Complicated:</b> Very intricate questions that involve a large number of objects or interactions.<br><br>An easy way to understand the difference between &quotlevel&quot and &quotcomplexity&quot is that &quotlevel&quot is the difficulty of finding an answer to the question, while &quotcomplexity&quot is the difficulty of understanding what's being asked in the first place.">Complexity:</h4>
			<label><input type="checkbox">Simple</label>
			<label><input type="checkbox">Intermediate</label>
			<label><input type="checkbox">Complicated</label>
		</div>
		<br>
		<label>
			<h4 tooltip="Format legality of the cards involved. Use "choose expansions" if you want to restrict questions to specific sets.">Legality:</h4>
			<select id="sidebarLegalityDropdown" onchange="toggleSidebarExpansionList();">
				<option value="Standard">Standard</option>
				<option value="Pioneer">Pioneer</option>
				<option value="Modern" selected>Modern</option>
				<option value="All of Magic">All of Magic</option>
				<option value="Choose Expansions">Choose Expansions</option>
			</select>
		</label>
		<label id="sidebarExpansionListLabel">Any of:
			<input id="sidebarExpansionInput" list="sidebarExpansionDatalist" onkeypress="if (event.keyCode === 13) {addSidebarExpansion(this.value);}">
			<datalist id="sidebarExpansionDatalist"></datalist>
		</label>
		<ul id="selectedSidebarExpansionList"></ul>
		<br>
		<div id="sidebarPlayabilityHide">
			<label>
				<h4 tooltip="If this box is checked, questions will be restricted to cards that see competitive play in the chosen format.">Playable Only:</h4>
				<input type="checkbox" id="sidebarPlayability">
			</label>
			<br>
		</div>
		<div>
			<label>
				<h4 tooltip="General topics the question pertains to.">Tags:</h4>
				<input list="tagsDatalist" id="sidebarTagInput" onkeypress="if (event.keyCode === 13) {addSidebarTag(this.value);}">
				<datalist id="tagsDatalist"></datalist>
			</label>
			<ul id="selectedTagsList"></ul>
			<label class="radioLabel"><input type="radio" name="tagsConjunc">AND</label>
			<label class="radioLabel"><input type="radio" name="tagsConjunc" checked>OR</label>
			<label class="radioLabel"><input type="radio" name="tagsConjunc">NOT</label>
		</div>
		<br>
		<div>
			<label id="rules">
				<h4 tooltip="Rules that are cited in the question or answer.<br><br>Put a period after the rule number if you don't want to match child rules. For example, selecting &quot100.6&quot can find a question that cites rule 100.6b, but selecting &quot407.4.&quot matches only that exact rule.">Rules:</h4>
				<input id="sidebarRuleInput" onkeypress="if (event.keyCode === 13) {addSidebarRule(this.value);}">
			</label>
			<ul id="selectedRulesList"></ul>
			<label class="radioLabel"><input type="radio" name="rulesConjunc">AND</label>
			<label class="radioLabel"><input type="radio" name="rulesConjunc" checked>OR</label>
			<label class="radioLabel"><input type="radio" name="rulesConjunc">NOT</label>
		</div>
		<br>
		<div>
			<label id="cardNames">
				<h4 tooltip="Cards that must be involved in the question.">Cards:</h4>
				<input id="sidebarCardInput" list="allCardsDatalist" onkeypress="if (event.keyCode === 13) {addSidebarCard(this.value);}">
			</label>
			<ul id="selectedCardsList"></ul>
			<label class="radioLabel"><input type="radio" name="cardsConjunc">AND</label>
			<label class="radioLabel"><input type="radio" name="cardsConjunc" checked>OR</label>
			<label class="radioLabel"><input type="radio" name="cardsConjunc">NOT</label>
		</div>
		<br>
		<div id="sidebarExtras">
			<label>
				<h4 tooltip="The default way that cards should be displayed on the page. You can click on a card to switch back and forth.">Card display:</h4>
				<select id="cardDisplayFormat">
					<option value="Image" selected>Image</option>
					<option value="Text">Text</option>
					<option value="None">None</option>
				</select>
			</label>
			<br>
			<button class="sidebarButton" id="sidebarViewQuestion">View Question</button>
			<button class="sidebarButton" id="sidebarShowQuestionsList">Show All</button>
			<br><br>
		</div>
		<div>
			<h4 tooltip="The URL below is a link to your currently seleted search options. Paste it into a browser address bar in order to see a random question that matches these search criteria. Any additional questions viewed from this link will also match those criteria until the user changes their search options.">Link to these search criteria:</h4>
			<input id="searchLink" onclick="this.select()"></input>
		</div>
	</div>
`);

const baseConvert = function(string, inputAlphabet, outputAlphabet) {
	if (string == "" || inputAlphabet == "" || outputAlphabet == "") {
		return "";
	}
	const add = (x, y, base) => {
		let z = [];
		const n = Math.max(x.length, y.length);
		let carry = 0;
		let i = 0;
		while (i < n || carry) {
			const xi = i < x.length ? x[i] : 0;
			const yi = i < y.length ? y[i] : 0;
			const zi = carry + xi + yi;
			z.push(zi % base);
			carry = Math.floor(zi / base);
			i++;
		}
		return z;
	}
	const multiplyByNumber = (num, power, base) => {
		if (num < 0) return null;
		if (num == 0) return [];
		let result = [];
		while (true) {
			num & 1 && (result = add(result, power, base));
			num = num >> 1;
			if (num === 0) break;
			power = add(power, power, base);
		}
		return result;
	}
	// decodeInput finds the position of each character in alphabet, thus
	// decoding the input string into a useful array.
	const decodeInput = (string) => {
		const digits = string.split('');
		let arr = [];
		for (let i = digits.length - 1; i >= 0; i--) {
			const n = inputAlphabet.indexOf(digits[i])
			// Continue even if character is not found (possibly a padding character.)
			// if (n == -1) return null;
			if (n == -1) continue;
			arr.push(n);
		}
		return arr;
	}
	const fromBase = inputAlphabet.length;
	const toBase = outputAlphabet.length;
	const digits = decodeInput(string);
	if (digits === null) return null;
	// Get an array of what each position of character should be.
	let outArray = [];
	let power = [1];
	for (let i = 0; i < digits.length; i++) {
		outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
		power = multiplyByNumber(fromBase, power, toBase);
	}
	// Finally, decode array into characters.
	let out = '';
	for (let i = outArray.length - 1; i >= 0; i--) {
		out += outputAlphabet[outArray[i]];
	}
	if (out === "") {
		return "0";
	} else {
		return out;
	}
}

let	sidebarOpen = false,
		oldSettings = JSON.parse(localStorage.getItem("sidebarSettings")),
		defaultSettings = {
			"level": ["1", "2"],
			"complexity": ["Simple", "Intermediate"],
			"legality": "Modern",
			"expansions": [],
			"playableOnly": false,
			"tags": [],
			"tagsConjunc": "OR",
			"rules": [],
			"rulesConjunc": "OR",
			"cards": [],
			"cardsConjunc": "OR",
			"cardDisplayFormat": "Image"
		};

let oldSettingsValid = true;

if (!oldSettings || oldSettings.length !== defaultSettings.length) {
	oldSettingsValid = false;
} else {
	const oldSettingsKeys = Object.keys(oldSettings);
	const defaultSettingsKeys = Object.keys(defaultSettings);
	for (let i of oldSettingsKeys) {
		if (!defaultSettingsKeys.includes(i)) {
			oldSettingsValid = false;
		}
	}
}
let sidebarSettings;
if (oldSettingsValid) {
	sidebarSettings = oldSettings;
} else {
	sidebarSettings = defaultSettings;
}
//Temporary conversion for update.
if (sidebarSettings.legality === "Choose expansions") {
	sidebarSettings.legality = "Choose Expansions";
}

//Open and close sidebar.
const toggleSidebar = function() {
	if (sidebarOpen) {
		closeSidebar();
		sidebarOpen = false;
	} else {
		document.getElementById('sidebar').style.transform = 'translate(0)';
		document.getElementById('pageContent').style.transform = 'translate(14.3rem)';
		sidebarOpen = true;
	}
}

const isDeepEqual = function(obj1, obj2) {
	//Loop through properties in object 1
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!isDeepEqual(obj1[p], obj2[p])) return false;
				break;
			//Compare function code
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}
	//Check object 2 for any extra properties
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
};

const closeSidebarOnClick = function(event) {
	if (sidebarOpen && !hasParentWithClass(event.target, "doNotCloseSidebarOnClick")) {
		closeSidebar();
	}
}

document.addEventListener("mouseup", function(event) {
	closeSidebarOnClick(event);
}, true);

document.addEventListener("touchend", function(event) {
	closeSidebarOnClick(event);
}, true);

//Handle legality selection in the sidebar.
let allExpansions = [];
for (let i in allSets) {
	allExpansions.push(allSets[i].name);
}
let expansionOptions = "";
for (let i in allExpansions) {
	expansionOptions += "<option value=\"" + allExpansions[i] + "\" />";
}
document.getElementById("sidebarExpansionDatalist").innerHTML = expansionOptions;
let currentSidebarExpansions = [];
let addSidebarExpansion = function(expansion) {
	if (allExpansions.includes(expansion) && !currentSidebarExpansions.includes(expansion)) {
		let newExpansion = document.createElement("li");
		newExpansion.setAttribute("onclick", "currentSidebarExpansions.splice(currentSidebarExpansions.indexOf(this.textContent),1);this.parentElement.removeChild(this);event.stopPropagation();");
		newExpansion.appendChild(document.createTextNode(expansion));
		document.getElementById("selectedSidebarExpansionList").appendChild(newExpansion);
		document.getElementById("sidebarExpansionInput").value = "";
		currentSidebarExpansions.push(expansion);
	}
};

const toggleSidebarExpansionList = function() {
	if (document.getElementById("sidebarLegalityDropdown").value === "Choose Expansions") {
		document.getElementById("sidebarExpansionListLabel").style.display = "block";
		document.getElementById("selectedSidebarExpansionList").style.display = "block";
	} else {
		document.getElementById("sidebarExpansionListLabel").style.display = "none";
		document.getElementById("selectedSidebarExpansionList").style.display = "none";
	}
};

//Populate sidebar tags dropdown.
allTags;
allTags.sort();
const populateSidebarTagsDropdown = function() {
	let tagOptions = "";
	for (let i in allTags) {
		tagOptions += "<option value=\"" + allTags[i].replace(/"/g, "&quot;") + "\" />";
	}
	document.getElementById("tagsDatalist").innerHTML = tagOptions;
}
populateSidebarTagsDropdown();
//Handle tag selection in the sidebar.
let currentSidebarTags = [];
let addSidebarTag = function(tag) {
	if (allTags.includes(tag) && !currentSidebarTags.includes(tag)) {
		let newTag = document.createElement("li");
		newTag.setAttribute("onclick", "currentSidebarTags.splice(currentSidebarTags.indexOf(this.textContent),1);this.parentElement.removeChild(this);event.stopPropagation();");
		newTag.appendChild(document.createTextNode(tag));
		document.getElementById("selectedTagsList").appendChild(newTag);
		document.getElementById("sidebarTagInput").value = "";
		currentSidebarTags.push(tag);
	}
};

//Close the sidebar and update the options.
const closeSidebar = function() {
	document.getElementById("sidebar").style.transform = "translate(-14.3rem)";
	document.getElementById('pageContent').style.transform = '';
	sidebarOpen = false;
	updateSidebarSettingsOnClose();
};

const updateSidebarSettings = function() {

	let newSidebarSettings = JSON.parse(JSON.stringify(sidebarSettings));

	newSidebarSettings.level = Array.from(document.querySelectorAll("#sidebarLevel input:checked"));
	newSidebarSettings.level.forEach(function(element,index,array){array[index] = element.parentNode.textContent;});
	newSidebarSettings.complexity = Array.from(document.querySelectorAll("#sidebarComplexity input:checked"));
	newSidebarSettings.complexity.forEach(function(element,index,array){array[index] = element.parentNode.textContent;});
	newSidebarSettings.legality = document.getElementById("sidebarLegalityDropdown").value;
	newSidebarSettings.expansions = JSON.parse(JSON.stringify(currentSidebarExpansions));
	newSidebarSettings.playableOnly = document.getElementById("sidebarPlayability").checked;
	newSidebarSettings.tags = Array.from(currentSidebarTags);
	newSidebarSettings.tagsConjunc = document.querySelector("input[name='tagsConjunc']:checked").parentNode.textContent;
	newSidebarSettings.rules = Array.from(currentSidebarRules);
	newSidebarSettings.rulesConjunc = document.querySelector("input[name='rulesConjunc']:checked").parentNode.textContent;
	newSidebarSettings.cardsConjunc = document.querySelector("input[name='cardsConjunc']:checked").parentNode.textContent;
	newSidebarSettings.cards = Array.from(currentSidebarCards);
	newSidebarSettings.cardDisplayFormat = document.getElementById("cardDisplayFormat").value;

	if (!isDeepEqual(newSidebarSettings, sidebarSettings)) {
		sidebarSettings = newSidebarSettings;
		localStorage.setItem("sidebarSettings", JSON.stringify(sidebarSettings));
		document.getElementById("searchLink").value = "https://rulesguru.net/?RG" + convertSettingsToSearchLink(sidebarSettings) + "GG";
		if (typeof doSomethingOnSidebarSettingsUpdate !== "undefined") {
			doSomethingOnSidebarSettingsUpdate();
		}
	}
};


document.getElementById("settingsButton").addEventListener("click", toggleSidebar);

//Handle people who don't press enter before closing the sidebar.
const updateSidebarSettingsOnClose = function() {
	addSidebarExpansion(document.getElementById("sidebarExpansionInput").value);
	addSidebarTag(document.getElementById("sidebarTagInput").value);
	addSidebarRule(document.getElementById("sidebarRuleInput").value);
	addSidebarCard(document.getElementById("sidebarCardInput").value);
}

//Update the sidebarSettings if the user closes the page without closing the sidebar.
window.onbeforeunload =	updateSidebarSettingsOnClose;

toggleSidebarExpansionList();

const togglePlayability = function() {
	if (["All of Magic", "Choose Expansions"].includes(document.getElementById("sidebarLegalityDropdown").value)) {
		document.getElementById("sidebarPlayabilityHide").style.display = "none";
	} else {
		document.getElementById("sidebarPlayabilityHide").style.display = "block";
	}
}
document.getElementById("sidebarLegalityDropdown").addEventListener("change", togglePlayability);
