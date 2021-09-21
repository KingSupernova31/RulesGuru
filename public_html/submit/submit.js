"use strict";

let requestObj = {};

const submit = function() {
	document.getElementById("submit").disabled=true;
	document.getElementById("cursorStyle").innerHTML = "* {cursor: wait !important;}";
	requestObj.question = document.getElementById("question").value;
	requestObj.answer = document.getElementById("answer").value;
	requestObj.submitterName = document.getElementById("name").value;
	//Validate the submission.
	if (requestObj.question.length < 10) {
		alert("You must include a valid question.");
		document.getElementById("cursorStyle").innerHTML = "";
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
		alert("There was an error submitting your question. (Request aborted.) Your question has been saved locally and will be automatically submitted once possible. If you're sure that you have an internet connection and the problem persists, please report the issue using the contact form in the upper right.");
		document.getElementById("cursorStyle").innerHTML = "";
		clearFields()
	}
	httpRequest.onerror = function() {
		addToSubmissionBacklog(requestObj);
		handleSubmissionBacklog(5000);
		alert("There was an unknown error submitting your question. Your question has been saved locally and will be automatically submitted once possible. If you're sure that you have an internet connection and the problem persists, please report the issue using the contact form in the upper right.");
		document.getElementById("cursorStyle").innerHTML = "";
		clearFields()
	}
	httpRequest.ontimeout = function() {
		addToSubmissionBacklog(requestObj);
		handleSubmissionBacklog(5000);
		alert("There was an error submitting your question. (Request timed out.) Your question has been saved locally and will be automatically submitted once possible. If you're sure that you have an internet connection and the problem persists, please report the issue using the contact form in the upper right.");
		document.getElementById("cursorStyle").innerHTML = "";
		clearFields()
	}
	httpRequest.onload = function() {
		if (httpRequest.status === 200) {
			if (httpRequest.response) {
				alert(httpRequest.response);
				if (!httpRequest.response.includes("error")) {
					clearFields();
				}
				document.getElementById("cursorStyle").innerHTML = "";
			} else {
				alert("There was an error submitting your question. (Server returned no response.) Please report this error using the contact form in the upper right.");
				document.getElementById("cursorStyle").innerHTML = "";
			}
		} else {
			alert(`There was an error submitting your question. (Server returned status code "${httpRequest.status}".) Please report this error using the contact form in the upper right.`);
			document.getElementById("cursorStyle").innerHTML = "";
		}
	}
	httpRequest.open("POST", "/submitQuestion", true);
	httpRequest.setRequestHeader("Content-Type", "application/json");
	httpRequest.send(JSON.stringify(requestObj));
	localStorage.setItem("contactFormName", document.getElementById("name").value);
	document.getElementById("submit").disabled=false;
}

const clearFields = function() {
	document.getElementById("question").value = "";
	document.getElementById("answer").value = "";
}

const compressMobileNameDescription = function() {
	if (document.getElementById("name").clientWidth < parseFloat(getComputedStyle(document.documentElement).fontSize) * 30) {
		document.getElementById("name").placeholder = "Name (optional)";
	} else {
		document.getElementById("name").placeholder = "Enter your name if you'd like to be credited for this question";
	}
}
document.onload = compressMobileNameDescription;

document.getElementById("name").value = localStorage.getItem("contactFormName");
