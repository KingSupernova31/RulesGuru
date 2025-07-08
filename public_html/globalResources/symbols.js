const symbolMap = {
	"{W}": {
		"html": "<i class='ms ms-w ms-cost'></i>",
		"type": "mana",
	},
	"{U}": {
		"html": "<i class='ms ms-u ms-cost'></i>",
		"type": "mana",
	},
	"{B}": {
		"html": "<i class='ms ms-b ms-cost'></i>",
		"type": "mana",
	},
	"{R}": {
		"html": "<i class='ms ms-r ms-cost'></i>",
		"type": "mana",
	},
	"{G}": {
		"html": "<i class='ms ms-g ms-cost'></i>",
		"type": "mana",
	},
	"{C}": {
		"html": "<i class='ms ms-c ms-cost'></i>",
		"type": "mana",
	},
	"{0}": {
		"html": "<i class='ms ms-0 ms-cost'></i>",
		"type": "mana",
	},
	"{1}": {
		"html": "<i class='ms ms-1 ms-cost'></i>",
		"type": "mana",
	},
	"{2}": {
		"html": "<i class='ms ms-2 ms-cost'></i>",
		"type": "mana",
	},
	"{3}": {
		"html": "<i class='ms ms-3 ms-cost'></i>",
		"type": "mana",
	},
	"{4}": {
		"html": "<i class='ms ms-4 ms-cost'></i>",
		"type": "mana",
	},
	"{5}": {
		"html": "<i class='ms ms-5 ms-cost'></i>",
		"type": "mana",
	},
	"{6}": {
		"html": "<i class='ms ms-6 ms-cost'></i>",
		"type": "mana",
	},
	"{7}": {
		"html": "<i class='ms ms-7 ms-cost'></i>",
		"type": "mana",
	},
	"{8}": {
		"html": "<i class='ms ms-8 ms-cost'></i>",
		"type": "mana",
	},
	"{9}": {
		"html": "<i class='ms ms-9 ms-cost'></i>",
		"type": "mana",
	},
	"{10}": {
		"html": "<i class='ms ms-10 ms-cost'></i>",
		"type": "mana",
	},
	"{11}": {
		"html": "<i class='ms ms-11 ms-cost'></i>",
		"type": "mana",
	},
	"{12}": {
		"html": "<i class='ms ms-12 ms-cost'></i>",
		"type": "mana",
	},
	"{13}": {
		"html": "<i class='ms ms-13 ms-cost'></i>",
		"type": "mana",
	},
	"{14}": {
		"html": "<i class='ms ms-14 ms-cost'></i>",
		"type": "mana",
	},
	"{15}": {
		"html": "<i class='ms ms-15 ms-cost'></i>",
		"type": "mana",
	},
	"{16}": {
		"html": "<i class='ms ms-16 ms-cost'></i>",
		"type": "mana",
	},
	"{17}": {
		"html": "<i class='ms ms-17 ms-cost'></i>",
		"type": "mana",
	},
	"{18}": {
		"html": "<i class='ms ms-18 ms-cost'></i>",
		"type": "mana",
	},
	"{19}": {
		"html": "<i class='ms ms-19 ms-cost'></i>",
		"type": "mana",
	},
	"{20}": {
		"html": "<i class='ms ms-20 ms-cost'></i>",
		"type": "mana",
	},
	"{X}": {
		"html": "<i class='ms ms-x ms-cost'></i>",
		"type": "mana",
	},
	"{Y}": {
		"html": "<i class='ms ms-y ms-cost'></i>",
		"type": "mana",
	},
	"{W/U}": {
		"html": "<i class='ms ms-wu ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{W/B}": {
		"html": "<i class='ms ms-wb ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{U/B}": {
		"html": "<i class='ms ms-ub ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{U/R}": {
		"html": "<i class='ms ms-ur ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{B/R}": {
		"html": "<i class='ms ms-br ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{B/G}": {
		"html": "<i class='ms ms-bg ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{R/W}": {
		"html": "<i class='ms ms-rw ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{R/G}": {
		"html": "<i class='ms ms-rg ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{G/W}": {
		"html": "<i class='ms ms-gw ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{G/U}": {
		"html": "<i class='ms ms-gu ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{C/W}": {
		"html": "<i class='ms ms-cw ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{C/U}": {
		"html": "<i class='ms ms-cu ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{C/B}": {
		"html": "<i class='ms ms-cb ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{C/R}": {
		"html": "<i class='ms ms-cr ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{C/G}": {
		"html": "<i class='ms ms-cg ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{2/W}": {
		"html": "<i class='ms ms-2w ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{2/U}": {
		"html": "<i class='ms ms-2u ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{2/B}": {
		"html": "<i class='ms ms-2b ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{2/R}": {
		"html": "<i class='ms ms-2r ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{2/G}": {
		"html": "<i class='ms ms-2g ms-split ms-cost'></i>",
		"type": "mana",
	},
	"{W/P}": {
		"html": "<i class='ms ms-wp ms-cost'></i>",
		"type": "mana",
	},
	"{U/P}": {
		"html": "<i class='ms ms-up ms-cost'></i>",
		"type": "mana",
	},
	"{B/P}": {
		"html": "<i class='ms ms-bp ms-cost'></i>",
		"type": "mana",
	},
	"{R/P}": {
		"html": "<i class='ms ms-rp ms-cost'></i>",
		"type": "mana",
	},
	"{G/P}": {
		"html": "<i class='ms ms-gp ms-cost'></i>",
		"type": "mana",
	},
	"{W/U/P}": {
		"html": "<i class='ms ms-wup ms-cost'></i>",
		"type": "mana",
	},
	"{W/B/P}": {
		"html": "<i class='ms ms-wbp ms-cost'></i>",
		"type": "mana",
	},
	"{U/B/P}": {
		"html": "<i class='ms ms-ubp ms-cost'></i>",
		"type": "mana",
	},
	"{U/R/P}": {
		"html": "<i class='ms ms-urp ms-cost'></i>",
		"type": "mana",
	},
	"{B/R/P}": {
		"html": "<i class='ms ms-brp ms-cost'></i>",
		"type": "mana",
	},
	"{B/G/P}": {
		"html": "<i class='ms ms-bgp ms-cost'></i>",
		"type": "mana",
	},
	"{R/W/P}": {
		"html": "<i class='ms ms-rwp ms-cost'></i>",
		"type": "mana",
	},
	"{R/G/P}": {
		"html": "<i class='ms ms-rgp ms-cost'></i>",
		"type": "mana",
	},
	"{G/W/P}": {
		"html": "<i class='ms ms-gwp ms-cost'></i>",
		"type": "mana",
	},
	"{G/U/P}": {
		"html": "<i class='ms ms-gup ms-cost'></i>",
		"type": "mana",
	},
	"{S}": {
		"html": "<i class='ms ms-s ms-cost'></i>",
		"type": "mana",
	},
	"[0]": {
		"html": "<i class='ms ms-loyalty-zero ms-loyalty-0 ms-2x'></i>",
		"type": "loyalty",
	},
	"[+1]": {
		"html": "<i class='ms ms-loyalty-up ms-loyalty-1 ms-2x'></i>",
		"type": "loyalty",
	},
	"[+2]": {
		"html": "<i class='ms ms-loyalty-up ms-loyalty-2 ms-2x'></i>",
		"type": "loyalty",
	},
	"[+3]": {
		"html": "<i class='ms ms-loyalty-up ms-loyalty-3 ms-2x'></i>",
		"type": "loyalty",
	},
	"[+4]": {
		"html": "<i class='ms ms-loyalty-up ms-loyalty-4 ms-2x'></i>",
		"type": "loyalty",
	},
	"[+5]": {
		"html": "<i class='ms ms-loyalty-up ms-loyalty-5 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-1]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-1 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-2]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-2 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-3]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-3 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-4]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-4 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-5]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-5 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-6]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-6 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-7]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-7 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-8]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-8 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-9]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-9 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-10]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-10 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-11]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-11 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-12]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-12 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-13]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-13 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-14]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-14 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-15]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-15 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-16]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-16 ms-2x'></i>",
		"type": "loyalty",
	},
	"[-X]": {
		"html": "<i class='ms ms-loyalty-down ms-loyalty-x ms-2x'></i>",
		"type": "loyalty",
	},
	"{T}": {
		"html": "<i class='ms ms-tap ms-cost'></i>",
		"type": "misc",
	},
	"{Q}": {
		"html": "<i class='ms ms-untap ms-cost'></i>",
		"type": "misc",
	},
	"{E}": {
		"html": "<i class='ms ms-e ms-cost'></i>",
		"type": "misc",
	},
	"{P}": {
		"html": "<i class='ms ms-paw ms-cost'></i>",
		"type": "misc",
	},
	"{TK}": {
		"html": "<i class='ms ms-ticket ms-cost'></i>",
		"type": "misc",
	},
	"{H}": {
		"html": "<i class='ms ms-h'></i>",
		"type": "misc",
	},
	"{PW}": {
		"html": "<i class='ms ms-planeswalker'></i>",
		"type": "misc",
	},
	"{CHAOS}": {
		"html": "<i class='ms ms-chaos'></i>",
		"type": "misc",
	},
};

for (let i in symbolMap) {
	symbolMap[i].symbol = i;
}

const manaSymbols = Object.values(symbolMap).filter(symbol => symbol.type === "mana").map(symbol => symbol.symbol);

const pseudoSymbolMap = {
	"::colorless::": manaSymbols.filter(symbol => symbol.includes("C")),
	"::white::": manaSymbols.filter(symbol => symbol.includes("W")),
	"::blue::": manaSymbols.filter(symbol => symbol.includes("U")),
	"::black::": manaSymbols.filter(symbol => symbol.includes("B")),
	"::red::": manaSymbols.filter(symbol => symbol.includes("R")),
	"::green::": manaSymbols.filter(symbol => symbol.includes("G")),
	"::phyrexian::": manaSymbols.filter(symbol => symbol.includes("P") || symbol.includes("H")),
	"::generic::": manaSymbols.filter(symbol => /[0-9XY]/.test(symbol)),
	"::hybrid::": manaSymbols.filter(symbol => symbol.slice(0, symbol.indexOf("/P}")).includes("/")),
}

if (typeof module === "object") {
	module.exports = {
		symbolMap: symbolMap,
		"pseudoSymbolMap": pseudoSymbolMap,
	};
};