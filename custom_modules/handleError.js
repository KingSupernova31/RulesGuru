const nodemailer = require("nodemailer"),
			fs = require("fs"),
			path = require("path"),
			emailAuth = JSON.parse(fs.readFileSync(path.join(__dirname, "../externalCredentials.json"), "utf8")).email,
			transporter = nodemailer.createTransport({
				"host": "smtp.zoho.com",
				"port": 465,
				"secure": true,
				"auth": emailAuth.pass,
			});

//General error handling function- puts the error in the console and emails it to me.
const handleError = function(error) {
	console.error(error)
	if (emailAuth.pass.trim() === "") {
		console.log("No email credentials, aborting email.");
		return;
	}
	const allAdmins = JSON.parse(fs.readFileSync("admins.json", "utf8"));
	for (let i in allAdmins) {
		if (allAdmins[i].roles.owner) {
			transporter.sendMail({
				from: emailAuth.user,
				to: allAdmins[i].emailAddress,
				subject: "Disaster!",
				text: error.stack
			}, function(emailError) {
				if (emailError) {
					console.log("Meta-error: email could not be sent!");
					console.error(emailError);
				}
			});
		}
	}
}

module.exports = handleError;
