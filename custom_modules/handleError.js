const nodemailer = require("nodemailer"),
			fs = require("fs"),
			transporter = nodemailer.createTransport({
				"host": "smtp.zoho.com",
				"port": 465,
				"secure": true,
				"auth": JSON.parse(fs.readFileSync("externalCredentials.json", "utf8")).email
			});

//General error handling function- puts the error in the console and emails it to me.
const handleError = function(error) {
	if (!error instanceof Error) {
		handleError(new Error(`Yo dawg I heard you liked errors so I put an error in yo error. Original error: ${error}`));
		return;
	}

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
					console.log("Error email could not be sent!");
					console.error(emailError)
				}
			});
		}
	}
}

module.exports = handleError;
