const answerButtons = document.getElementsByClassName("answerButton");
for (let i = 0 ; i < answerButtons.length ; i++) {
	answerButtons[i].addEventListener("click", function() {
		if (this.textContent.startsWith("Show")) {
			if (Array.from(this.nextElementSibling.classList).includes("blankAnswer")) {
				this.nextElementSibling.style.visibility = "visible";
			} else {
				this.nextElementSibling.style.display = "block";
			}
			this.textContent = this.textContent.replace("Show", "Hide");
			this.style.marginBottom = "0";
		} else {
			if (Array.from(this.nextElementSibling.classList).includes("blankAnswer")) {
				this.nextElementSibling.style.visibility = "hidden";
			} else {
				this.nextElementSibling.style.display = "none";
			}
			this.textContent = this.textContent.replace("Hide", "Show");
			this.style.marginBottom = "3rem";
		}
	});
}