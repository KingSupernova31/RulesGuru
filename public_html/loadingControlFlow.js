//Handle sites that append garbage to the url.
if (!/^https?:\/\/(?:localhost:8080|rulesguru\.net)\/\?(?:\d*(RG.+GG)?)$/.test(window.location.href)) {
	const match = window.location.href.match(/^https?:\/\/(?:localhost:8080|rulesguru\.net)\/(\?(?:\d*(RG.+GG)?))/);
	if (match === null) {
		history.replaceState({}, "", ".");
	} else {
		history.replaceState({}, "", `./${match[1]}`);
	}
}

//Check for searchLinks.
let goToSearchLink = false,
		searchLink;
if (window.location.href.match("/\?(\d*)RG")) {
	searchLink = window.location.href.slice(window.location.href.indexOf("RG") + 2, window.location.href.length - 2);
	let numbermatch = window.location.href.match(/\?(\d)+/); // Case where there is a specific question and a searchlink
	if (numbermatch === null) {
		history.replaceState({}, "", ".");
	} else {
		history.replaceState({}, "", `./${numbermatch[0]}`);
	}
	goToSearchLink = true;
}

//Check for question id.
let goToQuestionNum = null;
if (window.location.href.match(/\?\d/)) {
	goToQuestionNum = Number(window.location.href.match(/\/?(\d+)$/)[1]);
}

if (goToSearchLink) {
	document.getElementById("startPage").style.display = "none";
} else if (typeof goToQuestionNum === "number") {
	document.getElementById("FOUCOverlay").style.display = "none";
	document.getElementById("startPage").style.display = "none";
	goToQuestion(goToQuestionNum, function() {
		toggleAnimation("stop");
	});
} else {
	toggleAnimation("stop");
	document.getElementById("FOUCOverlay").style.display = "none";
}


//Add question numbers to the url and handle back/forward button presses.
window.addEventListener("popstate", function(event) {
	if (window.location.href.includes("?") && !window.location.href.includes("?RG")) {
		let questionNum = Number(window.location.href.match(/\/?(\d+)$/)[1]);
		if (loadedQuestions.pastQuestions[questionNum]) {
			loadedQuestions.currentQuestion = loadedQuestions.pastQuestions[questionNum];
			displayCurrentQuestion();
		} else {
			document.getElementById("questionPage").style.transform = "scale(0)";
		  document.getElementById("startPage").style.transform = "scale(0)";
			goToQuestion(questionNum);
		}
	} else {
		returnToHome(true);
	}
});
