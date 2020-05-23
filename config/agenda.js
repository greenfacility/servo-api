const Agenda = require('agenda');
const MongoURI = require('./keys').MongoURI;
const {
  afterScheduleTemplate,
  afterOutScheduleTemplate,
  sendEmail,
} = require('../service/mail.service');

let agenda = new Agenda({
  db: { address: MongoURI, collection: 'jobs' },
  processEvery: '30 seconds',
});

agenda.on('ready', async () => await agenda.start());

agenda.define('schedule request mail', (job, done) => {
  const { to, request, date } = job.attrs.data;
  sendEmail(afterScheduleTemplate(to, request, date), (status) => {
    console.log(status);
    done;
  });
});

agenda.define('schedule outrequest mail', (job, done) => {
  const { to, request, date } = job.attrs.data;
  sendEmail(afterOutScheduleTemplate(to, request, date), (status) => {
    console.log(status);
    done;
  });
});

let graceful = () => {
  agenda.stop(() => process.exit(0));
};

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

module.exports = agenda;
