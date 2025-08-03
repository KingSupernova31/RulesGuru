const cron = require("node-cron");
const rgUtils = require("./custom_modules/rgUtils.js");
rgUtils.setUpErrorHandling();
/*
second	0-59
minute	0-59
hour	0-23
day of month	1-31
month	1-12
day of week	0-6 (0 is sunday)
*/

//The VPS is in UTC. 7 hours after PDT, 8 after PST.

//Every 10 minutes:
cron.schedule("0 */10 * * * *", function() {
	require('child_process').fork('custom_modules/updateDataFiles.js', [], {
		execArgv: ['--max-old-space-size=4000'], //Needs around 1GB of memory at minimum. Current VPS only grants ~500MB by default.
	});
});

//Every day at midnight or 23:00 Pacific.
cron.schedule("0 0 7 * * *", function() {
	require('child_process').fork('custom_modules/dailyEmails.js');

	require('child_process').fork('custom_modules/socialBot.js');
});

//Every month
cron.schedule("0 0 0 2 * *", function() {
	require('child_process').fork('custom_modules/createBackups.js');
});
