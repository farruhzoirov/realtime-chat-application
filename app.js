const path = require('path');
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require('express-session');
const MONGODBStore = require('connect-mongodb-session')(session);

const config = require('./config');
const multer = require("multer");

const Users = require('./models/users');
const Messages = require('./models/messages');
const app = express();
app.use(express.json());

app.use(cors({origin: 'https://farruhzoirov.uz'}));


// Template engine
app.set("view engine", "ejs");
app.set('views', 'views');

const store = new MONGODBStore({
  uri: config.MONGODB_URI,
  collection: 'sessions'
});

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})


// Importing Routes
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");


// fileFilter for multer
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

app.use(express.static(path.join(__dirname, "frontend")));
app.use('/images', express.static('images'));
app.use('/socket', express.static(path.join(__dirname, 'node_modules', 'socket.io', 'client-dist')))
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('avatar'));
app.use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    }));

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  Users.findById(req.session.user._id)
      .then((user) => {
        req.user = user;
        next();
      })
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
})

// Io setup
const server = app.listen(config.APP_PORT, () => {
  console.log(`Server running on http://localhost:${config.APP_PORT}`);
});
const io = require('./socket').init(server);

io.on('connection', socket => {
  socket.on('login', async data => {
    const user = await Users.findById(data.user._id);
    if (!user) {
      return;
    }
    socket.emit('login', {
      user: user
    })
  })
});

// User Routes
app.use(authRoutes);
app.use(chatRoutes);


// Io based part
io.on('connection', socket => {
  socket.on('chat', data => {
    Messages.create(
        {
          message: data.message,
          name: data.name,
          writtenHour: data.getCurrentHour,
          writtenMinute: data.getCurrentMinute,
          userId: data.userId
        })
        .then(() => {
          io.sockets.emit('chat', data);
        }).catch(err =>
        console.error('During messages creating: Error: ', err)
    );
  });
  socket.on('typing', data => {
    socket.broadcast.emit('typing', [data]);
  });
});

// Connecting database
mongoose.connect(config.MONGODB_URI).then((result) => {
  console.log('Connected to database');
})



