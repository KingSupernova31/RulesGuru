const cron = require("node-cron");

/*
second	0-59
minute	0-59
hour	0-23
day of month	1-31
month	1-12
day of week	0-6 (0 is sunday)
*/

//Every day:
cron.schedule("0 0 0 * * *", function() {
	require('child_process').fork('updateDataFiles.js');
});

cron.schedule("0 0 5 * * *", function() {
	require('child_process').fork('createBackups.js');
});

cron.schedule("0 0 10 * * *", function() {
	require('child_process').fork('dailyEmails.js');
});
