const Request = require('../model/Request');
const User = require('../model/User');
const {
  sendEmail,
  newRequestTemplate,
  workAssignedTemplate,
  beforeScheduleTemplate,
  afterScheduleTemplate,
} = require('./mail.service');

const requestService = {
  find: (req, res) => {
    Request.find({})
      .populate('from type')
      .sort({ timestart: -1 })
      .then((data) => {
        var results = data.map((result) => {
          var soln = result;

          if (soln.type === null) {
            soln.type = { name: 'Invalid', type: 'Invalid' };
          }

          if (soln.from === null) {
            soln.from = { firstname: 'Unknown', lastname: 'Unknown' };
          }
          return soln;
        });
        return res.status(200).json({
          result: results,
          success: true,
        });
      })
      .catch((err) =>
        res
          .status(500)
          .json({ message: 'Error while fetching data', err, success: false }),
      );
  },

  findOne: (req, res) => {
    Request.findById(req.params.id)
      .populate('type')
      .populate('from', 'firstname lastname email address usertype')
      .select('-__v')
      .then((result) => {
        if (!result)
          return res.status(404).json({
            success: false,
            message: 'Request not found!',
          });
        var soln = result;

        if (soln.type === null) {
          soln.type = { name: 'Invalid', type: 'Invalid' };
        }

        if (soln.from === null) {
          soln.from = { firstname: 'Unknown', lastname: 'Unknown' };
        }

        return res.status(200).json({
          success: true,
          result: soln,
        });
      })
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: 'Request not found!', error }),
      );
  },

  post: (req, res) => {
    var {
      name,
      type,
      from,
      description,
      picture,
      property,
      propertyId,
    } = req.body;
    if (name && type && from && description && property && propertyId) {
      const userTypes = ['manager', 'team-member', 'technician'];
      User.find({ usertype: { $in: userTypes } })
        .then((teams) => {
          //   console.log(teams);
          let teamsEmail = [];
          teams.forEach((element) => {
            if (!element.busy) {
              teamsEmail.push(element.email);
            }
          });

          var newRequest = new Request({
            name,
            type,
            from,
            description,
            picture,
            property,
            propertyId,
          });
          newRequest
            .save()
            .then((result) => {
              sendEmail(newRequestTemplate(teamsEmail, result), (status) => {
                res.status(201).json({ success: true, result });
              });
              console.log(teamsEmail);
            })
            .catch((error) =>
              res.status(500).json({
                success: false,
                message: "Sorry, can't add new request now",
                error,
              }),
            );
        })
        .catch((error) =>
          res.status(500).json({
            success: false,
            message: "Sorry, can't add new request now",
            error,
          }),
        );
    } else {
      res
        .status(500)
        .json({ success: false, message: 'Please enter all required field!' });
    }
  },

  patch: (req, res) => {
    let newData = req.body;
    let final = {};
    Request.findById(req.params.id)
      .then((requests) => {
        for (let key in newData) {
          if (newData[key] !== '') {
            final[key] = newData[key];
            if (key === 'assigned') {
              sendEmail(
                workAssignedTemplate(req.body.email, requests),
                (status) => {
                  console.log(status);
                },
              );
            }
          }
        }
        Request.updateOne({ _id: req.params.id }, { $set: final })
          .then((result) => res.status(200).json({ success: true, result }))
          .catch((error) =>
            res.status(500).json({
              success: false,
              message: 'Unable to assign user to work',
              error,
            }),
          );
      })
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: 'Unable to assign user to work',
          error,
        }),
      );
  },

  putSchedule: (req, res) => {
    const timescheduled = req.body.timescheduled;
    let date = new Date(timescheduled);
    let newdate = new Date(date.getTime() - 6000000);

    //Call the function to schedule email sending
    if (timescheduled === '' || typeof timescheduled === 'undefined')
      return res
        .status(400)
        .json({ success: false, msg: 'No time is scheduled' });

    Request.update({ _id: req.params.id }, { $set: { timescheduled } })
      .then((reslt) => {
        Request.findById(req.params.id).then((request) => {
          sendEmail(beforeScheduleTemplate(req.body.email, request));

          // Add scheduler here with newdate
          sendEmail(afterScheduleTemplate(req.body.email, request, date));

          res.status(200).json({
            success: true,
            result: { message: 'Work order Scheduled!' },
          });
        });
      })
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: "Workorder can't be scheduled",
          error,
        }),
      );
  },

  delete: (req, res) => {
    Request.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: "Workorder can't be delete",
          error,
        }),
      );
  },
};

module.exports = requestService;
