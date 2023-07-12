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
			"watch": ["server.js", "public_html/globalResources/templateConvert.js", "custom_modules"],
			"log_date_format": "YYYY-MM-DD HH:mm"
		},
		{
			"name": "RGregularJobScheduling.js",
			"script": "regularJobScheduling.js",
			"watch": "regularJobScheduling.js",
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
