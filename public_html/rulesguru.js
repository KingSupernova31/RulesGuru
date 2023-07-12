"use strict";

let mostRecentQuestionId;

/*
//Live update the question count.
setInterval(function() {
	const httpRequest = new XMLHttpRequest();
	httpRequest.onload = function() {
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				document.getElementById("questionCount").innerHTML = JSON.parse(httpRequest.response).finished;
				document.getElementById("questionCountMobile").innerHTML = JSON.parse(httpRequest.response).finished;
			}
		}
	};
	httpRequest.open("GET", "/getQuestionCount", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send();
}, 10000);
*/
let getQuestionError = null;

const loadedQuestions = {
	"futureQuestions": [],
	"currentQuestion": null,
	"pastQuestions": {} //This is all questions that have ever been displayed, so it includes the current question.
};

//Make a request for a new random question that fits the current parameters.
let getQuestionTimeoutId = 0;
const getRandomQuestion = function(callback) {
	//console.log("Logging for issue #104 on Github. (Section 4)")
	//console.log(JSON.stringify(sidebarSettings))
	let response;
	clearTimeout(getQuestionTimeoutId);

	const httpRequest = new XMLHttpRequest();
	httpRequest.timeout = 15000;
	httpRequest.onerror = function() {
		getQuestionError = "There was an unknown error. Please check your internet connection and try again. If the problem persists, please report the issue using the contact form in the upper right.";
		if (!timeout) {
			getQuestionTimeoutId = setTimeout(getRandomQuestion, callback);
		}
		if (callback) {
				callback(response, httpRequest);
		}
	};
	httpRequest.ontimeout = function() {
		getQuestionError = "Failed to load question. Please check your internet connection and try again. If the problem persists, please report the issue using the contact form in the upper right.";
		if (callback) {
				callback(response, httpRequest);
		}
	};
	httpRequest.onload = function() {
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				//console.log("Logging for issue #104 on Github. (Section 5)")
				//console.log(httpRequest.response)
				response = JSON.parse(httpRequest.response);
				if (response.error) {
					getQuestionError = response.error;
				} else {
					getQuestionError = null;
				}
			} else {
				getQuestionError = "You should never see this error. (Server returned status code 200, but with no response.) If you do, please let me know exactly what happened using the contact form in the upper right.";
				if (!timeout) {
					getQuestionTimeoutId = setTimeout(getRandomQuestion, callback);
				}
			}
			if (callback) {
				callback(response, httpRequest);
			}
		} else {
			getQuestionError = `There was an error loading the question (server returned status code ${httpRequest.status}). Please wait a few minutes and try again. If the problem persists, please report the issue using the contact form in the upper right.`;
			if (!timeout) {
				getQuestionTimeoutId = setTimeout(getRandomQuestion, callback);
			}
			if (callback) {
				callback(response, httpRequest);
			}
		}
	};

	const settings = JSON.parse(JSON.stringify(sidebarSettings));
	settings.previousId = mostRecentQuestionId || undefined;
	settings.from = "homePage";
	settings.avoidRateLimiting = true;//If you find this and use it to get around my rate limiting, go ahead, you deserve it. But I'll be fixing it eventually.

	const queryString = encodeURIComponent(JSON.stringify(settings));

	httpRequest.open("GET", `/api/questions/?json=${queryString}`, true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send();
	return httpRequest;
};

let goToQuestionPendingRequest = null;
let goToQuestion = function(questionId, callback, settingsToUse) {
	document.querySelector("title").textContent = "RulesGuru #" + questionId;
	if (goToQuestionPendingRequest) {
		goToQuestionPendingRequest.abort();
	}
	toggleAnimation("start", "moveForQuestionsList");
	document.getElementById("startPage").style.transform = "scale(0)";
	goToQuestionPendingRequest = getSpecificQuestion(questionId, function(response) {
		goToQuestionPendingRequest = null;
		if (!getQuestionError) {
			if (sidebarOpen) {
				closeSidebar();
			}
			loadedQuestions.currentQuestion = response.questions[0];
			mostRecentQuestionId = loadedQuestions.currentQuestion.id;
			if (pendingRequest) {
				pendingRequest.abort();
				pendingRequest = null;
			}
			loadedQuestions.futureQuestions = [];
			displayCurrentQuestion();
			if (callback) {
				callback();
			}
		} else {
			toggleAnimation("stop");
			document.getElementById("startPage").style.transform = "";
			if (getQuestionError === "That question doesn't exist.") {
				returnToHome(false);
			}
			alert(getQuestionError);
			getQuestionError = null;
			returnToHome(false);
			clearTimeout(getQuestionTimeoutId);
			if (callback) {
				callback();
			}
		}
	}, settingsToUse);
};

const getSpecificQuestion = function(questionId, callback, settingsToUse) {
	let response;
	clearTimeout(getQuestionTimeoutId);

	const httpRequest = new XMLHttpRequest();
	httpRequest.timeout = 10000;
	httpRequest.onerror = function() {
		getQuestionError = "There was an unknown error. Please check your internet connection and try again. If the problem persists, please report the issue using the contact form in the upper right.";
		if (callback) {
				callback(response);
		}
	};
	httpRequest.ontimeout = function() {
		getQuestionError = "Failed to load question. Please check your internet connection and try again. If the problem persists, please report the issue using the contact form in the upper right.";
		if (callback) {
				callback(response);
		}
	};
	httpRequest.onload = function() {
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				response = JSON.parse(httpRequest.response);
				if (response.error) {
					getQuestionError = response.error;
				} else {
					getQuestionError = null;
				}
			} else {
				getQuestionError = "You should never see this error. (Server returned status code 200, but with no response.) If you do, please let me know exactly what happened using the contact form in the upper right.";
			}
			if (callback) {
				callback(response);
			}
		} else {
			getQuestionError = `There was an error loading the question (server returned status code ${httpRequest.status}). Please wait a few minutes and try again. If the problem persists, please report the issue using the contact form in the upper right.`;
			if (callback) {
				callback(response);
			}
		}
	};
	if (settingsToUse === undefined) {
		settingsToUse = JSON.parse(JSON.stringify(sidebarSettings));
	}
	settingsToUse.id = questionId;
	settingsToUse.from = "homePage";
	settingsToUse.avoidRateLimiting = true;//If you find this and use it to get around my rate limiting, go ahead, you deserve it. But I'll be fixing it eventually.

	const queryString = encodeURIComponent(JSON.stringify(settingsToUse));

	httpRequest.open("GET", `/api/questions/?json=${queryString}`, true);
	httpRequest.send();
	return httpRequest;
}

//Returns a random map of player names and genders for each possible player tag.
const getPlayerNamesMap = function() {
	const playerNamesMap = {};
	const genderOrder = ["male", "female", "neutral"];
	shuffle(genderOrder);
	let genderIndex = 0;
	const iterationOrder = ["AP", "NAP1", "NAP2", "NAP3", "NAP"];

	for (let i in iterationOrder) {
		const correctGenderPlayerNames = playerNames[iterationOrder[i]].filter(function(element) {
			return element.gender === genderOrder[genderIndex];
		});
		playerNamesMap[iterationOrder[i]] = correctGenderPlayerNames[Math.floor(Math.random() * correctGenderPlayerNames.length)];
		genderIndex++;
		if (genderIndex > 2) {
			genderIndex = 0;
		}
	}

	shuffle(genderOrder);
	let correctGenderPlayerNames = playerNames.AP.filter(function(element) {
		return element.gender === genderOrder[0];
	});
	playerNamesMap.APa = correctGenderPlayerNames[Math.floor(Math.random() * correctGenderPlayerNames.length)];
	correctGenderPlayerNames = playerNames.AP.filter(function(element) {
		return element.gender === genderOrder[1];
	});
	playerNamesMap.APb = correctGenderPlayerNames[Math.floor(Math.random() * correctGenderPlayerNames.length)];

	shuffle(genderOrder);
	correctGenderPlayerNames = playerNames.NAP.filter(function(element) {
		return element.gender === genderOrder[0];
	});
	playerNamesMap.NAPa = correctGenderPlayerNames[Math.floor(Math.random() * correctGenderPlayerNames.length)];
	correctGenderPlayerNames = playerNames.NAP.filter(function(element) {
		return element.gender === genderOrder[1];
	});
	playerNamesMap.NAPb = correctGenderPlayerNames[Math.floor(Math.random() * correctGenderPlayerNames.length)];

	return playerNamesMap;
}

const displayCurrentQuestion = function() {
	toggleAnimation("stop");
	setTimeout(function() {
		document.getElementById("questionPage").style.transform = "";
	}, 30)

	document.getElementById("startPage").style.display = "none";
	document.getElementById("questionPage").style.display = "block";
	document.getElementById("answer").style.display = "none";
	document.getElementById("showAnswer").textContent = "Show Answer";

	//Display id.
	document.getElementById("questionId").textContent = "Question " + loadedQuestions.currentQuestion.id;

	let playerNamesMap = getPlayerNamesMap();

	//Submitted by
	if (loadedQuestions.currentQuestion.submitterName) {
		document.getElementById("submittedByField").style.display = "block";
		document.getElementById("submittedBy").textContent = loadedQuestions.currentQuestion.submitterName;
	} else {
		document.getElementById("submittedByField").style.display = "none";
	}

	//Display the question.
	document.getElementById("question").innerHTML = loadedQuestions.currentQuestion.questionHTML;

	//Display answer.
	document.getElementById("answer").innerHTML = loadedQuestions.currentQuestion.answerHTML;

	document.getElementById("pictureRows").style.display = ""; //Needs to exist in order for size calculations to work properly, gets hidden later if mode is none.
	populateCardDisplayArea(loadedQuestions.currentQuestion.includedCards);
	setCardDisplaySize();
	if (sidebarSettings.cardDisplayFormat === "None") {
		changePictureDisplayMode(sidebarSettings.cardDisplayFormat);
	}

	loadedQuestions.pastQuestions[loadedQuestions.currentQuestion.id] = loadedQuestions.currentQuestion;
};

//Add card picture and oracle text displays.
const populateCardDisplayArea = function(oracle) {
	document.getElementById("picturesUnsorted").innerHTML = "";
	document.getElementById("pictureRows").innerHTML = "";

	const defaultDisplayType = document.getElementById("cardDisplayFormat").value.toLowerCase();
	const answerOnlyCards = loadedQuestions.currentQuestion.includedCards.filter(card => !loadedQuestions.currentQuestion.questionSimple.includes(card.name) && loadedQuestions.currentQuestion.answerSimple.includes(card.name));

	for (let card of oracle) {
		if (answerOnlyCards.includes(card)) {
			continue;
		}
		if (defaultDisplayType !== "none") {
			document.getElementById("picturesUnsorted").appendChild(createCardDisplay(card, defaultDisplayType));
		} else {
			document.getElementById("picturesUnsorted").appendChild(createCardDisplay(card, "image"));
		}
	}
}

//Properly format the card displays based on screen size.
const setCardDisplaySize = function() {
	const remSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

	//Remove rows and put all card display containers as children of picturesUnsorted.
	while (document.getElementById("pictureRows").children.length > 0) {
		while (document.getElementById("pictureRows").children[0].children.length > 0) {
			document.getElementById("picturesUnsorted").appendChild(document.getElementById("pictureRows").children[0].children[0]);
		}
		document.getElementById("pictureRows").children[0].remove();
	}
	const imgNum = document.getElementById("picturesUnsorted").children.length;
	//Calculate image width and number of rows nessesery
	let imageWidth = 0,
		rows = 1;
	const getImageWidth = function() {
		imageWidth = (parseInt(getComputedStyle(document.getElementById("pictureRows")).width) / (Math.ceil(imgNum / rows))) - (remSize * (Math.ceil(imgNum / rows)));
		//Impose a maximum image size.
		imageWidth = Math.min(imageWidth, remSize * 14);
		//Minumum size.
		if (imageWidth < (remSize * 9)) {
			rows++;
			getImageWidth();
		}
	};
	getImageWidth();
	//Add the rows.
	for (let i = 0 ; i < rows ; i++) {
		let element = document.createElement("div");
		element.setAttribute("id", "row" + i);
		element.setAttribute("class", "pictureRow");
		document.getElementById("pictureRows").appendChild(element);
	}
	//Add pictures to the rows.
	let currentPic = 0
	while (document.getElementById("picturesUnsorted").children.length > 0) {
		document.getElementById("picturesUnsorted").children[0].style.width = imageWidth + "px";
		document.getElementById("picturesUnsorted").children[0].style.height = (imageWidth * 1.395) + "px";
		document.getElementById("picturesUnsorted").children[0].style.fontSize = (imageWidth / 240 ) + "rem";
		document.getElementById("row" + Math.floor(currentPic / Math.ceil(imgNum / rows))).appendChild(document.getElementById("picturesUnsorted").children[0]);
		currentPic++;
	}
	//Shrink image width to accomodate the scroll bar.
	let newImageWidth = (parseInt(getComputedStyle(document.getElementById("pictureRows")).width) / (Math.ceil(imgNum / rows))) - (remSize * (Math.ceil(imgNum / rows)));
	newImageWidth = Math.min(newImageWidth, remSize * 14);
	if (newImageWidth !== imageWidth) {
		for (let i = 0 ; i < document.getElementsByClassName("cardDisplay").length ; i++) {
			document.getElementsByClassName("cardDisplay")[i].style.width = newImageWidth + "px";
			document.getElementsByClassName("cardDisplay")[i].style.height = (newImageWidth * 1.395) + "px";
		}
	}
	//Move the images to the bottom if the page is small.
	if (rows > 1 && document.getElementById("row0").children.length <= 2) {
		document.getElementById("questionPage").appendChild(document.getElementById("pictureRows"));
		document.getElementById("questionPage").appendChild(document.getElementById("questionIssue"));
	} else {
		document.getElementById("questionPage").appendChild(document.getElementById("questionPageBackgroundBox"));
		document.getElementById("questionPage").appendChild(document.getElementById("questionIssue"));
	}
	//Set the font size.
	const pictureElements = document.querySelectorAll("#pictureRows *");
	for (let i = 0 ; i < pictureElements.length ; i++) {
		pictureElements[i].style.fontSize = (imageWidth / 240) + "rem";
	}
}

//Handle the sidebar image/text/none setting.
const changePictureDisplayMode = function(mode) {
	if (mode === "Image" || mode === "Text") {
		const cardDisplays = document.getElementsByClassName("cardDisplay");
		document.getElementById("pictureRows").style.display = "";
		for (let i = 0 ; i < cardDisplays.length ; i++) {
			cardDisplays[i].setDisplayMode(mode.toLowerCase());
		}
	} else {
		document.getElementById("pictureRows").style.display = "none";
	}
}

window.addEventListener("resize", function() {
	if (loadedQuestions.currentQuestion && loadedQuestions.currentQuestion.includedCards.length > 0) {
		setCardDisplaySize();
	}
});

//Show/hide answer
let answerHeight,
		answerBeingToggled = false;
const toggleAnswer = function() {
	if (answerBeingToggled) {
		return;
	}
	answerBeingToggled = true;
	const scrollPos = document.getElementById("scrollContainer").scrollTop;

	const answerOnlyCards = loadedQuestions.currentQuestion.includedCards.filter(card => !loadedQuestions.currentQuestion.questionSimple.includes(card.name) && loadedQuestions.currentQuestion.answerSimple.includes(card.name));

	if (document.getElementById("answer").style.display === "none") {
		const currentBoxHeight = parseInt(window.getComputedStyle(document.getElementById("questionPageBackgroundBox"), null).getPropertyValue("height"));
		document.getElementById("questionPageBackgroundBox").style.height = currentBoxHeight + "px";

		document.getElementById("answer").style.display = "block";
		document.getElementById("answer").style.position = "absolute";
		answerHeight = document.getElementById("answer").offsetHeight;
		document.getElementById("answer").style.display = "";
		document.getElementById("answer").style.position = "";

		setTimeout(function() {
			const margin = 2 * parseFloat(getComputedStyle(document.documentElement).fontSize);
			document.getElementById("questionPageBackgroundBox").style.height = currentBoxHeight + answerHeight + margin + "px";
			setTimeout(function() {
				document.getElementById("answer").style.display = "block";
				document.getElementById("scrollContainer").scroll({
					top: scrollPos + answerHeight + 50,
					behavior: 'smooth'
				});
				setTimeout(function() {
					document.getElementById("answer").style.opacity = 100;
					answerBeingToggled = false;
				}, 20);
			}, 200);
		}, 20);

		document.getElementById("showAnswer").textContent = "Hide Answer";

		for (let card of answerOnlyCards) {
			document.getElementById("pictureRows").lastChild.appendChild(createCardDisplay(card, document.getElementById("cardDisplayFormat").value.toLowerCase()));
		}
		setCardDisplaySize();
	} else {
		const currentBoxHeight = parseInt(window.getComputedStyle(document.getElementById("questionPageBackgroundBox"), null).getPropertyValue("height"));
		document.getElementById("answer").style.opacity = 0;
		setTimeout(function() {
			const margin = 2 * parseFloat(getComputedStyle(document.documentElement).fontSize);
			document.getElementById("questionPageBackgroundBox").style.height = currentBoxHeight - (answerHeight + margin) + "px";
			document.getElementById("answer").style.display = "none";
			setTimeout(function() {
				answerBeingToggled = false;
			}, 200);
		}, 20);

		document.getElementById("showAnswer").textContent = "Show Answer";
		while (document.getElementById("pictureRows").children.length > 0) {
			while (document.getElementById("pictureRows").children[0].children.length > 0) {
				document.getElementById("picturesUnsorted").appendChild(document.getElementById("pictureRows").children[0].children[0]);
			}
			document.getElementById("pictureRows").children[0].remove();
		}
		for (let card of answerOnlyCards) {
			document.getElementById("picturesUnsorted").removeChild(document.getElementById("picturesUnsorted").lastChild);
		}
		setCardDisplaySize();
	}
	document.getElementById("scrollContainer").scrollTop = scrollPos;
};

let pendingRequest = null;
let awaitingQuestion = false;
window.preloadedImages = [];
setInterval(function() {
	if (loadedQuestions.futureQuestions.length < 2 && !pendingRequest && !getQuestionError) {
		pendingRequest = getRandomQuestion(function(response, request) {
			if (response && !response.error) {
				loadedQuestions.futureQuestions.push(response.questions[0]);
				mostRecentQuestionId = response.questions[0].id;
				/*for (let card of response.oracle) {
					if (["transforming double-faced", "modal double-faced"].includes(card.layout) && card.side === "b") {
						const image = new Image();
						image.src = `https://api.scryfall.com/cards/named?format=image&version=medium&fuzzy=${card.name}&face=back`;
						window.preloadedImages.push(image);
					} else {
						const image = new Image();
						image.src = `https://api.scryfall.com/cards/named?format=image&version=medium&fuzzy=${card.name}`;
						window.preloadedImages.push(image);
					}
				}*/
				getQuestionError = null;
			} else if (response && response.status !== 429) {
				getQuestionError = response.error;
			} else {
				getQuestionError = "There was an unknown error. Please check your internet connection and try again. If the problem persists, please report the issue using the contact form in the upper right.";
			}
			pendingRequest = null;
		});
	}

	if (awaitingQuestion) {
		if (loadedQuestions.futureQuestions.length > 0) {
			loadedQuestions.currentQuestion = loadedQuestions.futureQuestions[0];
			loadedQuestions.futureQuestions.splice(0, 1);
			history.pushState({}, ""); //Add the current page url to the history.
			history.replaceState({}, "", "?" + loadedQuestions.currentQuestion.id);//Set the current url to the new question, replacing old state that we didn't want to get added twice.
			document.querySelector("title").textContent = "RulesGuru #" + loadedQuestions.currentQuestion.id;//This needs to happen after history is edited.
			displayCurrentQuestion();
			awaitingQuestion = false;
		} else if (getQuestionError) {
			awaitingQuestion = false;
			toggleAnimation("stop");
			document.getElementById("questionPage").style.transform = "";
			alert(getQuestionError);
			getQuestionError = null;
			returnToHome(false);
		}
	}
}, 500);

let currentPendingQuestionsListRequest = null;
const doSomethingOnSidebarSettingsUpdate = function() {
	loadedQuestions.futureQuestions = [];
	mostRecentQuestionId = null;
	if (pendingRequest) {
		pendingRequest.abort();
		pendingRequest = null;
	}
	changePictureDisplayMode(document.getElementById("cardDisplayFormat").value);
	getQuestionError = null;

	getQuestionsList(displayQuestionsList);
}

//Move to next question in forward history if there is one, otherwise get a new random question.
const moveToNextQuestion = function() {
	history.forward();
	let popstateHappened = false;
	window.addEventListener("popstate", function(event) {
		popstateHappened = true;
	});
	setTimeout(function() {
		if (!popstateHappened) {
			console.log("Getting a random question");
			displayNextRandomQuestion();
		}
	}, 10);
}

//Function to display the next random question.
const displayNextRandomQuestion = function() {
	//console.log("Logging for issue #104 on Github. (Section 3)")
	//console.log(JSON.stringify(sidebarSettings))
	//console.log(JSON.stringify(loadedQuestions))
	document.getElementById("questionPageBackgroundBox").style.height = "";
	if (sidebarOpen) {
		updateSidebarSettingsOnClose();
		updateSidebarSettings();
	}

	if (loadedQuestions.futureQuestions.length > 0) {
		loadedQuestions.currentQuestion = loadedQuestions.futureQuestions[0];
		loadedQuestions.futureQuestions.splice(0, 1);
		history.pushState({}, ""); //Add the current page url to the history.
		history.replaceState({}, "", "?" + loadedQuestions.currentQuestion.id);//Set the current url to the new question, replacing old state that we didn't want to get added twice.
		document.querySelector("title").textContent = "RulesGuru #" + loadedQuestions.currentQuestion.id;//This needs to happen after history is edited.
		displayCurrentQuestion();
		if (sidebarOpen) {
			closeSidebar();
		}
	} else if (getQuestionError) {
		alert (getQuestionError);
		getQuestionError = null;
	} else {
		toggleAnimation("start", "moveForQuestionsList");
		document.getElementById("questionPage").style.transform = "scale(0)";
		document.getElementById("startPage").style.transform = "scale(0)";
		awaitingQuestion = true;
		if (sidebarOpen) {
			closeSidebar();
		}
	}
}

const returnToHome = function(addToHistory) {
	toggleAnimation("stop");
	document.getElementById("questionPage").style.display = "none";
	document.getElementById("startPage").style.display = "block";
	document.getElementById("startPage").style.transform = "scale(1)";
	document.getElementById("startPage").style.transition = "none";
	if (addToHistory) {
		history.pushState({}, ""); //Add the current page url to the history.
	}
	history.replaceState({}, "", "/");//Set the current url in the history to the homepage, replacing old state that we didn't want to get added twice.
	document.querySelector("title").textContent = "RulesGuru";//This needs to happen after history is edited.

	setTimeout(function() {
		document.getElementById("startPage").style.transition = "transform 0.5s";
	}, 20);
};

//Button handlers:
bindButtonAction(document.getElementById("viewQuestions"), displayNextRandomQuestion);
bindButtonAction(document.getElementById("sidebarViewQuestion"), displayNextRandomQuestion);
bindButtonAction(document.getElementById("submitQuestionButton"), "/submit");
document.getElementById("showAnswer").addEventListener("click", toggleAnswer);
bindButtonAction(document.getElementById("nextQuestion"), displayNextRandomQuestion);
bindButtonAction(document.getElementById("questionIssueButton"), openContactForm);

//Questions list
let questionsListOpen = false;
bindButtonAction(document.getElementById("sidebarShowQuestionsList"), function() {
	closeSidebar();
	if (questionsListOpen) {
		document.getElementById("questionsListArea").style.transform = "translate(-7.9375rem)";
		document.getElementById("moveForQuestionsList").style.width = "";
		document.getElementById("sidebarShowQuestionsList").innerHTML = "Show All";
		questionsListOpen = false;
	} else {
		//getQuestionsList(displayQuestionsList);
		document.getElementById("questionsListArea").style.transform = "translate(0)";
		document.getElementById("moveForQuestionsList").style.width = "calc(100% - 7.9375rem)";
		document.getElementById("sidebarShowQuestionsList").innerHTML = "Hide All";
		questionsListOpen = true;
	}
});

bindButtonAction(document.getElementById("questionsListHideButton"), function() {
	document.getElementById("questionsListArea").style.transform = "translate(-7.9375rem)";
	document.getElementById("moveForQuestionsList").style.width = "";
	document.getElementById("sidebarShowQuestionsList").innerHTML = "Show All";
	questionsListOpen = false;
});

//Make a request for all questions that fit the current parameters.
let getQuestionsListTimeoutId = 0;
const getQuestionsList = function(callback, timeout) {
	if (currentPendingQuestionsListRequest) {
		currentPendingQuestionsListRequest.abort();
	}
	document.getElementById("questionsListDisplay").classList.add("awaitingUpdate");
	let response;
	clearTimeout(getQuestionsListTimeoutId);

	const httpRequest = new XMLHttpRequest();
	httpRequest.timeout = timeout;
	httpRequest.onabort = function() {
		if (!timeout) {
			getQuestionsListTimeoutId = setTimeout(getQuestionsList, 1000, callback);
		}
	};
	httpRequest.onerror = function() {
		if (!timeout) {
			getQuestionsListTimeoutId = setTimeout(getQuestionsList, 1000, callback);
		}
	};
	httpRequest.ontimeout = function() {
		if (!timeout) {
			getQuestionsListTimeoutId = setTimeout(getQuestionsList, 1000, callback);
		}
	};
	httpRequest.onload = function() {
		document.getElementById("questionsListDisplay").classList.remove("awaitingUpdate");
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				const response = JSON.parse(httpRequest.response)
				if (!response.error && callback) {
					callback(response);
				}
			} else {
				if (!timeout) {
					getQuestionsListTimeoutId = setTimeout(getQuestionsList, 1000, callback);
				}
			}
		} else {
			if (!timeout) {
				getQuestionsListTimeoutId = setTimeout(getQuestionsList, 1000, callback);
			}
		}
	};
	httpRequest.open("POST", "/getQuestionsList", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send(JSON.stringify({
		"settings": sidebarSettings
	}));
	currentPendingQuestionsListRequest = httpRequest;
};

const displayQuestionsList = function(questionsList) {
	//document.getElementById("questionsListDisplay").style.height = `${1.13 * questionsList.length}rem`;
	document.getElementById("questionsListDisplay").value = questionsList.join("\n");
	document.getElementById("questionsListDisplay").value += "\n"; //Newline to make the click detenction work.
	document.getElementById("questionsListCount").textContent = questionsList.length + " Matching Questions";
}

//Load a question when clicked in the questions list.
document.getElementById("questionsListDisplay").addEventListener("mouseup", function(event) {
 if (event.offsetX < this.clientWidth){ // Ignore a click on scrollbar
	  const lineNum = this.value.substr(0, this.selectionStart).split("\n").length;
		const questionIdToNavigateTo = parseInt(this.value.split("\n")[lineNum - 1]);
	  if (!isNaN(questionIdToNavigateTo)) {
		  document.getElementById("questionPage").style.transform = "scale(0)";
		  document.getElementById("startPage").style.transform = "scale(0)";
			history.pushState({}, ""); //Add the current page url to the history.
			history.replaceState({}, "", "?" + questionIdToNavigateTo);//Set the current url to the new question, replacing old state that we didn't want to get added twice.
			document.querySelector("title").textContent = "RulesGuru #" + questionIdToNavigateTo;//This needs to happen after history is edited.
		  goToQuestion(questionIdToNavigateTo);
	  }
 }
});

//Prevent double-clicking in the questions list from selecting text.
document.getElementById("questionsListDisplay").addEventListener("mousedown", function(event) {
	if (event.detail > 1) {
		event.preventDefault();
	}
});
getQuestionsList(displayQuestionsList)

//Secret booth mode.
let boothKeysPressed = "";
let boothActive = false;
let testLength;
let testQuestionsCompleted = 0;
let testQuestionsCorrectCount = 0;
document.addEventListener("keypress", function(event) {
	if (document.activeElement.tagName !== "TEXTAREA" && document.activeElement.tagName !== "INPUT") {
		boothKeysPressed += event.key;
		if (boothKeysPressed.slice(-5).toLowerCase() === "booth") {
			if (boothActive) {
				boothActive = false;
				document.getElementById("boothInfo").style.display = "none";
			} else {
				boothActive = true;
				testLength = Number(prompt("How many questions in this test?"));
				while (isNaN(testLength) || !Number.isInteger(testLength)) {
					testLength = Number(prompt("That wasn't an integer. How many questions in this test?"));
				}
				testQuestionsCompleted = 0;
				testQuestionsCorrectCount = 0;
				document.getElementById("boothInfo").style.display = "block";
				updateTestData();
			}
		}
	}
});

const updateTestData = function() {
	document.getElementById("testLength").textContent = testLength;
	document.getElementById("testQuestionsCompleted").textContent = testQuestionsCompleted;
	document.getElementById("testQuestionsCorrectCount").textContent = testQuestionsCorrectCount;
};

const proceedInTest = function() {
	if (testQuestionsCompleted === testLength) {
		const percentage = Math.round((testQuestionsCorrectCount / testQuestionsCompleted) * 100);
		alert(`All done! Your final score is ${percentage}%.`);
		boothActive = false;
		document.getElementById("boothInfo").style.display = "none";
	} else {
		displayNextRandomQuestion();
	}
};

const handleTestQuestionCorrect = function() {
	testQuestionsCompleted++;
	testQuestionsCorrectCount++;
	updateTestData();
	setTimeout(proceedInTest, 0);
};

const handleTestQuestionIncorrect = function() {
	testQuestionsCompleted++;
	updateTestData();
	setTimeout(proceedInTest, 0);
};

document.getElementById("testQuestionCorrect").addEventListener("click", handleTestQuestionCorrect);

document.getElementById("testQuestionIncorrect").addEventListener("click", handleTestQuestionIncorrect);

//Keyboard shortcuts
document.addEventListener("keydown", function(event) {
	if (document.activeElement.tagName !== "TEXTAREA" && document.activeElement.tagName !== "INPUT") {
		if (event.key === "ArrowRight") {
			moveToNextQuestion();
		} else if (event.key === "ArrowLeft") {
			history.back();
		} else if (["ArrowUp", "ArrowDown", " "].includes(event.key)) {
			toggleAnswer();
			event.preventDefault();
		} else if (boothActive) {
			if (event.key === "=") {
				handleTestQuestionCorrect();
			} else if (event.key === "-") {
				handleTestQuestionIncorrect();
			}
		}
	}
})
