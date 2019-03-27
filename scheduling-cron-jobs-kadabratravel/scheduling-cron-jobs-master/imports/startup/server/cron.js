import { SyncedCron } from 'meteor/percolate:synced-cron';
import { Rates } from '../../api/tasks/rates';
import { getRates } from '../../modules/server/getRates';
import { sendDailyTasks } from '../../modules/server/send-daily-tasks';


SyncedCron.config({ log: true, utc: true });

SyncedCron.add({
  name: 'Get Exchange Rates',
  schedule(parser) {
    return parser.text('every 2 hours');
  },
  job() {
    getRates()
    .then(function(success) {
      Rates.update({_id : "abc"}, {$set: {rates:success.rates, base:success.base}})
    }) 
    .catch((error) => console.warn(error));
   
  },
});

SyncedCron.add({
  name: 'Fetch Travels',
  schedule(parser) {
    return parser.text('every 25 sec');
  },
  job() {
    sendDailyTasks()
    .then((success) => console.log(success))
    .catch((error) => console.warn(error));
   
  },
});

SyncedCron.start();
