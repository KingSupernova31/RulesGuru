const nodemailer = require("nodemailer"),
	fs = require("fs"),
	path = require("path"),
	util = require("util"),
	emailAuth = JSON.parse(fs.readFileSync(path.join(__dirname, "../externalCredentials.json"), "utf8")).email,
	transporter = nodemailer.createTransport({
		"host": "smtp.zoho.com",
		"port": 465,
		"secure": true,
		"auth": emailAuth,
	});

const sendMail = util.promisify(transporter.sendMail.bind(transporter));

const rootDir = path.join(__dirname, "..");

//General error handling function- puts the error in the console and emails it to me.
const handleError = async function(error) {
	console.error(error)
	if (emailAuth.pass.trim() === "") {
		console.log("No email credentials, aborting email.");
		return;
	}
	const allAdmins = JSON.parse(fs.readFileSync(path.join(rootDir, "admins.json"), "utf8"));
	const sendPromises = [];
	for (let admin of allAdmins) {
		if (admin.roles.owner) {
			const mailOptions = {
				from: emailAuth.user,
				to: admin.emailAddress,
				subject: "Disaster!",
				text: error.stack
			};
			sendPromises.push(
				sendMail(mailOptions).catch(emailError => {
					console.log("Meta-error: email could not be sent!");
					console.error(emailError);
				})
			);
		}
	}

	await Promise.all(sendPromises);
}

//Make this function be used for all exceptions.
process.on("warning", (err) => {
	handleError(err);
});
process.on("uncaughtException", async (err) => {
	await handleError(err);
	process.exit(1)
});
process.on("unhandledRejection", async (reason, promise) => {
  await handleError(reason);
  process.exit(1);
});

module.exports = handleError;
