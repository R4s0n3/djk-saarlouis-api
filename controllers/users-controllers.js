const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    role:'ADMIN',
    password: hashedPassword,
    posts: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  

  res
    .status(201)
    .json({ userId: createdUser.id});
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    token: token
  });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;

    let user;
    try{
        user = await User.findById(userId, '-password');
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a user.',
            500
        );
        return next(error);
    }
    if(!user){
        const error = new HttpError(
            'Could not find a user for the provided id.',
            404
        );
        return next(error);
    }
    res.json({user: user.toObject({getters:true})});
}

const deleteUser = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await User.deleteOne({_id: userId});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete user.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for this id.', 404);
    return next(error);
  }
  

 
  res.status(200).json({ message: 'Deleted user.' });
};

exports.deleteUser = deleteUser;
exports.getUserById = getUserById;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;