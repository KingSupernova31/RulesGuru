"use strict";

const sqlite = require("sqlite3").verbose(),
			fs = require("fs"),
			util = require("util"),
			nodemailer = require("nodemailer"),
			path = require("path"),
			handleError = require("./handleError.js"),
			emailAuth = JSON.parse(fs.readFileSync(path.join(__dirname, "../privateData.json"), "utf8")).email,
			transporter = nodemailer.createTransport({
				"host": "smtp.zoho.com",
				"port": 465,
				"secure": true,
				"auth": emailAuth
			}),
			getUnfinishedQuestion = require("./getUnfinishedQuestion.js");

const rootDir = path.join(__dirname, "..");

const handleEmails = function(peopleToEmail) {
	const db = new sqlite.Database(path.join(rootDir, "data_files/questions.db"), async function(err) {
		if (err) {
			handleError(err);
		} else {
			const promisifiedAll = util.promisify(db.all),
						dbAll = async function(arg1, arg2) {
							const result = await promisifiedAll.call(db, arg1, arg2);
							return result;
						};

			let allQuestions = await dbAll(`SELECT * FROM questions`);

			for (let i in peopleToEmail) {

				const result = getUnfinishedQuestion(peopleToEmail[i], allQuestions);

				if (result === false) {
					transporter.sendMail({
						from: emailAuth.user,
						to: peopleToEmail[i].emailAddress,
						subject: "There are no RulesGuru questions needing your attention today!",
						text: `Hi ${peopleToEmail[i].name.split(" ")[0]},\n\nThanks to your help, we've approved the entire database of unfinished questions that need your attention, and there is currently nothing for you to do. I'm sure this will change soon as more questions get submitted. In the mean time, take a while to relax and look over the following images.\n\nhttps://www.google.com/search?tbm=isch&q=cute+bunny+pictures`
					}, function(err) {
						if (err) {
							handleError(err);
						} else {
							console.log(`Successfully sent email to ${peopleToEmail[i].name}`);
						}
					});
				} else {

					transporter.sendMail({
						from: emailAuth.user,
						to: peopleToEmail[i].emailAddress,
						subject: `Your RulesGuru question to approve`,
						text: `Hi ${peopleToEmail[i].name.split(" ")[0]},\n\nYour question today is #${result.id}. Head on over to https://rulesguru.org/question-editor/?${result.id} and check it out!`
					}, function(err) {
						if (err) {
							handleError(err);
						} else {
							console.log(`Successfully sent email to ${peopleToEmail[i].name}`);
						}
					});

				}
			}
		};
	});
}

try {
	const adminsFilePath = path.join(rootDir, "data_files/admins.json");
	const allAdmins = fs.existsSync(adminsFilePath) ? JSON.parse(fs.readFileSync(adminsFilePath, "utf8")) : [];
	const peopleToEmail = [];
	for (let i in allAdmins) {
		let sendEmail = false;
		switch (allAdmins[i].reminderEmailFrequency) {
			case "Never":
				break;
			case "Daily":
				sendEmail = true;
				break;
			case "Daily except weekends":
				if ([1, 2, 3, 4, 5].includes(new Date().getDay())) {
					sendEmail = true;
				}
				break;
			case "Every two days":
				if (Math.floor(Date.now() / 86400000) % 2 === 0) {
					sendEmail = true;
				}
				break;
			case "Every three days":
				if (Math.floor(Date.now() / 86400000) % 3 === 0) {
					sendEmail = true;
				}
				break;
			case "Every Sunday and Tuesday":
				if ([0, 2].includes(new Date().getDay())) {
					sendEmail = true;
				}
				break;
			case "Every Tuesday and Friday":
				if ([2, 5].includes(new Date().getDay())) {
					sendEmail = true;
				}
				break;
			case "Weekly":
				if (new Date().getDay() === 0) {
					sendEmail = true;
				}
				break;
		}
		if (sendEmail) {
			peopleToEmail.push(allAdmins[i]);
		}
	}
  handleEmails(peopleToEmail);
} catch (err) {
	handleError(err)
}