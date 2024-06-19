const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'dfpkjewirsanfhfgyvkpajdansd';
const mongoUrl =
  'mongodb+srv://rajeev123:raj123456@cluster0.2w7iz2n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch((e) => console.log(e));

// Importing models
require('./models/userDetails');
require('./models/imageDetails');

const User = mongoose.model('UserInfo');
const Images = mongoose.model('ImageDetails');

app.listen(5000, () => {
  console.log('Server Started at http://localhost:5000');
});

// User Registration Route
app.post('/register', async (req, res) => {
  const { fname, lname, email, password, userType } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.json({ error: 'User Exists' });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });
    res.send({ status: 'ok' });
  } catch (error) {
    res.send({ status: 'error' });
  }
});

// User Login Route
app.post('/login-user', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ error: 'User Not found' });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: '15m',
    });
    return res.json({ status: 'ok', data: token });
  }
  res.json({ status: 'error', error: 'Invalid Password' });
});

// Get User Data Route
app.post('/userData', async (req, res) => {
  const { token } = req.body;

  try {
    const user = jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return 'token expired';
      }
      return decoded;
    });

    if (user == 'token expired') {
      return res.send({ status: 'error', data: 'token expired' });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => res.send({ status: 'ok', data }))
      .catch((error) => res.send({ status: 'error', data: error }));
  } catch (error) {
    res.send({ status: 'error', data: error });
  }
});

// Forgot Password Route
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: 'User Not Exists!!' });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: '5m',
    });
    const link = `http://localhost:3000/reset-password/${oldUser._id}/${token}`;

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rajeevy396@gmail.com',
        pass: 'onhildwztdtfwhov',
      },
    });

    var mailOptions = {
      from: 'rajeevy396@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    console.log(link);
    res.send({
      status: 'ok',
      message: 'Password reset link sent to your email',
    });
  } catch (error) {
    res.send({ status: 'error', data: error });
  }
});

// Reset Password Route
app.get('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: 'User Not Exists!!' });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.send({ email: verify.email, status: 'Not Verified' });
  } catch (error) {
    console.log(error);
    res.send('Not Verified');
  }
});

app.post('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: 'User Not Exists!!' });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: id },
      { $set: { password: encryptedPassword } }
    );
    res.send({ email: verify.email, status: 'verified' });
  } catch (error) {
    console.log(error);
    res.json({ status: 'Something Went Wrong' });
  }
});

// Upload Image Route
app.post('/upload-image', async (req, res) => {
  const { base64 } = req.body;
  try {
    await Images.create({ image: base64 });
    res.send({ Status: 'ok' });
  } catch (error) {
    res.send({ Status: 'error', data: error });
  }
});

// Get Image Route
app.get('/get-image', async (req, res) => {
  try {
    await Images.find({}).then((data) => res.send({ status: 'ok', data }));
  } catch (error) {
    res.send({ status: 'error', data: error });
  }
});
