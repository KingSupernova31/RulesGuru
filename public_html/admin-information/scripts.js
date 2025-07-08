document.getElementById("topBannerRightText").appendChild(document.getElementById("editorLink"));

for (let i in symbolMap) {
	const symbolObj = symbolMap[i];

	const symbolDiv = document.createElement("div");
	symbolDiv.textContent = symbolObj.symbol + " ";
	symbolDiv.innerHTML += symbolObj.html;

	document.getElementById("symbolList").appendChild(symbolDiv);

}

for (let pseudo in pseudoSymbolMap) {
	const symbolSpan = document.createElement("span");
	symbolSpan.innerHTML = pseudo;
	const symbols = document.createElement("span");
	for (let symbol of pseudoSymbolMap[pseudo]) {
		symbols.innerHTML += symbolMap[symbol].html;
	}
	document.getElementById("pseudoSymbolList").appendChild(symbolSpan);
	document.getElementById("pseudoSymbolList").appendChild(symbols);
}