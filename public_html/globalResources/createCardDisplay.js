//Add card picture and oracle text displays.
const createCardDisplay = function(cardData, defaultDisplayType) {
	if (!["image", "text"].includes(defaultDisplayType)) {
		throw new Error(`invalid defaultDisplayType "${defaultDisplayType}"`);
	}
	//The container for the images and text.
	let containerDiv = document.createElement("div");
	containerDiv.setAttribute("class", "cardDisplay");

	//A div to display the card image.
	let imageElement = document.createElement("img");

	//Display pictures correctly for various layouts.
	if (["transforming double-faced", "modal double-faced"].includes(cardData.layout) && cardData.side === "b") {
		imageElement.setAttribute("src",`https://api.scryfall.com/cards/named?format=image&version=normal&exact=${cardData.name}&face=back`);
	} else if (cardData.layout === "flip" && cardData.side === "b") {
		imageElement.setAttribute("src",`https://api.scryfall.com/cards/named?format=image&version=normal&exact=${cardData.name}`);
		imageElement.style.transform = "rotate(180deg)";
	} else if (cardData.layout === "split (half)") {
		imageElement.setAttribute("src",`https://api.scryfall.com/cards/named?format=image&version=normal&exact=${cardData.names[0] + " // " + cardData.names[1]}`);
	} else if (cardData.layout === "prototype" && cardData.name.includes(" (prototyped)")) {
		imageElement.setAttribute("src",`https://api.scryfall.com/cards/named?format=image&version=normal&exact=${cardData.name.replace(" (prototyped)", "")}`);
	} else {
		imageElement.setAttribute("src",`https://api.scryfall.com/cards/named?format=image&version=normal&exact=${cardData.name}`);
	}

	imageElement.setAttribute("class", "cardImage");
	imageElement.setAttribute("title", "Click for oracle text");
	imageElement.style.display = "none";
	imageElement.addEventListener("click", function() {
		this.parentNode.childNodes[0].style.visibility = "hidden";
		this.parentNode.childNodes[1].style.visibility = "";
	});
	imageElement.addEventListener("error", function() {
		this.parentNode.childNodes[0].style.visibility = "hidden";
	});
	imageElement.addEventListener("load", function() {
		this.parentNode.childNodes[0].style.display = "";
		if (this.parentNode.getAttribute("displayMode") === "image") {
			this.parentNode.childNodes[1].style.visibility = "hidden";
		}
	});

	//A div to contain the card text.
	const textElement = document.createElement("div");
	const name = document.createElement("p");
	const cost = document.createElement("div");
	const typeLine = document.createElement("div");
	const colorIndicator = document.createElement("img");
	const typeText = document.createElement("p");
	const text = document.createElement("p");
	const stats = document.createElement("p");

	name.textContent = cardData.name;
	//Break the mana cost if it's 8 or more symbols.
	if (cardData.manaCost) {
		let manaCost = cardData.manaCost;
		const manaCostLength = (manaCost.match(/{/g) || []).length;
		if (manaCostLength >= 8) {
			//Gets the index of the Nth occurance of a substring.
			function nthIndex(str, pat, n){
				var L= str.length, i= -1;
				while(n-- && i++<L){
					i= str.indexOf(pat, i);
						if (i < 0) break;
					}
				return i;
			}
			const breakPos = Math.floor(manaCostLength / 2);
			const convertedBreakPos = nthIndex(manaCost, "}", breakPos) + 1;
			manaCost = manaCost.substr(0, convertedBreakPos) + "<br>" + manaCost.substr(convertedBreakPos);
		}
		cost.innerHTML = symbolsToHtml(manaCost);
	}
	if (cardData.colorIndicator.length > 0) {
		const map = {
			"White": "W",
			"Blue": "U",
			"Black": "B",
			"Red": "R",
			"Green": "G",
		}
		cardData.colorIndicator.sort(function(a, b) {
			return ["White", "Blue", "Black", "Red", "Green"].indexOf(a) - ["White", "Blue", "Black", "Red", "Green"].indexOf(b);
		});
		colorIndicator.setAttribute("src", `/globalResources/colorIndicatorImages/${cardData.colorIndicator.map(color => map[color]).join("")}.svg`);
		typeLine.appendChild(colorIndicator);
	}
	typeText.textContent = cardData.type;
	typeLine.appendChild(typeText);
	if (cardData.rulesText) {
		text.innerHTML = symbolsToHtml(cardData.rulesText.replace(/\n/g, "<br><br>"));
	}
	if (cardData.loyalty.length > 0) {
		stats.textContent = cardData.loyalty;
	} else if (cardData.defense.length > 0) {
		stats.textContent = cardData.defense;
	} else if (cardData.power.length > 0) {
		stats.textContent = cardData.power + "/" + cardData.toughness;
	}

	name.setAttribute("class", "cardTextName");
	cost.setAttribute("class", "cardTextCost");
	colorIndicator.setAttribute("class", "cardTextColorIndicator");
	typeLine.setAttribute("class", "cardTextType");
	text.setAttribute("class", "cardTextText");
	stats.setAttribute("class", "cardTextStats");

	const topTextBox = document.createElement("div");
	topTextBox.setAttribute("class", "topTextBox");

	topTextBox.appendChild(name);
	topTextBox.appendChild(cost);
	textElement.appendChild(topTextBox);
	textElement.appendChild(typeLine);
	textElement.appendChild(text);
	textElement.appendChild(stats);

	textElement.setAttribute("class","cardText");
	textElement.addEventListener("click", function() {
		if (this.parentNode.childNodes[0].style.display === "" && window.getSelection().toString().trim() === "") {
			this.parentNode.childNodes[0].style.visibility = "";
			this.parentNode.childNodes[1].style.visibility = "hidden";
		}
	});

	containerDiv.appendChild(imageElement);
	containerDiv.appendChild(textElement);
	containerDiv.setDisplayMode = function(mode) {
		if (mode === "image") {
			this.setAttribute("displayMode", "image");
			if (this.childNodes[0].style.display === "") {
				this.childNodes[0].style.visibility = "";
				this.childNodes[1].style.visibility = "hidden";
			}
		} else if (mode === "text") {
			this.setAttribute("displayMode", "text");
			this.childNodes[0].style.visibility = "hidden";
			this.childNodes[1].style.visibility = "";
		}
	}
	containerDiv.setDisplayMode(defaultDisplayType);

	return containerDiv;
}
