//This file is saved to the startup script with "pm2 save";

module.exports = {
	/**
	 * Application configuration section
	 * 
	 */
	apps : [
		{
			"name": "RGserver",
			"script": "server.js",
			"watch": ["server.js", "questionDatabase.db", "referenceQuestionArray.js", "public_html/globalResources", "custom_modules"],
			"log_date_format": "YYYY-MM-DD HH:mm",
		},
		{
			"name": "RGjobs",
			"script": "regularJobScheduling.js",
			"watch": "regularJobScheduling.js",
			"log_date_format": "YYYY-MM-DD HH:mm",
		},
		{
			"name": "RGdiscordBot",
			"script": "discordBot.js",
			"watch": "discordBot.js",
			"log_date_format": "YYYY-MM-DD HH:mm",
		}
	]
};
