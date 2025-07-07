//by Eamon Nerbonne (from http://home.nerbonne.org/A-vs-An), Apache 2.0 license
var AvsAnSimple = (function (root) {
	var dict = "2h.#2.a;i;&1.N;*4.a;e;i;o;/9.a;e;h1.o.i;l1./;n1.o.o;r1.e.s1./;01.8;12.1a;01.0;12.8;9;2.31.7;4.5.6.7.8.9.8a;0a.0;1;2;3;4;5;6;7;8;9;11; .22; .–.31; .42; .–.55; .,.h.k.m.62; .k.72; .–.82; .,.92; .–.8;<2.m1.d;o;=1.=1.E;@;A6;A1;A1.S;i1;r1;o.m1;a1;r1; .n1;d1;a1;l1;u1;c1.i1.a1.n;s1;t1;u1;r1;i1;a1;s.t1;h1;l1;e1;t1;e1.s;B2.h2.a1.i1;r1;a.á;o1.r1.d1. ;C3.a1.i1.s1.s.h4.a2.i1.s1;e.o1.i;l1.á;r1.o1.í;u2.i;r1.r1.a;o1.n1.g1.j;D7.a1.o1.q;i2.n1.a1.s;o1.t;u1.a1.l1.c;á1. ;ò;ù;ư;E7;U1;R.b1;o1;l1;i.m1;p1;e1;z.n1;a1;m.s1;p5.a1.c;e;h;o;r;u1.l1;o.w1;i.F11. ;,;.;/;0;1;2;3;4;5;6;71.0.8;9;Ae;B.C.D.F.I2.L.R.K.L.M.N.P.Q.R.S.T.B;C1;M.D;E2.C;I;F1;r.H;I3.A1;T.R1. ;U;J;L3.C;N;P;M;O1. ;P1;..R2.A1. ;S;S;T1;S.U2.,;.;X;Y1;V.c;f1.o.h;σ;G7.e1.r1.n1.e;h1.a3.e;i;o;i1.a1.n1.g;o2.f1. ;t1.t1. ;r1.i1.a;w1.a1.r1.r;ú;Hs. ;&;,;.2;A.I.1;2;3;5;7;B1;P.C;D;F;G;H1;I.I6;C.G.N.P.S1.D;T.K1.9;L;M1;..N;O2. ;V;P;R1;T.S1.F.T;V;e2.i1.r;r1.r1.n;o2.n6;d.e1.s;g.k.o2;l.r1;i1.f;v.u1.r;I3;I2;*.I.n1;d1;e1;p1;e1;n1;d2;e1;n1;c1;i.ê.s1;l1;a1;n1;d1;s.J1.i1.a1.o;Ly. ;,;.;1;2;3;4;8;A3. ;P;X;B;C;D;E2. ;D;F1;T.G;H1.D.I1.R;L;M;N;P;R;S1;m.T;U1. ;V1;C.W1.T;Z;^;a1.o1.i1.g;o1.c1.h1.a1;b.p;u1.s1.h1;o.ộ;M15. ;&;,;.1;A1;.1;S./;1;2;3;4;5;6;7;8;Ai;B.C.D.F.G.J.L.M.N.P.R.S.T.V.W.X.Y.Z.B1;S1;T.C;D;E3.P1;S.W;n;F;G;H;I4. ;5;6;T1;M.K;L;M;N;O1.U;P;Q;R;S;T1;R.U2. ;V;V;X;b1.u1.m;f;h;o2.D1.e.U1;..p1.3;s1.c;Ny. ;+;.1.E.4;7;8;:;A3.A1;F.I;S1.L;B;C;D;E3.A;H;S1. ;F1;U.G;H;I7.C.D1. ;K.L.N.O.S.K;L;M1;M.N2.R;T;P1.O1.V1./1.B;R2;J.T.S1;W.T1;L1.D.U1.S;V;W2.A;O1.H;X;Y3.C1.L;P;U;a1.s1.a1.n;t1.h;v;²;×;O5;N1;E.l1;v.n2;c1.e.e1.i;o1;p.u1;i.P1.h2.i1.a;o2.b2;i.o.i;Q1.i1.n1.g1.x;Rz. ;&;,;.1;J./;1;4;6;A3. ;.;F1;T.B1;R.C;D;E3. ;S1.P;U;F;G;H1.S;I2.A;C1. ;J;K;L1;P.M5;1.2.3.5.6.N;O2.H;T2;A.O.P;Q;R1;F.S4;,...?.T.T;U4;B.M.N.S.V;X;c;f1;M1...h2.A;B;ò;S11. ;&;,;.4.E;M;O;T1..3.B;D;M;1;3;4;5;6;8;9;A3. ;8;S2;E.I.B;C3.A1. ;R2.A.U.T;D;E6. ;5;C3;A.O.R.I1.F.O;U;F3;&.H.O1.S.G1;D.H3.2;3;L;I2. ;S1.O.K2.I.Y.L3;A2. ;.;I1. ;O.M3;A1. ;I.U1.R.N5.A.C3.A.B.C.E.F.O.O5. ;A1.I;E;S1;U.V;P7;A7;A.C.D.M.N.R.S.E1. ;I4;C.D.N.R.L1;O.O.U.Y.Q1. ;R;S1;W.T9.A1. ;C;D;F;I;L;M;S;V;U7.B.L.M.N.P.R.S.V;W1.R;X1.M;h1.i1.g1.a1.o;p1.i1.o1;n.t2.B;i1.c1.i;T4.a2.i2.g1.a.s1.c;v1.e1.s;e1.a1.m1.p;u1.i2.l;r;à;Um..1.N1..1.C;/1.1;11. .21.1;L1.T;M1.N;N4.C1.L;D2. .P.K;R1. .a;b2;a.i.d;g1.l;i1.g.l2;i.y.m;no. ;a1.n.b;c;d;e1;s.f;g;h;i2.d;n;j;k;l;m;n;o;p;q;r;s;t;u;v;w;p;r3;a.e.u1.k;s3. ;h;t1;r.t4.h;n;r;t;x;z;í;W2.P1.:4.A1.F;I2.B;N1.H.O1.V;R1.F1.C2.N.U.i1.k1.i1.E1.l1.i;X7;a.e.h.i.o.u.y.Y3.e1.t1.h;p;s;[5.A;E;I;a;e;_2._1.i;e;`3.a;e;i;a7; .m1;a1;r1. .n1;d2; .ě.p1;r1;t.r1;t1;í.u1;s1;s1;i1. .v1;u1;t.d3.a1.s1. ;e2.m1. ;r1. ;i2.c1.h1. ;e1.s1.e2.m;r;e8;c1;o1;n1;o1;m1;i1;a.e1;w.l1;i1;t1;e1;i.m1;p1;e1;z.n1;t1;e1;n1;d.s2;a1. .t4;a1; .e1; .i1;m1;a1;r.r1;u1.t.u1.p1. ;w.f3. ;M;y1.i;h9. ;,;.;C;a1.u1.t1;b.e2.i1.r1;a.r1.m1.a1.n;o4.m2.a1; .m;n8; .b.d.e3; .d.y.g.i.k.v.r1.s1. ;u1.r;r1. ;t1;t1;p1;:.i6;b1;n.e1;r.n2;f2;l1;u1;ê.o1;a.s1;t1;a1;l1;a.r1; .s1; .u.k1.u1. ;l3.c1.d;s1. ;v1.a;ma. ;,;R;b1.a.e1.i1.n;f;p;t1.a.u1.l1.t1.i1.c1.a1.m1.p1.i;×;n6. ;V;W;d1; .t;×;o8;c2;h1;o.u1;p.d1;d1;y.f1; .g1;g1;i.no. ;';,;/;a;b;c1.o;d;e2.i;r;f;g;i;l;m;n;o;r;s;t;u;w;y;z;–;r1;i1;g1;e.t1;r1.s;u1;i.r3. ;&;f;s9.,;?;R;f2.e.o.i1.c1.h;l1. ;p2.3;i1. ;r1.g;v3.a.e.i.t2.A;S;uc; ...b2.e;l;f.k2.a;i;m1;a1. .n3;a3; .n5.a;c;n;s;t;r1;y.e2; .i.i8.c2.o1.r1.p;u1.m;d1;i1.o;g1.n;l1.l;m1;o.n;s1.s;v1.o1;c.r5;a.e.i.l.o.s3. ;h;u1.r2;e.p3;a.e.i.t2.m;t;v.w1.a;xb. ;';,;.;8;b;k;l;m1;a.t;y1. ;y1.l;{1.a;|1.a;£1.8;À;Á;Ä;Å;Æ;É;Ò;Ó;Ö;Ü;à;á;æ;è;é1;t3.a;o;u;í;ö;ü1; .Ā;ā;ī;İ;Ō;ō;œ;Ω;α;ε;ω;ϵ;е;–2.e;i;ℓ;";
	function fill(node) {
		var kidCount = parseInt(dict, 36) || 0,
			offset = kidCount && kidCount.toString(36).length;
		node.article = dict[offset] === "." ? "a" : "an";
		dict = dict.substr(1 + offset);
		for (var i = 0; i < kidCount; i++) {
			var kid = node[dict[0]] = {}
			dict = dict.substr(1);
			fill(kid);
		}
	}
	fill(root);
	return {
		raw: root,
		//Usage example: AvsAnSimple.query("example")
		//example returns: "an"
		query: function (word) {
			var node = root, sI = 0, result, c;
			do {
				c = word[sI++];
			} while ('"‘’“”$\'-('.indexOf(c) >= 0);//also terminates on end-of-string "undefined".

			while (1) {
				result = node.article || result;
				node = node[c];
				if (!node) return result;
				c = word[sI++] || " ";
			}
		}
	};
})({});

const symbolsToHtml = function(string) {
	const symbolMap = {
		"{W}": "<i class='ms ms-w ms-cost'></i>",
		"{U}": "<i class='ms ms-u ms-cost'></i>",
		"{B}": "<i class='ms ms-b ms-cost'></i>",
		"{R}": "<i class='ms ms-r ms-cost'></i>",
		"{G}": "<i class='ms ms-g ms-cost'></i>",
		"{0}": "<i class='ms ms-0 ms-cost'></i>",
		"{1}": "<i class='ms ms-1 ms-cost'></i>",
		"{2}": "<i class='ms ms-2 ms-cost'></i>",
		"{3}": "<i class='ms ms-3 ms-cost'></i>",
		"{4}": "<i class='ms ms-4 ms-cost'></i>",
		"{5}": "<i class='ms ms-5 ms-cost'></i>",
		"{6}": "<i class='ms ms-6 ms-cost'></i>",
		"{7}": "<i class='ms ms-7 ms-cost'></i>",
		"{8}": "<i class='ms ms-8 ms-cost'></i>",
		"{9}": "<i class='ms ms-9 ms-cost'></i>",
		"{10}": "<i class='ms ms-10 ms-cost'></i>",
		"{11}": "<i class='ms ms-11 ms-cost'></i>",
		"{12}": "<i class='ms ms-12 ms-cost'></i>",
		"{13}": "<i class='ms ms-13 ms-cost'></i>",
		"{14}": "<i class='ms ms-14 ms-cost'></i>",
		"{15}": "<i class='ms ms-15 ms-cost'></i>",
		"{16}": "<i class='ms ms-16 ms-cost'></i>",
		"{17}": "<i class='ms ms-17 ms-cost'></i>",
		"{18}": "<i class='ms ms-18 ms-cost'></i>",
		"{19}": "<i class='ms ms-19 ms-cost'></i>",
		"{20}": "<i class='ms ms-20 ms-cost'></i>",
		"{X}": "<i class='ms ms-x ms-cost'></i>",
		"{Y}": "<i class='ms ms-y ms-cost'></i>",
		"{W/P}": "<i class='ms ms-wp ms-cost'></i>",
		"{U/P}": "<i class='ms ms-up ms-cost'></i>",
		"{B/P}": "<i class='ms ms-bp ms-cost'></i>",
		"{R/P}": "<i class='ms ms-rp ms-cost'></i>",
		"{G/P}": "<i class='ms ms-gp ms-cost'></i>",
		"{S}": "<i class='ms ms-s ms-cost'></i>",
		"{C}": "<i class='ms ms-c ms-cost'></i>",
		"{E}": "<i class='ms ms-e ms-cost'></i>",
		"{T}": "<i class='ms ms-tap ms-cost'></i>",
		"{Q}": "<i class='ms ms-untap ms-cost'></i>",
		"{W/U}": "<i class='ms ms-wu ms-split ms-cost'></i>",
		"{W/B}": "<i class='ms ms-wb ms-split ms-cost'></i>",
		"{U/B}": "<i class='ms ms-ub ms-split ms-cost'></i>",
		"{U/R}": "<i class='ms ms-ur ms-split ms-cost'></i>",
		"{B/R}": "<i class='ms ms-br ms-split ms-cost'></i>",
		"{B/G}": "<i class='ms ms-bg ms-split ms-cost'></i>",
		"{R/W}": "<i class='ms ms-rw ms-split ms-cost'></i>",
		"{R/G}": "<i class='ms ms-rg ms-split ms-cost'></i>",
		"{G/W}": "<i class='ms ms-gw ms-split ms-cost'></i>",
		"{G/U}": "<i class='ms ms-gu ms-split ms-cost'></i>",
		"{2/W}": "<i class='ms ms-2w ms-split ms-cost'></i>",
		"{2/U}": "<i class='ms ms-2u ms-split ms-cost'></i>",
		"{2/B}": "<i class='ms ms-2b ms-split ms-cost'></i>",
		"{2/R}": "<i class='ms ms-2r ms-split ms-cost'></i>",
		"{2/G}": "<i class='ms ms-2g ms-split ms-cost'></i>",
		"{CHAOS}": "<i class='ms ms-chaos'></i>",
		"{W/U/P}": "<i class='ms ms-wup ms-cost'></i>",
		"{W/B/P}": "<i class='ms ms-wbp ms-cost'></i>",
		"{U/B/P}": "<i class='ms ms-ubp ms-cost'></i>",
		"{U/R/P}": "<i class='ms ms-urp ms-cost'></i>",
		"{B/R/P}": "<i class='ms ms-brp ms-cost'></i>",
		"{B/G/P}": "<i class='ms ms-bgp ms-cost'></i>",
		"{R/W/P}": "<i class='ms ms-rwp ms-cost'></i>",
		"{R/G/P}": "<i class='ms ms-rgp ms-cost'></i>",
		"{G/W/P}": "<i class='ms ms-gwp ms-cost'></i>",
		"{G/U/P}": "<i class='ms ms-gup ms-cost'></i>",
		"{H}": "<i class='ms ms-h ms-cost'></i>",
		"{P}": "<i class='ms ms-paw ms-cost'></i>",
		"{TK}": "<i class='ms ms-ticket ms-cost'></i>",
		"{PW}": "<i class='ms ms-planeswalker'></i>",
		"[0]": "<i class='ms ms-loyalty-zero ms-loyalty-0 ms-2x'></i>",
		"[+1]": "<i class='ms ms-loyalty-up ms-loyalty-1 ms-2x'></i>",
		"[+2]": "<i class='ms ms-loyalty-up ms-loyalty-2 ms-2x'></i>",
		"[+3]": "<i class='ms ms-loyalty-up ms-loyalty-3 ms-2x'></i>",
		"[+4]": "<i class='ms ms-loyalty-up ms-loyalty-4 ms-2x'></i>",
		"[+5]": "<i class='ms ms-loyalty-up ms-loyalty-5 ms-2x'></i>",
		"[-1]": "<i class='ms ms-loyalty-down ms-loyalty-1 ms-2x'></i>",
		"[-2]": "<i class='ms ms-loyalty-down ms-loyalty-2 ms-2x'></i>",
		"[-3]": "<i class='ms ms-loyalty-down ms-loyalty-3 ms-2x'></i>",
		"[-4]": "<i class='ms ms-loyalty-down ms-loyalty-4 ms-2x'></i>",
		"[-5]": "<i class='ms ms-loyalty-down ms-loyalty-5 ms-2x'></i>",
		"[-6]": "<i class='ms ms-loyalty-down ms-loyalty-6 ms-2x'></i>",
		"[-7]": "<i class='ms ms-loyalty-down ms-loyalty-7 ms-2x'></i>",
		"[-8]": "<i class='ms ms-loyalty-down ms-loyalty-8 ms-2x'></i>",
		"[-9]": "<i class='ms ms-loyalty-down ms-loyalty-9 ms-2x'></i>",
		"[-10]": "<i class='ms ms-loyalty-down ms-loyalty-10 ms-2x'></i>",
		"[-11]": "<i class='ms ms-loyalty-down ms-loyalty-11 ms-2x'></i>",
		"[-12]": "<i class='ms ms-loyalty-down ms-loyalty-12 ms-2x'></i>",
		"[-13]": "<i class='ms ms-loyalty-down ms-loyalty-13 ms-2x'></i>",
		"[-14]": "<i class='ms ms-loyalty-down ms-loyalty-14 ms-2x'></i>",
		"[-15]": "<i class='ms ms-loyalty-down ms-loyalty-15 ms-2x'></i>",
		"[-16]": "<i class='ms ms-loyalty-down ms-loyalty-16 ms-2x'></i>",
		"[-X]": "<i class='ms ms-loyalty-down ms-loyalty-x ms-2x'></i>",
	};
	string = string.replace(/[{\[][A-Z0-9\/+-]{1,5}[}\]]/g, function(match) {
		return symbolMap[match] || match;
	});
	return string;
}

//Accepts a string containing various [expressions] and {symbols} and returns a plaintext version and an HTML version.
const replaceExpressions = function(string, playerNamesMap, oracle, allCards, allRules, forPreview) {

	const combineStrings = function(strings) {
		if (typeof strings !== "object") {
			throw new Error("Strings is not an array");
		}
		if (strings.length === 1) {
			return strings[0];
		}
		if (strings.length === 2) {
			return strings[0] + " and " + strings[1];
		}
		let combinedString = "";
		for (let i = 0 ; i < strings.length ; i++) {
			if (i === strings.length - 1) {
				combinedString += "and " + strings[i];
			} else {
				combinedString += strings[i] + ", ";
			}
		}
		return combinedString;
	}

	const resultToReturn = {
		"plaintext": "",
		"plaintextNoCitations": "",
		"html": "",
		"errors": []
	};

	//Replace card name expressions.
	const replaceCompositeExpressionSegment = function(segment, hasMultipleSegments) {
		if (!segment.startsWith("card")) {//If this is an operator or a primitive number, return it unchanged except for the whitespace removed;
			return segment.trim();
		}

		let cardRef = segment.match(/card (\d+)(:other side)?/);
		try {
			if (cardRef[2]) {
				if (oracle[cardRef[1] - 1].names[0] === oracle[cardRef[1] - 1].name) {
					cardRef = allCards[oracle[cardRef[1] - 1].names[1]];
				} else {
					cardRef = allCards[oracle[cardRef[1] - 1].names[0]];
				}

				if (cardRef.names.length === 3) {
					cardRef = segment.match(/card (\d+)(:other side)?/);
					resultToReturn.errors.push(`${oracle[cardRef[1] - 1].name} is a meld card, which doesn't have a single "other side".`);
				}
			} else {
				cardRef = oracle[cardRef[1] - 1];
			}
		} catch (err) {
			console.error(err);
			resultToReturn.errors.push(`${oracle[cardRef[1] - 1].name} does not have an other side.`)
		}

		let characteristic = segment.match(/colors|color identity|color indicator|mana cost|mana value|supertypes|types|subtypes|power|toughness|loyalty/);
		if (characteristic) {
			characteristic = characteristic[0];
		}
		const isSimple = segment.includes(":simple");

		const toCamelCase = function(string) {
			return string.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
				return index === 0 ? word.toLowerCase() : word.toUpperCase();
			}).replace(/\s+/g, '');
		}

		if (characteristic) {
			const characteristicValue = cardRef[toCamelCase(characteristic)];
			if (typeof characteristicValue === "object") {
				if (characteristicValue.length === 0) {
					resultToReturn.errors.push(`${cardRef.name} does not have any ${characteristic}.`);
				}
				if (isSimple) {
					return characteristicValue.join(" ");
				} else {
					return combineStrings(characteristicValue)
				}
			} else {
				if (characteristicValue === undefined) {
					resultToReturn.errors.push(`${cardRef.name} does not have a ${characteristic}.`);
				}
				if (hasMultipleSegments && isNaN(Number(characteristicValue))) {
					resultToReturn.errors.push(`${cardRef.name} does not have a numeric ${characteristic}.`);
				}
				return characteristicValue;
			}
		} else {
			return cardRef.name;
		}
	}

	const performMathOnSegments = function(segments) {
		let storedOperator;
		let resultSoFar;
		for (let i = 0 ; i < segments.length ; i++) {
			let segmentType;
			if (["+", "-", "*"].includes(segments[i])) {
				segmentType = "operator";
			} else if (!isNaN(Number(segments[i]))) {
				segmentType = "number";
			} else {
				resultToReturn.errors.push("Invalid segment " + segments[i]) + ".";
			}

			if ((i % 2 === 0 && segmentType !== "number") || (i % 2 === 1 && segmentType !== "operator")) {
				resultToReturn.errors.push("Invalid segment order.");
			}

			if (i === 0) {
				resultSoFar = Number(segments[i]);
			}

			if (i % 2 === 1) {
				storedOperator = segments[i];
			}

			if (i % 2 === 0 && storedOperator) {
				if (storedOperator === "+") {
					resultSoFar += Number(segments[i]);
				}
				if (storedOperator === "-") {
					resultSoFar -= Number(segments[i]);
				}
				if (storedOperator === "*") {
					resultSoFar *= Number(segments[i]);
				}
				storedOperator = null;
			}
		}
		return resultSoFar;
	}

	string = string.replace(/\[(card \d+(:other side)?(:(colors:simple|color identity:simple|color indicator:simple|supertypes:simple|types:simple|subtypes:simple|colors|color indicator|color identity|mana cost|mana value|supertypes|types|subtypes|power|toughness|loyalty))?|\d+| [+\-*] )+\]/g, function(cardExpression) {
		try {
			const segments = Array.from(cardExpression.match(/(card \d+(:other side)?(:(colors:simple|color identity:simple|color indicator:simple|supertypes:simple|types:simple|subtypes:simple|colors|color indicator|color identity|mana cost|mana value|supertypes|types|subtypes|power|toughness|loyalty))?|\d+| [+\-*] )/g));

			for (let segmentIndex in segments) {
				segments[segmentIndex] = replaceCompositeExpressionSegment(segments[segmentIndex], segments.length > 1);
			}

			let result;
			if (segments.length > 1) {//handle operations with multiple segments.
				result = performMathOnSegments(segments);
			} else {
				result = segments[0];
			}
			if (result === undefined || result === "" || Number.isNaN(result)) {
				resultToReturn.errors.push(`${cardExpression} evaluates to ${result}.`)
			} else {
				if (forPreview) {
					return `↔${result}<sup style="color:green;font-size:0.7rem">${cardExpression}</sup>↕`;
				} else {
					return "↔" + result + "↕";//These are arbitrary symbols used by the aVsAn and pluralization fixer to identify where a card expression replacement occured.
				}
			}
		} catch (err) {
			console.error(err);
			resultToReturn.errors.push("Alright I don't know what you've done, but you broke *something*. Please let me know what happened so that I can either fix it or make this error message more specific.");
			return cardExpression;
		}
	});

	//Determine the correct article ("a" or "an") in front of card expressions and fix pluralizations of cards.
	string = string.replace(/\b(a|A|an|An) ↔(\w+)/g, function(match, capt1, capt2) {
		let article = AvsAnSimple.query(capt2);
		if (capt1 === "A" || capt1 === "An") {
			return `${article.charAt(0).toUpperCase() + article.slice(1)} ${capt2}`;
		} else {
			return `${article} ${capt2}`;
		}
	});
	string = string.replace(/↔/g, "");
	string = string.replace(/s↕s/g, "s");
	string = string.replace(/↕/g, "");

	//Replace player names.
	string = string.replace(/\[((?:AP[ab]?|NAP[ab123]?))\]/g, function(match, capt1, offset) {
		return playerNamesMap[capt1].name;
	});

	//Capitalize the first letter at the beginning of a sentence after a parenthetical statement. (These are needed for expressions that just got replaced.)
	string = string.replace(/\. \([^()]+?\) ([a-z])/g, function(match, capt1) {
		return match.slice(0, -1) + capt1[0].toUpperCase() + capt1.substring(1);
	});

	//Capitalize the first letter at the beginning of a sentence after another sentance.
	string = string.replace(/\. ([a-z])/g, function(match, capt1) {
		return match.slice(0, -1) + capt1[0].toUpperCase() + capt1.substring(1);
	});

	//Capitalize the first letter of the first sentence.
	if (string) {
		string = string[0].toUpperCase() + string.substring(1);
	}

	resultToReturn.plaintext = string;
	resultToReturn.plaintextNoCitations = string;
	resultToReturn.html = string;

	//Move the superscripts to after any pluralizations.
	if (forPreview) {
		//HTML tags leaking from my eyes like liquid pain! (They'll never be nested.)
		console.log(resultToReturn.html)
		resultToReturn.html = resultToReturn.html.replace(/<sup(.*?)<\/sup>([^ .,;<]*)/g, "$2<sup$1</sup>");
		console.log(resultToReturn.html)
	}

	//Remove rules citations or replace them with HTML.
	resultToReturn.plaintextNoCitations = resultToReturn.plaintext.replace(/ \((\[\d{3}\.\d{1,2}[a-z]?\](\/|, )?)+\)/g, "");
	resultToReturn.plaintext = resultToReturn.plaintext.replace(/ \((\[\d{3}\.\d{1,2}[a-z]?\](\/|, )?)+\)/g, function(string) {
		return string.replace(/[\]\[]/g, "");
	});
	resultToReturn.html = resultToReturn.html.replace(/\[(\d{3}(\.\d{1,3}([a-z])?)?)\]/g, function(match, capt1) {
		if (!allRules[capt1]) {
			resultToReturn.errors.push(`Rule ${capt1} does not exist.`)
		}
		return `<a href="https://yawgatog.com/resources/magic-rules/#R${capt1.replace('.', '')}" target="_blank" tooltip="${allRules[capt1] ? allRules[capt1].ruleText.replace(/"/g, "&quot") : "This rule doesn't exist."}">${capt1}</a>`;
	});

	resultToReturn.html = symbolsToHtml(resultToReturn.html);

	resultToReturn.html = resultToReturn.html.replace(/\n/g, "<br>");

	const unmatchedExpressions = resultToReturn.html.match(/\[.*?\]/);
	if (unmatchedExpressions) {
		for (let expression of Array.from(unmatchedExpressions)) {
			resultToReturn.errors.push(`${expression} is not a valid expression.`);
		}
	}

	return resultToReturn;
};

if (typeof module === "object") {
	module.exports = replaceExpressions;
};
