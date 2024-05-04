const Users = require('../models/users');
const bcrypt = require('bcryptjs');
const {body, validationResult} = require('express-validator');

exports.getSignup = async (req, res, next) => {
  res.render('auth/signup', {
    title: 'Sign up',
  });
};


exports.getLogin = async (req, res, next) => {
  res.render('auth/login', {
    title: 'Log in'
  });
}

exports.postSignup = async (req, res, next) => {
  try {
    const image = req.file;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errorMessage: errors.array()[0].msg,
        oldInput: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword
        }
      });
    }
    const avatar = image.path;
    const hashPassword = await bcrypt.hash(password, 12)
    const user = new Users({
      name: name,
      email: email,
      password: hashPassword,
      avatar: avatar
    });
    await user.save();
    return res.status(200).json({
      ok: true,
      message: 'Registered successfully.!'
    });
  } catch (e) {
    res.status(400).json({
      ok: false,
      message: e + ''
    })
  }
}


exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
      }
    })
  }

  const user = await Users.findOne({email: email});
  if (!user) {
    return res.status(422).json({
      ok: false,
      message: "You didn't register"
    });
  }
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return res.status(422).json({
      ok: false,
      message: "Password is incorrect"
    });
  }
  req.session.isLoggedIn = true;
  req.session.user = user;
  req.session.save();
  return res.status(200).json({
    ok: 'true',
    message: 'Logged successfully.',
    user: user
  })
}

exports.postLogout = async (req, res, next) => {
  await req.session.destroy((err) => {
    console.log(err)
  });

  res.status(200).json({
    ok: true,
    message: 'Session deleted'
  })
};
