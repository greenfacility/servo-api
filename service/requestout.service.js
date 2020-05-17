const RequestOut = require('../model/RequestOut');
const User = require('../model/User');
const {
  sendEmail,
  newRequestTemplate,
  workAssignedTemplate,
  beforeScheduleTemplate,
  afterScheduleTemplate,
} = require('./mail.service');

const requestOutService = {
  find: (req, res) => {
    RequestOut.find({})
      .sort({ timestart: -1 })
      .then((data) => {
        res.status(200).json({
          result: data,
          success: true,
        });
      })
      .catch((err) =>
        res.status(500).json({
          success: false,
          message: 'Error while fetching data',
          error: err,
        }),
      );
  },

  findOne: (req, res) => {
    RequestOut.findById(req.params.id)
      .select('-__v')
      .then((result) => {
        if (!result)
          return res
            .status(404)
            .json({ success: false, message: 'Request not found!' });

        var soln = result;
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
      apartment,
      description,
      email,
      property,
      propertyId,
      fullname,
      phone,
      picture,
      type,
    } = req.body;
    if (email && property && propertyId && fullname && phone && type) {
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

          var newRequest = new RequestOut({
            apartment,
            description,
            email,
            property,
            propertyId,
            fullname,
            phone,
            picture,
            type,
          });
          newRequest
            .save()
            .then((result) => {
              sendEmail(newRequestTemplate(teamsEmail, result), (status) => {
                res.status(201).json({ success: true, result });
              });
            })
            .catch((error) =>
              res.status(500).json({
                success: false,
                message: "Sorry, can't add new request now",
              }),
            );
        })
        .catch((error) =>
          res.status(500).json({
            success: false,
            message: "Sorry, can't add new request now",
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
    RequestOut.findById(req.params.id)
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
        RequestOut.updateOne({ _id: req.params.id }, { $set: final })
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

    RequestOut.update({ _id: req.params.id }, { $set: { timescheduled } })
      .then((reslt) => {
        RequestOut.findById(req.params.id).then((request) => {
          sendEmail(beforeScheduleTemplate(req.body.email, request));

          // Add scheduler here with newdate
          sendEmail(afterScheduleTemplate(req.body.email, request, date));

          res.status(200).json({
            success: true,
            result: { message: 'Workorder Scheduled!' },
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
    RequestOut.deleteOne({ _id: req.params.id })
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

module.exports = requestOutService;
