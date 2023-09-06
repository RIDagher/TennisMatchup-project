'use strict';

const { ObjectId } = require('mongodb');
const { DB_NAME, US_COLL, CRT_COLL, MTCH_COLL } = require('../constants');
require('dotenv').config();

//GoogleMaps
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise,
});

const getUsers = async (req, res) => {
  const db = req.app.locals.db;

  try {
    const users = await db.collection(US_COLL).find().toArray();

    if (users.length > 0) {
      return res
        .status(200)
        .json({ status: 200, data: users, message: 'success!' });
    } else {
      return res.status(404).json({ status: 404, message: 'No users found!' });
    }
  } catch (error) {
    console.log('Error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch users', reason: error.message });
  }
};

const getUser = async (req, res) => {
  const db = req.app.locals.db;

  try {
    const user = await db
      .collection(US_COLL)
      .findOne({ _id: new ObjectId(req.params._id) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    //  hashedPassword from the response
    const userWithoutPassword = { ...user, hashedPassword: undefined };
    res.json(userWithoutPassword);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch user', reason: error.message });
  }
};

const updateUser = async (req, res) => {
  console.log('Update User Data:', req.body);
  const { _id } = req.params;
  console.log(
    'User ID from request params:',
    req.params._id,
    typeof req.params._id
  );
  console.log('User ID from token:', req.user._id, typeof req.user._id);

  if (req.params._id !== req.user._id) {
    console.log('Request ID and Token ID mismatch');
    return res.status(403).json({
      message: 'You can only update your own profile',
    });
  }

  // Validate incoming data
  if (req.body.email && !req.body.email.includes('@')) {
    console.log('Invalid email format');
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // Sanitize data
  delete req.body.isAdmin;

  try {
    const db = req.app.locals.db;
    const filter = { _id: new ObjectId(_id) };

    // Check if user exists
    const existingUser = await db.collection(US_COLL).findOne(filter);
    if (!existingUser) {
      console.log('User not found in the database');
      return res.status(404).json({ message: 'User not found.' });
    }

    const updateOperation = { $set: req.body };
    console.log('Filter:', filter);
    console.log('Update Operation:', updateOperation);

    const result = await db
      .collection(US_COLL)
      .findOneAndUpdate(filter, updateOperation, {
        returnDocument: 'after',
      });
    console.log('Is result.value undefined?', result.value === undefined);
    console.log('Is result.value null?', result.value === null);

    console.log('Complete Update Result:', result);

    const updatedUser = result.value;

    if (updatedUser) {
      console.log('Update successful, sending 200 Success response');
      delete updatedUser.hashedPassword;
      delete updatedUser.password; // Ensure raw password is not exposed
      return res
        .status(200)
        .json({ status: 200, data: updatedUser, message: 'Success' });
    } else {
      console.log(
        'No updates made to the user, sending 404 Not Found response'
      );
      return res.status(404).json({
        status: 404,
        message: 'User not found or no updates required.',
      });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({
      message: 'An error occurred while updating the user profile.',
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {};

//court Schema
/*const courtSchema = Joi.object({
  name: Joi.string().min(2).required(),
  indoor: Joi.boolean().required(),
  openingHours: Joi.string().required(),
  location: Joi.string().required(),
  photos: Joi.array().items(Joi.string())


  // And use this in the createCourt handler
const validation = courtSchema.validate(req.body);
if (validation.error) {
    return res.status(400).json({ error: validation.error.details[0].message });
}
}); */

/*const createCourt = async (req, res) => {
  const db = req.app.locals.db;
  const { name, indoorOrOutdoor, openingHours, location } = req.body;

  //Input validation
  if (!name || !indoorOrOutdoor || !openingHours || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  //Create court object

  const court = {
    name,
    indoorOrOutdoor,
    openingHours,
    location,
    photos: req.files ? req.files.map((file) => file.path) : [],
  };

  //Insert into DB with error handling
  try {
    const result = await db.collection(CRT_COLL).insertOne(court);

    if (!result.acknowledged) {
      throw new Error('Court was not saved in the database');
    }

    res.status(201).json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.log('Error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to create court', reason: error.message });
  }
}; */

// Google Api handlers //

const geocodeAddress = async (address) => {
  try {
    if (!address) {
      throw new Error('No address provided');
    }
    const response = await googleMapsClient.geocode({ address }).asPromise();
    console.log('Google Maps Response:', response.json); // debugging the shape of the response.

    if (response.json.results && response.json.results.length > 0) {
      const location = response.json.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error('No results found for this address');
    }
  } catch (err) {
    console.error('Geocoding error:', err);
    throw err;
  }
};

const createCourt = async (req, res) => {
  const db = req.app.locals.db;
  const { name, indoorOrOutdoor, openingHours, address } = req.body;
  console.log('Received files:', req.files);
  //Input validation
  if (!name || !indoorOrOutdoor || !openingHours || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Geocode the address to get lat/lng
    const geocodedAddress = await geocodeAddress(address);
    console.log('Geocoded address:', geocodedAddress);

    if (!geocodedAddress || !geocodedAddress.lat || !geocodedAddress.lng) {
      throw new Error('Failed to geocode the address.');
    }

    //  Court object with the geocoded location
    const court = {
      name,
      indoorOrOutdoor,
      openingHours,
      location: geocodedAddress,
      address, // This will be in the format { lat: x, lng: y }
      photos: req.files ? req.files.map((file) => file.path) : [],
    };
    console.log('Received files:', req.files);
    console.log('Inserting court:', court);
    const result = await db.collection(CRT_COLL).insertOne(court);
    console.log('Insert result:', result);
    if (!result.acknowledged) {
      console.log('DB insert error:', result);
      throw new Error('Court was not saved in the database');
    }

    res.status(201).json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.log('Error:', error);

    return res
      .status(500)
      .json({ error: 'Failed to create court', reason: error.message });
  }
};

const getCourts = async (req, res) => {
  const db = req.app.locals.db;

  try {
    const courts = await db.collection(CRT_COLL).find().toArray();

    if (courts.length > 0) {
      return res
        .status(200)
        .json({ status: 200, data: courts, message: 'success!' });
    } else {
      return res.status(404).json({ status: 404, message: 'No courts found!' });
    }
  } catch (error) {
    console.log('Error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch courts', reason: error.message });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  createCourt,
  getCourts,
  geocodeAddress,
};
