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
  const { _id } = req.params;

  if (req.params._id !== req.user._id) {
    return res.status(403).json({
      message: 'You can only update your own profile',
    });
  }

  // Validate incoming data
  if (req.body.email && !req.body.email.includes('@')) {
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
      return res.status(404).json({ message: 'User not found.' });
    }

    const updateOperation = { $set: req.body };

    const result = await db
      .collection(US_COLL)
      .findOneAndUpdate(filter, updateOperation, {
        returnDocument: 'after',
      });

    const updatedUser = result.value;

    if (updatedUser) {
      delete updatedUser.hashedPassword;
      delete updatedUser.password; // Ensure raw password is not exposed
      return res
        .status(200)
        .json({ status: 200, data: updatedUser, message: 'Success' });
    } else {
      return res.status(404).json({
        status: 404,
        message: 'User not found or no updates required.',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while updating the user profile.',
      error: error.message,
    });
  }
};

//Delete Profile.

const deleteUser = async (req, res) => {
  const deleteUser = async (req, res) => {
    const db = req.app.locals.db;
    const { _id } = req.params;

    if (req.params._id !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({
        message: 'You can only delete your own profile or must be an admin',
      });
    }

    try {
      const result = await db
        .collection(US_COLL)
        .deleteOne({ _id: new ObjectId(_id) });

      if (result.deletedCount > 0) {
        return res.status(200).json({
          message: 'User deleted successfully',
        });
      } else {
        return res.status(404).json({
          message: 'User not found',
        });
      }
    } catch (error) {
      console.error('Error while deleting user:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
      });
    }
  };
};

// Google Api handlers //

const geocodeAddress = async (address) => {
  try {
    if (!address) {
      throw new Error('No address provided');
    }
    const response = await googleMapsClient.geocode({ address }).asPromise();
    //console.log('Google Maps Response:', response.json); // debugging the shape of the response.

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

  //Input validation
  if (!name || !indoorOrOutdoor || !openingHours || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Geocode the address to get lat/lng
    const geocodedAddress = await geocodeAddress(address);

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

// Match Board handlers //
const createMatch = async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Use the _id directly from req.user
    const organizerId = req.user._id;
    const organizerName = req.user.firstName;

    const { dateTime, address, skillLevel, type, organizer } = req.body;

    if (!dateTime || !address || !skillLevel || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const match = {
      dateTime,
      address,
      skillLevel,
      type,
      organizer: organizerId,
      player: organizerName,
    };

    const result = await db.collection(MTCH_COLL).insertOne(match);

    res.status(201).json({
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMatches = async (req, res) => {
  const db = req.app.locals.db;

  try {
    const matches = await db.collection(MTCH_COLL).find().toArray();

    if (matches.length > 0) {
      return res
        .status(200)
        .json({ status: 200, data: matches, message: 'success!' });
    } else {
      return res
        .status(404)
        .json({ status: 404, message: 'No matches found!' });
    }
  } catch (error) {
    console.log('Error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch matches', reason: error.message });
  }
};

const deleteMatch = async (req, res) => {
  const db = req.app.locals.db;
  const { _id } = req.params;

  try {
    const result = await db
      .collection(MTCH_COLL)
      .deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount > 0) {
      return res.status(200).json({
        message: 'Match deleted successfully',
      });
    } else {
      return res.status(404).json({
        message: 'Match not found',
      });
    }
  } catch (error) {
    console.error('Error while deleting match:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  createCourt,
  getCourts,
  geocodeAddress,
  createMatch,
  getMatches,
};
