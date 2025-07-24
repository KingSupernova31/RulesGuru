const nodemailer = require("nodemailer"),
		fs = require("fs"),
		util = require("util"),
		path = require("path");

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

const makeDirIfNeeded = function(path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, {recursive:true});
	}
};

const transporter = nodemailer.createTransport({
	"host": "smtp.zoho.com",
	"port": 465,
	"secure": true,
	"auth": emailAuth,
});

//Mail hosts don't like it when we send lots of emails in quick succession and sometimes lock us out, so we spread them out.
const pendingEmails = [];
const sendEmail = function(recipientEmail, subject, message, callback) {
	if (emailAuth === null) {
		console.log("No email credentials, dumping email:");
		console.log(recipientEmail);
		console.log(subject);
		console.log(message);
		if (callback) {
			callback(false);
		}
		return;
	}
	pendingEmails.push({
		"recipientEmail": recipientEmail,
		"subject": subject,
		"message": message,
		"callback": callback,
	});
	createEmailCheck();
}

let emailCheckActive = false;
let lastSent = 0;
const createEmailCheck = function() {
	if (emailCheckActive) {return;}
	emailCheckActive = true;

	const interval = setInterval(() => {
		if (Date.now() - lastSent < 500) {return;}
		if (pendingEmails.length === 0) {return;}
		const {recipientEmail, subject, message, callback} = pendingEmails.shift();
		console.log(`Sending email to ${recipientEmail}: ${subject}`);
		transporter.sendMail({
			from: emailAuth.user,
			to: recipientEmail,
			subject: subject,
			text: message,
		}, function(err) {
			if (callback) {
				callback(err ? false : true);
			}
			if (err) {
				handleError(err);
			}
		});
		lastSent = Date.now();

		if (pendingEmails.length === 0) {
			clearInterval(interval);
		}
	}, 100);
}

const getAdmins = function() {
	if (fs.existsSync(path.join(rootDir, "data_files/admins.json"))) {
		return JSON.parse(fs.readFileSync(path.join(rootDir, "data_files/admins.json"), "utf8"));
	} else {
		console.log("No admins; creating one with default password 'correcthorsebatterystaple'.")
		makeDirIfNeeded(path.join(rootDir, "data_files"));
		const admins = [{"id":0,"name":"Onar","password":"correcthorsebatterystaple","roles":{"editor":true,"grammarGuru":true,"templateGuru":true,"rulesGuru":true,"owner":true},"emailAddress":"notarealemail@yahoo.com","reminderEmailFrequency":"Never","sendSelfEditLogEmails":false}];
		fs.writeFileSync(path.join(rootDir, "data_files/admins.json"), JSON.stringify(admins));
		return admins;
	}
}

const sendEmailToOwners = function(subject, message, callback) {
	const allAdmins = getAdmins();
	for (let i in allAdmins) {
		if (allAdmins[i].roles.owner) {
			sendEmail(allAdmins[i].emailAddress, subject, message, callback);
		}
	}
}

//General error handling function- puts the error in the console and emails it to me.
const handleError = async function(error, silent = false) {
	if (!silent) {
		console.error(error)
	}
	let allAdmins = getAdmins();

	const allOwners = allAdmins.filter(admin => admin.roles.owner);
	if (allOwners.length === 0) {
		console.log("No owners to email.")
	} else {
		const sendPromises = [];
		for (let owner of allOwners) {
			sendPromises.push(
				new Promise((resolve, reject) => {
					const emailCallback = function() {
						resolve();
					}
					sendEmail(owner.emailAddress, "Disaster!", error.stack, emailCallback);
				})
			);
		}
		await Promise.all(sendPromises);
	}
}

const setUpErrorHandling = function() {
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
}

module.exports = {
	"email": sendEmail,
	"emailOwners": sendEmailToOwners,
	"handleError": handleError,
	"getAdmins": getAdmins,
	"setUpErrorHandling": setUpErrorHandling,
}