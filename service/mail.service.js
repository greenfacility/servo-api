const nodemailer = require('nodemailer');
const HOST = process.env.HOST || 'http://localhost:3000';
const from = process.env.EMAIL_FROM || 'addymailtest@gmail.com';

var mailConfig;
if (process.env.NODE_ENV === 'production') {
  // all emails are delivered to destination
  mailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS || 'addymailtest@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'adeshile',
    },
  };
} else {
  // all emails are catched by ethereal.email
  mailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ethereal.user@ethereal.email',
      pass: 'verysecret',
    },
  };
}

const transporter = nodemailer.createTransport(mailConfig);

const changePasswordTemplate = (email, token) => {
  return {
    from,
    to: `${email}`,
    subject: 'Link To Change Password From SERVO',
    html: `<div style='font-size: 16px;' >
      <p>You are recieving this email because you (or someone else) have requested
			for the reset of your account password. Please click the button below or paste the link into
      your browser to complete this process within 15 minutes of recieving it.
      </p>
			<a href='${HOST}/reset?token=${token}' style='padding: 8px; decoration: none; background: brown; color: white;'>
			Reset Password</a>
			<p>${HOST}/reset?token=${token} If you did not request for this, kindly ignore
      this message and your password will remain unchanged.</p>
      </div>`,
  };
};

const newRequestTemplate = (email, request) => {
  return {
    from,
    to: `${email}`,
    subject: `Alert On The Job ${request.name}`,
    html: `
          <div style='font-size: 16px;' >
          <p>This is to notify you about a new unassigned work order you can accept to work on.
						please kindly ignore this message if you are busy.</p>
						<p>Please log on to your account to check it out. It has a description <b>${request.description}</b> </p>
            <b>Thank You</b>
            </div>`,
  };
};

const newOutRequestTemplate = (email, request) => {
  return {
    from,
    to: `${email}`,
    subject: `Alert On The Job ${request.fullname}`,
    html: `
          <div style='font-size: 16px;' >
          <p>This is to notify you about a new unassigned outsider work order you can accept to work on.
						please kindly ignore this message if you are busy.</p>
						<p>Please log on to your account to check it out. It has a description <b>${request.description}</b> </p>
            <b>Thank You</b>
            </div>`,
  };
};

const statusChangeTemplate = (email, request) => {
  return {
    from,
    to: `${email}`,
    subject: `Alert On The Job ${request.name}`,
    html: `
          <div style='font-size: 16px;' >
          <p>This is to notify you about a work order you made and its new status is  <b>${request.status}</b> 
						please kindly ignore this message if you have finished it.</p>
						<p>Please log on to your account to check if you've done the work assigned to you. It has a description <b>${request.description}</b> </p>
            <b>Thank You</b>
            </div>`,
  };
};

const statusChangeDoneTemplate = (email, request) => {
  return {
    from,
    to: `${email}`,
    subject: `Alert On The Job ${request.name}`,
    html: `<div style='font-size: 16px;' >
            <p>This is to notify you that your work order <b>${request.name}<b> is now done
						please kindly log on to your account and rate us.</p>
						<p>Please log on to your account to check if you've done the work assigned to you. It has a description <b>${request.description}</b> </p>
            <b>Thank You</b>
            <div>`,
  };
};

const workAssignedTemplate = (email, request) => {
  return {
    from,
    to: `${email}`,
    subject: `Alert: A Work Order with Name "${request.name}"`,
    html: `<div style='font-size: 16px;' >
              <p>This is to notify you about a work order been assigned to you.</p>
              <p>It has a description <b>${request.description}</b> Kindly login to your account to check it out.</p><b>Thank You</b>
              </div>`,
  };
};

const workOutAssignedTemplate = (email, request) => {
  return {
    from,
    to: `${email}`,
    subject: `Alert: A Work Order with Name "${request.fullname}"`,
    html: `<div style='font-size: 16px;' >
              <p>This is to notify you about a work order been assigned to you.</p>
              <p>It has a description <b>${request.description}</b> Kindly login to your account to check it out.</p><b>Thank You</b>
              </div>`,
  };
};

const beforeScheduleTemplate = (email, request) => {
  return {
    from,
    to: `${email}`,
    subject: `Alert On The Job ${request.name}`,
    html: `
        <div style='font-size: 16px;' >
            <p>This is to notify you about a work order you are to finish within some hours
						please kindly ignore this message if you have finished it.</p>
						<p>Please log on to your account to check if you've done the work assigned to you. It has a description <b>${request.description}</b> </p>
            <b>Thank You</b>
            </div>`,
  };
};

const afterScheduleTemplate = (email, request, date) => {
  return {
    from,
    to: `${email}`,
    subject: `Alert On The Job ${request.name}`,
    html: `<div style='font-size: 16px;' >
              <p>This is to notify you about a work order you just scheduled for ${date.toDateString()}.</p>
              <p>It has a description <b>${
                request.description
              }</b> </p><b>Thank You</b>
              </div>`,
  };
};

const beforeOutScheduleTemplate = (email, request) => {
  return {
    from,
    to: `${email}`,
    subject: `Alert On The Job From ${request.fullname}`,
    html: `<div style='font-size: 16px;' >
            <p>This is to notify you about an outsider work order you are to finish within some hours
						please kindly ignore this message if you have finished it.</p>
						<p>Please log on to your account to check if you've done the work assigned to you. It has a description <b>${request.description}</b> </p>
            <b>Thank You</b>
            </div>`,
  };
};

const afterOutScheduleTemplate = (email, request, date) => {
  return {
    from,
    to: `${email}`,
    subject: `Alert On The Job From ${request.fullname}`,
    html: `<div style='font-size: 16px;' >
              <p>This is to notify you about a work order you just scheduled for ${date.toDateString()}.</p>
              <p>It has a description <b>${
                request.description
              }</b> </p><b>Thank You</b>
              </div>`,
  };
};

const sendEmail = (mailTemplate, cb) => {
  transporter.sendMail(mailTemplate, (err, response) => {
    console.log(nodemailer.getTestMessageUrl(response), response);
    if (err) {
      cb(false);
    } else {
      cb(true);
    }
  });
};

module.exports = {
  sendEmail,
  changePasswordTemplate,
  newRequestTemplate,
  newOutRequestTemplate,
  workAssignedTemplate,
  workOutAssignedTemplate,
  beforeScheduleTemplate,
  beforeOutScheduleTemplate,
  afterScheduleTemplate,
  afterOutScheduleTemplate,
  statusChangeTemplate,
  statusChangeDoneTemplate,
};
