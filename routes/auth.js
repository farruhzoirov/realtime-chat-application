const express = require('express');
const {body} = require("express-validator")
const router = express.Router();
const Users = require('../models/users');

const authController = require('../controllers/auth');
const isAuth = require("../middleware/is-auth");

const imageFileValidator = (value, {req }) => {
  if (!req.file) {
    throw new Error('Image file is required');
  }
  return true;
};

router.get('/signup', authController.getSignup);

router.post('/signup',
    [
      body('image').custom(imageFileValidator),
      body('name')
          .trim()
          .notEmpty()
          .withMessage('Name is required')
          .isLength({min: 3}).withMessage('Name must be at least 3 characters long'),
      body('email')
          .isEmail()
          .withMessage('Please enter a valid email.')
          .custom((value, {req}) => {
                return Users.findOne({email: value}).then((user) => {
                  if (user) {
                    return Promise.reject('Email exists already. Please pick a different one');
                  }
                  return true;
                })
              }
          ),
      body('password', 'This password must be at least 5 character and a valid!')
          .isLength({min: 5})
          .isAlphanumeric(),
      body('confirmPassword').custom((value, {req}) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match');
        }
        return true;
      })
    ],
    authController.postSignup
);
router.get('/login',  authController.getLogin);


router.post('/login',
    [body('email')
        .isEmail()
        .withMessage('Please enter a valid email.'),
    body('password', 'This password must be at least 5 character and a valid!')
        .isLength({min: 5})
        .isAlphanumeric()],
    authController.postLogin
);


router.post('/logout', authController.postLogout);

module.exports = router;