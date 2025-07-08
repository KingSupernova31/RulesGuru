"use strict";

const sleep = function(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const validateQuestion = function(question, submitterName) {
	if (!question || question.length < 3) {
		alert("Please include a question.");
		return false;
	}
	return true;
}

const submitQuestionToServer = async function(question, submitterName) {
	if (!currentlyHaveConnection) {
		throw new Error("No internet connection.");
	}

	return fetch("/submitQuestion", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		signal: AbortSignal.timeout(3000),
		body: JSON.stringify({ question, submitterName })
	});
}

const handleSubmitButton = async function() {
	localStorage.setItem("contactFormName", document.getElementById("name").value);

	const question = document.getElementById("question").value;
	const submitterName = document.getElementById("name").value;

	if (!validateQuestion(question, submitterName)) {
		return;
	}

	if (currentlyHaveConnection) {
		document.getElementById("cursorStyle").innerHTML = "* {cursor: wait !important;}";
		document.getElementById("submitButton").disabled = true;

		try {
			const response = await submitQuestionToServer(question, submitterName);
			if (response.ok) {
				const body = await response.text();
				alert(body);
				document.getElementById("question").value = "";
			} else {
				throw new Error(`Server responded with status ${response.status}`);
			}
		} catch (error) {
			console.error(error);
			alert(`There was an error submitting your question: ${error.message}. If this issue continues, please report it via the contact form in the upper right.`);
		}
	} else {
		saveLocally(question, submitterName);
		document.getElementById("question").value = "";
		alert(`Could not connect to the server. Your question has been saved locally and will be automatically submitted once connection is reestablished.`);
	}

	document.getElementById("submitButton").disabled = false;
	document.getElementById("cursorStyle").innerHTML = "";
}

const saveLocally = function(question, submitterName) {
	const backlog = JSON.parse(localStorage.getItem("submissionBacklog")) || [];
	backlog.push({
		"question": question,
		"submitterName": submitterName,
	});
	localStorage.setItem("submissionBacklog", JSON.stringify(backlog));
}

const compressMobileNameDescription = function() {
	if (document.getElementById("name").clientWidth < parseFloat(getComputedStyle(document.documentElement).fontSize) * 20) {
		document.getElementById("name").placeholder = "Name. (Optional)";
	} else {
		document.getElementById("name").placeholder = "Name. (Optional, if you'd like to be credited.)";
	}
}

document.addEventListener("keypress", function(event) {
	if (document.activeElement.tagName === "TEXTAREA" || document.activeElement.tagName === "INPUT") {
		if (!event.shiftKey && event.key === "Enter") {
			event.preventDefault();
			handleSubmitButton();
		}
	}
});

let currentlyHaveConnection = true;
const connectionTest = async function() {
	while (true) {
		try {
			await fetch(location.href, {
				method: "HEAD",
				cache: "no-cache",
				signal: AbortSignal.timeout(5000),
			});
			currentlyHaveConnection = true;
		} catch (e) {
			currentlyHaveConnection = false;
		}
		await sleep(1000);
	}
};
connectionTest();

const handleBacklog = async function() {
	while (true) {
		if (!currentlyHaveConnection) {
			await sleep(5000);
			continue;
		}
		const backlog = JSON.parse(localStorage.getItem("submissionBacklog")) || [];
		if (backlog.length === 0) {
			await sleep(5000);
			continue;
		} else {
			const { question, submitterName } = backlog.shift();
			try {
				const response = await submitQuestionToServer(question, submitterName);
				if (response.ok) {
					console.log(await response.text());
				} else {
					throw new Error(`Server responded with status ${response.status}`);
				}
			} catch (error) {
				console.log(`Failed to submit backlog question`);
				console.error(error);
				backlog.unshift({ question, submitterName });
			}
			localStorage.setItem("submissionBacklog", JSON.stringify(backlog));
		}
		await sleep(500);
	}
};
handleBacklog();

compressMobileNameDescription();

document.getElementById("name").value = localStorage.getItem("contactFormName");

document.getElementById("question").focus();
