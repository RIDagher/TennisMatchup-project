const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { DB_NAME, US_COLL } = require('../constants');
const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  skillLevel: Joi.string()
    .valid('-70', '-60', '-50', '-40', '-30', '-20', '-10', '0', '+10')
    .required(),
  location: Joi.string().allow('', null),
  profilePicture: Joi.string().allow('', null),
});

const register = async (req, res) => {
  const db = req.app.locals.db;
  for (let key in req.body) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      req.body[key.trim()] = req.body[key];
      if (key !== key.trim()) delete req.body[key];
    }
  }
  console.log(req.body);
  const validation = registerSchema.validate(req.body);
  if (validation.error) {
    console.log('Validation Error:', validation.error.details[0].message);
    return res.status(400).json({ error: validation.error.details[0].message });
  }

  const { firstName, lastName, email, password, location, skillLevel } =
    req.body;

  //Check if user already exists
  try {
    const existingUser = await db.collection(US_COLL).findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      firstName,
      lastName,
      email,
      hashedPassword,
      skillLevel,
      location,
      profilePicture: req.file ? req.file.path : null,
      connections: [],
      receivedRequests: [],
      sentRequests: [],
    };

    const result = await db.collection(US_COLL).insertOne(newUser);

    res.status(201).json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// User login
const login = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { email, password } = req.body;

    // Check if user exists
    const user = await db.collection(US_COLL).findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { ...user, password: undefined } }); // Don't return hashed password
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { register, login };
