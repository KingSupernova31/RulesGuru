//This file is saved to the startup script with "pm2 save";

module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps : [
		{
			"name": "RGserver",
			"script": "server.js",
			"watch": ["server.js", "public_html/globalResources/templateConvert.js"],
			"log_date_format": "YYYY-MM-DD HH:mm"
		},
		{
			"name": "RGdailyEmails",
			"script": "dailyEmails.js",
			"watch": "dailyEmails.js",
			"log_date_format": "YYYY-MM-DD HH:mm"
		},
		{
			"name": "RGupdateDataFiles",
			"script": "updateDataFiles.js",
			"watch": "updateDataFiles.js",
			"log_date_format": "YYYY-MM-DD HH:mm"
		},
		{
			"name": "RGcreateBackups",
			"script": "createBackups.js",
			"watch": "createBackups.js",
			"log_date_format": "YYYY-MM-DD HH:mm"
		},
		{
			"name": "RGdiscordBot",
			"script": "discordBot.js",
			"watch": "discordBot.js",
			"log_date_format": "YYYY-MM-DD HH:mm"
		}
	]
};
