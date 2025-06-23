"use strict";

let requestObj = {};

let submissionOngoing = false;
const submit = function(question, answer, submitterName) {
	if (submissionOngoing) {
		return;
	}
	submissionOngoing = true;
	document.getElementById("cursorStyle").innerHTML = "* {cursor: wait !important;}";
	requestObj.question = question || document.getElementById("question").value;
	requestObj.answer = answer || "";
	requestObj.submitterName = submitterName || document.getElementById("name").value;
	//Validate the submission.
	if (requestObj.question.length < 10) {
		alert("You must include a valid question.");
		document.getElementById("cursorStyle").innerHTML = "";
		submissionOngoing = false;
		return;
	}
	//Send the request.
	const httpRequest = new XMLHttpRequest();
	httpRequest.timeout = 5000;
	const addToSubmissionBacklog = function(question) {
		const backlog = JSON.parse(localStorage.getItem("submissionBacklog")) || [];
		backlog.push(question);
		localStorage.setItem("submissionBacklog", JSON.stringify(backlog));
	}
	httpRequest.onabort = function() {
		addToSubmissionBacklog(requestObj);
		handleSubmissionBacklog(5000);
		alert("There was an error submitting your question. (Request aborted.) Your question has been saved locally and will be automatically submitted once possible. Please report the issue using the contact form in the upper right.");
		document.getElementById("cursorStyle").innerHTML = "";
		clearFields();
		submissionOngoing = false;
	}
	httpRequest.onerror = function() {
		addToSubmissionBacklog(requestObj);
		handleSubmissionBacklog(5000);
		alert("You do not have internet access at the moment. Your question has been saved locally and will be automatically submitted once possible. If you're sure that you have an internet connection and the problem persists, please report the issue using the contact form in the upper right.");
		document.getElementById("cursorStyle").innerHTML = "";
		clearFields();
		submissionOngoing = false;
	}
	httpRequest.ontimeout = function() {
		addToSubmissionBacklog(requestObj);
		handleSubmissionBacklog(5000);
		alert("There was an error submitting your question. (Request timed out.) Your question has been saved locally and will be automatically submitted once possible. If you're sure that you have an internet connection and the problem persists, please report the issue using the contact form in the upper right.");
		document.getElementById("cursorStyle").innerHTML = "";
		clearFields();
		submissionOngoing = false;
	}
	httpRequest.onload = function() {
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				if (!question) {
					alert(httpRequest.response);
				} else {
					console.log(httpRequest.response);
				}
				if (!httpRequest.response.includes("error")) {
					clearFields();
				}
			} else {
				alert("There was an error submitting your question. (Server returned no response.) Please report this error using the contact form in the upper right.");
			}
			document.getElementById("cursorStyle").innerHTML = "";
			submissionOngoing = false;
		} else {
			alert(`There was an error submitting your question. (Server returned status code "${httpRequest.status}".) Please report this error using the contact form in the upper right.`);
			document.getElementById("cursorStyle").innerHTML = "";
			submissionOngoing = false;
		}
	}
	httpRequest.open("POST", "/submitQuestion", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send(JSON.stringify(requestObj));
	localStorage.setItem("contactFormName", document.getElementById("name").value);
}

const clearFields = function() {
	document.getElementById("question").value = "";
}

const compressMobileNameDescription = function() {
	if (document.getElementById("name").clientWidth < parseFloat(getComputedStyle(document.documentElement).fontSize) * 20) {
		document.getElementById("name").placeholder = "Name. (Optional)";
	} else {
		document.getElementById("name").placeholder = "Name. (Optional, if you'd like to be credited.)";
	}
}
document.onload = compressMobileNameDescription;

document.getElementById("name").value = localStorage.getItem("contactFormName");

document.addEventListener("keypress", function(event) {
	if (document.activeElement.tagName === "TEXTAREA" || document.activeElement.tagName === "INPUT") {
		if (!event.shiftKey && event.key === "Enter") {
			event.preventDefault();
			submit();
		}
	}
});

//Not used normally, here for my use in the console when I want to submit a large dump of questions.
const submitLots = function(questions) {
	const job = setInterval(function() {
		if (!submissionOngoing) {
			const question = questions.pop();
			submit(question.question, question.answer, question.submitterName);
		}
		if (questions.length === 0) {
			clearInterval(job);
		}
	}, 1000);
};

document.getElementById("question").focus();