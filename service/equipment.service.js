const Equipment = require('../model/Equipment');

const EquipmentService = {
  get: (req, res) => {
    Equipment.find({})
      .populate('users.id', 'usertype firstname lastname email')
      .select('-__v')
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get equipments`, error }),
      );
  },

  getOne: (req, res) => {
    Equipment.findById(req.params.id)
      .populate('users.id', 'usertype firstname lastname email')
      .select('-__v')
      .then((result) => {
        if (!result)
          return res
            .status(404)
            .json({ success: false, message: 'Equipment not found' });
        res.status(200).json({ success: true, result });
      })
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: `Can't get equipment`, error }),
      );
  },

  create: (req, res) => {
    var { name, available } = req.body;

    if (name && available) {
      var newEquipment = new Equipment({
        name,
        available,
      });

      newEquipment
        .save()
        .then((data) => res.json({ success: true, result: data }))
        .catch((error) =>
          res.status(500).json({
            success: false,
            message: "Can't create new equipment",
            error,
          }),
        );
    } else {
      res.status(500).json({
        success: false,
        message: 'Please enter all required field!',
      });
    }
  },

  delete: (req, res) => {
    Equipment.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res.status(500).json({
          success: false,
          message: "Equipment can't be delete",
          error,
        }),
      );
  },

  patch: (req, res) => {
    let newData = req.body;
    let final = {};
    for (let key in newData) {
      if (newData[key] !== '') {
        if (key === 'name' || key === 'available') {
          final[key] = newData[key];
        }
      }
    }
    Equipment.updateOne({ _id: req.params.id }, { $set: final })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: 'Unable to change data', error }),
      );
  },

  select: (req, res) => {
    const { number } = req.body;
    const userId = req.user.id;
    Equipment.findById(req.params.id)
      .then((rslt) => {
        let available = rslt.available - number;
        let users = { id: userId, number };
        let final = { available };
        if (available < 0) {
          res.status(400).json({
            success: false,
            message: 'Total equipment requred is more than available equipment',
          });
        } else {
          Equipment.updateOne(
            { _id: req.params.id },
            { $push: { users }, $set: final },
          )
            .then((result) => res.status(200).json({ success: true, result }))
            .catch((error) =>
              res.status(500).json({
                success: false,
                message: 'Unable to change data',
                error,
              }),
            );
        }
      })
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: 'Unable to change data', error }),
      );
  },

  submit: (req, res) => {
    if (
      req.user.usertype === 'manager' ||
      req.user.usertype === 'technician' ||
      req.user.usertype === 'procurement' ||
      req.user.usertype === 'team-member'
    ) {
      Equipment.findById(req.params.id)
        .then((rslt) => {
          // let users = { id: userId, number };
          let users = rslt.users.filter((dt) => dt._id != req.params.lendId);
          let user = rslt.users.find((dt) => dt._id == req.params.lendId);
          if (!user)
            return res.status(404).json({
              success: false,
              message: 'Equipment return record not found',
            });
          let available = rslt.available + user.number;
          let final = { available, users };
          // console.log(user, req.params.lendId, rslt.available, users);
          Equipment.updateOne({ _id: req.params.id }, { $set: final })
            .then((result) => res.status(200).json({ success: true, result }))
            .catch((error) =>
              res.status(500).json({
                success: false,
                message: 'Unable to change data',
                error,
              }),
            );
        })
        .catch((error) =>
          res
            .status(500)
            .json({ success: false, message: 'Unable to change data', error }),
        );
    } else {
      res
        .status(401)
        .json({ success: false, message: 'Sorry, you are not authorized' });
    }
  },
};

module.exports = EquipmentService;
