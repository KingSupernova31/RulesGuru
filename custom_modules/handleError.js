const nodemailer = require("nodemailer"),
			fs = require("fs"),
			transporter = nodemailer.createTransport(JSON.parse(fs.readFileSync("emailCredentials.json", "utf8")));

//General error handling function- puts the error in the console and emails it to me.
const handleError = function(error) {
	console.error(error)
	const allAdmins = JSON.parse(fs.readFileSync("admins.json", "utf8"));
	for (let i in allAdmins) {
		if (allAdmins[i].roles.owner) {
			transporter.sendMail({
				from: "admin@rulesguru.net",
				to: allAdmins[i].emailAddress,
				subject: "Disaster!",
				text: error.stack
			}, function(emailError) {
				if (emailError) {
					console.log("Double disaster!");
					console.error(emailError)
					transporter.sendMail({
						from: "admin@rulesguru.net",
						to: "admin@rulesguru.net",
						subject: "Double disaster!",
						text: `Original error:\n\n${error.stack}\n\nEmail error:\n\n${emailError.stack}`
					}, function(err) {
						if (err) {
							console.log("Triple disaster. This is bad.");
							console.error(err)
						}
					});
				}
			});
		}
	}
}

module.exports = handleError;
