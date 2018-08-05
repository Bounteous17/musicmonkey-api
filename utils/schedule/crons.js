const cron = require('cron').CronJob;

exports.scheduledStartTasks = function() {
    new cron('*/10 * * * *', function() { // Every 10 minutes
        console.log('Generating random songs for Home screen');
    }, null, true, 'Europe/Madrid');
}