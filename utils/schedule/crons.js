const CronJob = require('cron').CronJob;
const mumoLib = require('../functions.library');

exports.scheduledStartTasks = function() {
    var job = new CronJob('*/10 * * * * *', function() { // Every 10 minutes
        console.log('Generating random songs for Home screen');
        mumoLib.generateRandomSongs();
    }, null, true,
    'America/Los_Angeles');

    job.start();
}