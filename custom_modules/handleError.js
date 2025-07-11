const nodemailer = require("nodemailer"),
	fs = require("fs"),
	path = require("path"),
	util = require("util");

const rootDir = path.join(__dirname, "..");

let emailAuth;
try {
	emailAuth = JSON.parse(fs.readFileSync(path.join(rootDir, "privateData.json"), "utf8")).email;
	if (emailAuth.user.trim().length === 0 || emailAuth.pass.trim().length === 0) {
		throw new Error("No email credentials");
	}
} catch (e) {
	emailAuth = null;
}

const transporter = nodemailer.createTransport({
	"host": "smtp.zoho.com",
	"port": 465,
	"secure": true,
	"auth": emailAuth,
});

const sendMail = util.promisify(transporter.sendMail.bind(transporter));

//General error handling function- puts the error in the console and emails it to me.
const handleError = async function(error, silent = false) {
	if (!silent) {
		console.error(error)
	}
	if (emailAuth === null) {
		console.log("No RulesGuru email credentials, aborting error email.");
		return;
	}

	let allAdmins;
	if (fs.existsSync(path.join(rootDir, "data_files/admins.json"))) {
		allAdmins = JSON.parse(fs.readFileSync(path.join(rootDir, "data_files/admins.json"), "utf8"));
	} else {
		allAdmins = [];
	}
	const allOwners = allAdmins.filter(admin => admin.roles.owner);
	if (allOwners.length === 0) {
		console.log("No owners to email.")
	} else {
		const sendPromises = [];
		for (let owner of allOwners) {
			const mailOptions = {
				from: emailAuth.user,
				to: owner.emailAddress,
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
		await Promise.all(sendPromises);
	}
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
