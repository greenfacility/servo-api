const Property = require('../model/Property');

const propertyService = {
  find: (req, res) => {
    Property.find({})
      .select('-__v')
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get Properties`, error }),
      );
  },

  findOne: (req, res) => {
    Property.findById(req.params.id)
      .select('-__v')
      .then((result) => {
        if (!result)
          return res
            .status(404)
            .json({ success: false, message: 'Property not found' });
        res.status(200).json({ success: true, result });
      })
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get property`, error }),
      );
  },

  post: (req, res) => {
    var { name, property, location, ownId } = req.body;
    Property.find({ name, property })
      .then((result) => {
        if (result.length >= 1) {
          res
            .status(500)
            .json({ message: `This Property already exist!`, success: false });
        }
        var newProperty = new Property({
          name,
          property,
          location,
          ownId,
        });

        newProperty
          .save()
          .then((data) => res.json({ success: true, result: data }))
          .catch((error) =>
            res.status(500).json({
              success: false,
              message: "Can't create new property",
              error,
            }),
          );
      })
      .catch((error) =>
        res
          .status(501)
          .json({
            success: false,
            message: "Can't create new property",
            error,
          }),
      );
  },

  patch: (req, res) => {
    let newData = req.body;
    let final = {};
    for (let key in newData) {
      if (newData[key] !== '') {
        final[key] = newData[key];
      }
    }
    Property.updateOne({ _id: req.params.id }, { $set: final })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: 'Unable to change data', error }),
      );
  },

  delete: (req, res) => {
    Property.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: 'Unable to delete property',
          error,
        }),
      );
  },
};

module.exports = propertyService;
