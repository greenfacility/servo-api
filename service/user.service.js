const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/keys');
const { sendEmail, changePasswordTemplate } = require('./mail.service');

// User Model
const User = require('../model/User');

const userService = {
  /**
   * Get a user from database
   * @param req Request to the server
   * @param res Response from the server
   */
  getUserFromDb: (req, res) => {
    // console.log(req.user.usertype !== 'manager', req.user.id !== req.params.id);
    if (req.user.usertype !== 'manager' && req.user.id !== req.params.id)
      return res.status(501).json({
        success: false,
        message: "You're not authorized",
      });

    User.findById(req.params.id)
      .select('-password')
      .then((user) => {
        if (!user)
          return res
            .status(404)
            .json({ success: false, message: 'User not found' });

        res.status(200).json({ success: true, result: user });
      })
      .catch((error) =>
        res
          .status(501)
          .json({ success: false, message: 'Unable to fetch user', error }),
      );
  },

  /**
   * Get a user from database
   * @param req Request to the server
   * @param res Response from the server
   */
  getAllUsersFromDb: (req, res) => {
    User.find({})
      .sort({ date: -1 })
      .select('firstname lastname email address usertype')
      .then((user) => {
        // console.log(user);
        return res.status(200).json({ success: true, result: user });
      })
      .catch((err) =>
        res
          .status(500)
          .json({ success: false, message: 'Unable to fetch users', err }),
      );
  },

  /**
   * Get all list of users from database
   * @param req Request to the server
   * @param res Response from the server
   */
  getAUserFromDb: (req, res) => {
    User.findById(req.params.id)
      .select('firstname lastname email address usertype')
      .then((user) => {
        if (!user)
          return res
            .status(404)
            .json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, result: user });
      })
      .catch((err) =>
        res
          .status(404)
          .json({ success: false, message: 'Unable to fetch user' }),
      );
  },

  /**
   * Get all list of users from database
   * @param req Request to the server
   * @param res Response from the server
   */
  getAUserForPassword: (req, res) => {
    User.findById(req.user.id)
      .select('firstname lastname email')
      .then((user) => {
        if (!user)
          return res
            .status(404)
            .json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, result: user });
      })
      .catch((err) =>
        res
          .status(404)
          .json({ success: false, message: 'Unable to fetch user' }),
      );
  },

  /**
   * Register new user to the database
   * @param req Request to the server
   * @param res Response from the server
   */
  insertNewUserToDb: (req, res) => {
    var {
      password,
      firstname,
      lastname,
      email,
      phonenumber,
      address,
      picture,
      about,
    } = req.body;

    if (
      !password ||
      !firstname ||
      !lastname ||
      !email ||
      !phonenumber ||
      !address ||
      !about
      // !picture
    ) {
      return res.status(400).json({
        success: false,
        message: 'Enter All Required Field',
      });
    }

    User.findOne({
      email,
    })
      .then((user) => {
        if (user) {
          return res.status(400).json({
            success: false,
            message: 'Sorry, User Already Exist!',
          });
        }

        var newUser = new User({
          password,
          firstname,
          lastname,
          email,
          phonenumber,
          address,
          picture,
          about,
        });
        // Create Salt and Hash
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err)
              return res.status(500).json({
                success: false,
                message: 'Error: Unable to create account',
                error: err,
              });
            newUser.password = hash;
            newUser.save().then((user) => {
              jwt.sign(
                {
                  id: user.id,
                  usertype: user.usertype,
                },
                jwtSecret,
                {
                  expiresIn: 360000,
                },
                (err, token) => {
                  if (err) throw err;
                  res.status(201).json({
                    token,
                    result: user,
                    success: true,
                  });
                },
              );
            });
          });
        });
      })
      .catch((err) =>
        res.status(500).json({
          success: false,
          message: 'Error: Unable to create account',
          error: err,
        }),
      );
  },

  /**
   * Login user to server to get token for frontend
   * @param req Request to the server
   * @param res Response from the server
   */
  loginToServer: (req, res) => {
    var { email, password } = req.body;
    var logger = email;
    if (!logger || !password) {
      return res.status(400).json({
        success: false,
        message: 'Enter All Field',
      });
    }
    User.findOne({
      email,
    })
      .then((user) => {
        if (!user)
          return res.status(400).json({
            success: false,
            message: "User Doesn't Exist!",
          });
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (!isMatch)
            return res.status(400).json({
              success: false,
              message: 'Invalid or Wrong Password',
            });
          jwt.sign(
            {
              id: user.id,
              usertype: user.usertype,
            },
            jwtSecret,
            {
              expiresIn: 360000,
            },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({
                success: true,
                token,
                result: user,
              });
            },
          );
        });
      })
      .catch((err) =>
        res.status(500).json({
          success: false,
          message: 'User not found',
          error: err,
        }),
      );
  },

  /**
   * Delete a user with a particular id
   * @param req Request to the server
   * @param res Response from the server
   */

  deleteUserFromDb: (req, res) => {
    if (req.user.usertype !== 'manager' && req.user.id !== req.params.id)
      return res.status(501).json({
        success: false,
        message: "You're not authorized",
      });

    User.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).json({ success: true, result }))
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: "User can't be deleted" }),
      );
  },

  /**
   * Activate the registered user or deactivate the user
   * @param req Request to the server
   * @param res Response from the server
   */
  activationHandler: (req, res) => {
    var { idtoupdate, isactivated } = req.body;
    // console.log(req.user)

    User.findById(req.user.id).then((user) => {
      if (user.usertype === 'manager') {
        console.log(user.isactivated);
        User.findByIdAndUpdate(
          idtoupdate,
          { isactivated },
          {
            new: true,
          },
          (err, data) => {
            if (err)
              return res
                .status(500)
                .send({ status: false, message: 'User not activated', err });
            return res.status(200).json({ success: true, result: data });
          },
        );
      } else {
        return res.status(401).json({
          success: false,
          message: "You're not an admin",
        });
      }
    });
  },

  /**
   * Change the users password
   * @param req Request to the server
   * @param res Response from the server
   */
  updateUserFromDb: (req, res) => {
    let newData = req.body;
    let final = {};
    for (let key in newData) {
      if (newData[key] !== '') {
        if (key === 'password') {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newData[key], salt, (err, hash) => {
              if (err) throw err;
              final[key] = hash;
            });
          });
        } else if (key === 'usertype') {
          // final[key] = newData[key];
        } else {
          final[key] = newData[key];
        }
      }
    }

    User.findOne({ _id: req.params.id })
      .then((rslt) => {
        if (!rslt)
          return res
            .status(404)
            .json({ success: false, message: 'User not found' });
        console.log(final, rslt);
        User.updateOne({ _id: rslt._id }, { $set: final })
          .then((result) => {
            console.log(result);
            res.status(200).json({ success: true, result });
          })
          .catch((error) =>
            res.status(500).json({
              success: false,
              message: "Can't update user's data",
              error,
            }),
          );
      })
      .catch((error) =>
        res
          .status(500)
          .json({ success: false, message: "Can't update user's data", error }),
      );
  },

  /**
   * Change the users type
   * @param req Request to the server
   * @param res Response from the server
   */

  changeUsersType: (req, res) => {
    var { usertype } = req.body;
    var newUser = {
      usertype,
    };
    if (req.user.usertype === 'manager') {
      User.findByIdAndUpdate(
        req.params.id,
        newUser,
        {
          new: true,
        },
        (err, data) => {
          if (err)
            return res.status(500).json({
              success: false,
              message: "Sorry, Can't update user's data",
              error: err,
            });
          return res.status(200).json({ success: true, result: data });
        },
      );
    } else {
      return res.status(401).json({
        success: false,
        message: "You're not authorized ;(",
      });
    }
  },

  /**
   * Send Forgot Password email to user
   * @param req Request to the server
   * @param res Response from the server
   */
  sendEmailForPassReq: (req, res) => {
    if (req.body.email === '') {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user)
        return res.status(400).json({
          success: false,
          message: "Email isn't registered!",
        });
      jwt.sign(
        {
          id: user.id,
          usertype: user.usertype,
        },
        jwtSecret,
        {
          expiresIn: 900,
        },
        (err, token) => {
          if (err) throw err;
          // console.log(token);
          sendEmail(changePasswordTemplate(user.email, token), (resp) => {
            if (resp) {
              res
                .status(200)
                .json({ success: true, result: 'Email sent successfully.' });
            } else {
              res.status(500).json({
                success: false,
                message: "Sorry, email can't be sent!!",
              });
            }
          });
        },
      );
    });
  },

  /**
   * Update User Password email to user
   * @param req Request to the server
   * @param res Response from the server
   */

  updateUserPass: (req, res) => {
    const { id, password } = req.body;

    if (password == '') {
      return res
        .status(400)
        .json({ success: false, message: "Password can't be empty!" });
    }

    try {
      const authHead = req.headers.authorization;
      let token;
      if (authHead.includes('Bearer')) {
        token = authHead.split(' ')[1];
      } else {
        token = authHead;
      }
      const decoded = jwt.verify(token, jwtSecret);
      bcrypt.genSalt(10, async (err, salt) => {
        if (err)
          return res.status(500).json({
            success: false,
            message: 'Unable to change password',
            error: err,
          });
        bcrypt.hash(password, salt, (err, hash) => {
          if (err)
            return res.status(500).json({
              success: false,
              message: 'Unable to change password',
              error: err,
            });
          User.findByIdAndUpdate(decoded.id, { $set: { password: hash } })
            .then((response) => {
              res.status(200).json({ success: true, result: response });
            })
            .catch((error) =>
              res.status(500).json({
                success: false,
                message: 'Unable to change password',
                error,
              }),
            );
        });
      });
    } catch (error) {
      // console.log(error);
      if (error.message.includes('expired')) {
        res
          .status(401)
          .json({ success: false, message: 'Your token session is expired' });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Sorry, Can't change password" });
      }
    }
  },
};

module.exports = userService;
