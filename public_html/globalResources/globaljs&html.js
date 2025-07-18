"use strict";

document.querySelector("head").insertAdjacentHTML("beforeend", `
<title>RulesGuru</title>
<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
<link rel="manifest" href="/favicons/site.webmanifest">
<link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#000000">
<link rel="shortcut icon" href="/favicons/favicon.ico">
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="msapplication-config" content="/favicons/browserconfig.xml">
<meta name="theme-color" content="#ffffff">
<link rel="preload" as="image" href="/globalResources/icons/about-hover.png">
<link rel="preload" as="image" href="/globalResources/icons/contact-hover.png">
<link rel="preload" as="image" href="/globalResources/icons/donate-hover.png">
<link rel="preload" as="image" href="/globalResources/icons/twitter-hover.png">
<link rel="preload" as="image" href="/globalResources/icons/settings-hover.png">
`);

document.querySelector("body").insertAdjacentHTML("beforeend", `
<div id="topBanner">
	<h1 id="bannerName"><span id="bannerName0">Rules</span><span id="bannerName1">Guru</span></h1>
	<h1 id="bannerNameMobile"><span id="bannerNameMobile0">R</span><span id="bannerNameMobile1">G</span></h1>
	<div id="topBannerRightText">
		<a href="/about" id="aboutLink">
			<img src="/globalResources/icons/about.png" class="bannerImage">
			<p id="aboutLinkText">About</p>
		</a>
		<div id="openContactFormButton">
			<img src="/globalResources/icons/contact.png" class="bannerImage">
			<p>Contact Us</p>
		</div>
		<div id="donations">
			<img src="/globalResources/icons/donate.png" class="bannerImage">
			<p>Donate</p>
		</div>
		<a href="https://twitter.com/MTGRulesGuru" target=”_blank” id="followLink">
			<img src="/globalResources/icons/twitter.png" class="bannerImage">
			<p id="followLinkText">Follow</p>
		</a>
	</div>
</div>
<div id="contactFormPopupArea">
	<div id="contactFormPopup" class="roundedCorners">
		<textarea id="contactFormContent" placeholder="Your message. If you'd like a response, please provide your email address below."></textarea>
		<input type="email" id="contactFormEmailField" placeholder="Email address"></input>
		<button id="contactFormSubmitButton" class="specialButtonBlack">Send</button>
	</div>
	<div id="contactFormSubmissionSuccess" class="roundedCorners">
		<p>Thank you for your message!</p>
	</div>
	<div id="contactFormSubmissionFailure" class="roundedCorners">
		<div id="contactFormSubmissionFailureCenter">
			<p>There was an error sending your message, please try again later. If the error persists, email us at admin@rulesguru.net.</p>
			<button class="specialButtonWhite" onclick="document.getElementById('contactFormSubmissionFailure').style.display = 'none';">Dismiss</button>
		</div>
	</div>
</div>
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" id="donateForm">
	<input type="hidden" name="cmd" value="_s-xclick">
	<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
		">
</form>
`);

//Open the contact form with the question ID if applicable.
const openContactForm = function() {
	document.getElementById("contactFormEmailField").value = localStorage.getItem("contactFormEmail");

	const contactFormContent = document.getElementById("contactFormContent");
	if (window.location.href.includes("?") && (contactFormContent.value === "" || /^Message about question #\d+:\n*$/.test(document.getElementById('contactFormContent').value))) {
		contactFormContent.value = `Message about question #${window.location.href.match(/\d+$/)[0]}:\n\n`;
		contactFormContent.setSelectionRange(contactFormContent.value.length, contactFormContent.value.length);
	}
	document.getElementById('contactFormPopup').style.display = 'block';
	contactFormContent.focus();
	setTimeout(function() {contactFormIsOpen = true;}, 0);
}

let contactFormIsOpen = false;

document.addEventListener("mousedown", function(event) {
	if (contactFormIsOpen) {
		if (!document.getElementById("contactFormPopup").contains(event.target)) {
			document.getElementById("contactFormPopup").style.display = "none";
			setTimeout(function() {contactFormIsOpen = false}, 1);
		}
	}
});
document.addEventListener("touchstart", function(event) {
	if (contactFormIsOpen) {
		if (!document.getElementById("contactFormPopup").contains(event.target)) {
			document.getElementById("contactFormPopup").style.display = "none";
			setTimeout(function() {contactFormIsOpen = false}, 1);
		}
	}
});

//Handle left clicks, middle clicks, and pressing enter on buttons. Strings as the "action" are treated as a url to open, funtions are executed regardless of the type of click/press.
const bindButtonAction = function(element, action) {
	element.addEventListener("mouseup", function(event) {
		if (typeof action === "string") {
			if (event.button === 0) {
				location.href = action;
			} else if (event.button === 1) {
				window.open(action);
			}
		}
		if (typeof action === "function") {
			action(event);
		}
	});
	element.addEventListener("keyup", function(event) {
		if (event.keyCode === 13) {
			if (typeof action === "string") {
				if (event.button === 0) {
					location.href = action;
				} else if (event.button === 1) {
					window.open(action);
				}
			}
			if (typeof action === "function") {
				action(event);
			}
		}
	});
	element.addEventListener("touchend", function(event) {
		if (typeof action === "string") {
			location.href = action;
		}
		if (typeof action === "function") {
			action(event);
		}
	});
}

//Handle tooltips.
let delay = 0;
const mousemoveTooltip = function(event) {
	if (delay < 2) {
		delay++;
		return;
	} else {
		delay = 0;
	}

	//Get a list of all parents plus the original target.
	const branch = [];
	let element = event.target;
	while (element) {
		 branch.push(element);
		 element = element.parentNode;
	}
	//Display the tooltips.
	for (let i = 0 ; i < document.getElementsByClassName("tooltip").length ; i++) {
		document.getElementsByClassName("tooltip")[i].remove();
	}
	for (let i = 0 ; i < branch.length ; i++) {
		if (branch[i].getAttribute && branch[i].getAttribute("tooltip")) {
			const tooltipToDisplay = document.createElement("p");
			tooltipToDisplay.setAttribute("class", "tooltip");
			tooltipToDisplay.innerHTML = branch[i].getAttribute("tooltip");
			document.body.appendChild(tooltipToDisplay);

			tooltipToDisplay.style.display = "block";

			const setXPos = function(tooltip, pos) {
				tooltip.style.left = pos + "px";
				if (tooltip.getBoundingClientRect().right > document.documentElement.clientWidth) {
					setXPos(tooltip, pos - 1)
				}
			}
			setXPos(tooltipToDisplay, event.pageX + 10);

			const setYPos = function(tooltip, pos) {
				tooltip.style.top = pos + "px";
				if (tooltip.getBoundingClientRect().top < 0) {
					setYPos(tooltip, pos + 1)
				}
			}
			setYPos(tooltipToDisplay, event.pageY - tooltipToDisplay.getBoundingClientRect().height - 10);

		}
	}
}

document.addEventListener("mousemove", mousemoveTooltip);
//Touch devices have tooltips disabled.
document.addEventListener("touchstart", function touchDetect(event) {
	document.removeEventListener("mousemove", mousemoveTooltip);
	document.removeEventListener("touchstart", touchDetect);
});

//Button handlers:
bindButtonAction(document.getElementById("bannerName"), "/");
bindButtonAction(document.getElementById("bannerNameMobile"), "/");
bindButtonAction(document.getElementById("donations"), function() {
	document.getElementById('donateForm').submit();
});
document.getElementById("openContactFormButton").addEventListener("click", openContactForm);
bindButtonAction(document.getElementById("contactFormSubmitButton"), async function(event) {
	document.getElementById("contactFormPopup").style.display = "none";
	if (document.getElementById("contactFormContent").value && !/^Message about question #\d+:\n*$/.test(document.getElementById("contactFormContent").value)) {
		localStorage.setItem("contactFormEmail", document.getElementById("contactFormEmailField").value);
		try {
			const response = await fetch("/submitContactForm", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				signal: AbortSignal.timeout(6000),
				body: JSON.stringify({
					"returnEmail": document.getElementById("contactFormEmailField").value,
					"message": document.getElementById("contactFormContent").value
				})
			});
			if (!response.ok) {throw new Error(response.statusText);}
			displayContactFormSuccessMessage();
		} catch (e) {
			console.error(e);
			document.getElementById("contactFormSubmissionFailure").style.display = "block";
		}
	}
});

const displayContactFormSuccessMessage = function() {
	let counter = 0;
	let intervalId = setInterval(function() {
		if (counter === 0) {
			document.getElementById("contactFormSubmissionSuccess").style.display = "block";
		}
		if (counter <= 100) {
			document.getElementById("contactFormSubmissionSuccess").style.opacity = counter / 100;
		}
		if (counter >= 400) {
			document.getElementById("contactFormSubmissionSuccess").style.opacity = (500 - counter) / 100;
		}
		if (counter === 500) {
			document.getElementById("contactFormSubmissionSuccess").style.display = "none";
			clearInterval(intervalId);
		}
		counter++;
	}, 10);
	document.getElementById("contactFormContent").value = "";
}

//Returns true if the element or one of its parents has the class "classname".
const hasParentWithClass = function(element, className) {
	if (element.classList && element.classList.contains(className)) {
		return true;
	}
	return element.parentNode && hasParentWithClass(element.parentNode, className);
}

document.addEventListener("DOMContentLoaded", function() {
	document.getElementById("FOUCOverlay").style.display = "none";
});

//Secret go to editor.
let keysPressed = "";
document.addEventListener("keypress", function(event) {
	if (document.activeElement.tagName !== "TEXTAREA" && document.activeElement.tagName !== "INPUT") {
		keysPressed += event.key;
		if (keysPressed.slice(-4).toLowerCase() === "edit") {
			//Need both typeof checks for pages where loadedQuestions doesn't exist at all.
			if (typeof loadedQuestions === "object" && typeof loadedQuestions.currentQuestion === "object" && loadedQuestions.currentQuestion) {
				window.location = "/question-editor/?" + loadedQuestions.currentQuestion.id;
			} else {
				window.location = "/question-editor";
			}
		}
	}
})

//Array radomizer. Shuffles in place.
const shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
}

if (document.getElementById("contactFormTextLink")) {
	bindButtonAction(document.getElementById("contactFormTextLink"), openContactForm);
}