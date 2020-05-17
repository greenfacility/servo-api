const Service = require('../model/Service');

const serviceService = {
  /**
   * Get all services from database
   * @param req Request to the server
   * @param res Response from the server
   */
  findOne: (req, res) => {
    Service.findById(req.params.id)
      .select('-__v')
      .then((result) => {
        if (!result)
          return res
            .status(404)
            .json({ success: false, message: 'Service not found!' });
        res.status(200).json({ success: true, result });
      })
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get services`, error }),
      );
  },

  /**
   * Get all services from database
   * @param req Request to the server
   * @param res Response from the server
   */
  find: (req, res) => {
    Service.find({})
      .select('-__v')
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get services`, error }),
      );
  },

  /**
   * Add new service to database
   * @param req Request to the server
   * @param res Response from the server
   */
  post: (req, res) => {
    var { name, type } = req.body;
    Service.find({ name })
      .then((result) => {
        if (result.length >= 1) {
          res
            .status(500)
            .json({ success: false, message: `This service already exist!` });
        }
        var newService = new Service({
          name,
          type,
        });

        newService
          .save()
          .then((data) => res.json({ success: true, result: data }))
          .catch((error) =>
            res.status(501).json({
              success: false,
              message: `Unable to add new service`,
              error,
            }),
          );
      })
      .catch((error) =>
        res.status(501).json({
          success: false,
          message: `Unable to add new service`,
          error,
        }),
      );
  },

  /**
   * Delete a service from database
   * @param req Request to the server
   * @param res Response from the server
   */
  delete: (req, res) => {
    Service.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) => res.status(500).json({ success: false, error }));
  },

  /**
   * Update a service from database
   * @param req Request to the server
   * @param res Response from the server
   */
  update: (req, res) => {
    let newData = req.body;
    let final = {};
    for (let key in newData) {
      if (newData[key] !== '') {
        final[key] = newData[key];
      }
    }
    Service.updateOne({ _id: req.params.id }, { $set: final })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: 'Unable to update service' }),
      );
  },
};

module.exports = serviceService;
