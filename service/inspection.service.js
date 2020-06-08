const Inspection = require('../model/Inspection');
const { sendEmail, inspectionUpdateTemplate } = require('./mail.service');

const InspectionService = {
  get: (req, res) => {
    Inspection.find({})
      .sort({ createdAt: -1 })
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get inspections`, error }),
      );
  },

  getOne: (req, res) => {
    Inspection.findById(req.params.id)
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get inspection`, error }),
      );
  },

  create: (req, res) => {
    var { name, email, location, projetsite, building, floor, wing, room, category, observation, categorywork, solution, action, estimatecost, dimension, picture } = req.body;
    Inventory.find({})
      .sort({ createdAt: -1 })
      .then((invs) => {
        let length = invs.length;
        let serial = length + 1;
        if (invs.length > 0) {
          serial = invs[0].serial + 1 || length + 1;
        }
        if (name && email && location && projetsite && building && floor && wing && room && category && observation && categorywork && solution && action && estimatecost && dimension && picture ) {
            var newInspection = new Inspection({
              serial,
              name,
              email, 
              location, 
              projetsite, 
              building, 
              floor, 
              wing, 
              room, 
              category, 
              observation, 
              categorywork, 
              solution, 
              action, 
              estimatecost, 
              dimension, 
              picture,
            });

            newInspection
            .save()
            .then((data) => res.json({ success: true, result: data }))
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                success: false,
                message: "Can't create new inspection",
                error,
              });
            });
        } else {
          res.status(500).json({
            success: false,
            message: 'Please enter all required field!',
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Can't create new inspection!",
          error,
        });
      });
  },

  delete: (req, res) => {
    Inspection.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: "Inspection can't be delete",
          error,
        }),
      );
  },  
};

module.exports = InspectionService;
