const Location = require('../model/Location');

const locationService = {
  /**
   * Get all locations from database
   * @param req Request to the server
   * @param res Response from the server
   */
  getALocationFromDb: (req, res) => {
    Location.findById(req.params.id)
      .select('-__v')
      .then((result) => {
        if (!result)
          return res
            .status(404)
            .json({ success: false, message: 'Location not found' });

        res.status(200).json({ success: true, result });
      })
      .catch((err) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get location`, error: err }),
      );
  },

  /**
   * Get all locations from database
   * @param req Request to the server
   * @param res Response from the server
   */
  getAllLocationFromDb: (req, res) => {
    Location.find({})
      .select('-__v')
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((err) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get locations`, error: err }),
      );
  },

  /**
   * Add new location to database
   * @param req Request to the server
   * @param res Response from the server
   */
  addNewLocation: (req, res) => {
    var { state, area } = req.body;
    Location.find({ area })
      .then((result) => {
        if (result.length >= 1) {
          res
            .status(500)
            .json({ success: false, message: `This location already exist!` });
        }
        var newLocation = new Location({
          state,
          area,
        });

        newLocation
          .save()
          .then((data) => res.json({ success: true, result: data }))
          .catch((error) =>
            res.status(501).json({
              success: false,
              message: `Can't add new location`,
              error,
            }),
          );
      })
      .catch((err) =>
        res.status(501).json({
          success: false,
          message: `Can't add new location`,
          error: err,
        }),
      );
  },

  /**
   * Delete a location from database
   * @param req Request to the server
   * @param res Response from the server
   */
  deleteLocationFromDb: (req, res) => {
    Location.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res.status(500).json({ success: false, message: 'Unable to delete' }),
      );
  },

  /**
   * Update a location from database
   * @param req Request to the server
   * @param res Response from the server
   */
  updateLocation: (req, res) => {
    let newData = req.body;
    let final = {};
    for (let key in newData) {
      if (newData[key] !== '') {
        final[key] = newData[key];
      }
    }
    Location.updateOne({ _id: req.params.id }, { $set: final })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res.status(500).json({ success: false, message: 'Unable to update' }),
      );
  },
};

module.exports = locationService;
