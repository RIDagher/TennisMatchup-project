// routes.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  getUser,
  updateUser,
  getUsers,
  createCourt,
  getCourts,
  geocodeAddress,
  createMatch,
  getMatches,
} = require('../controllers/handlers');

const { register, login } = require('../controllers/auth');
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware');

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/assets');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

// Users routes //
router.get('/api/users', getUsers);
router.get('/api/user/:id', getUser);
router.post('/api/login', login);
router.put('/api/users/:_id', verifyToken, updateUser);
router.post('/api/register', upload.single('profilePicture'), register);

// Courts route //
router.get('/api/courts', getCourts);
router.post('/api/courts', upload.array('photos', 5), createCourt);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  keyGenerator: (req, res) => {
    return req.ip; // Use the IP address as the key
  },
});

// Matches Routes //
router.post('/api/matches', verifyToken, createMatch);
router.get('/api/matches', getMatches);
// router.get('/api/matches/:id', getMatch);
// router.put('/api/matches/:id', verifyToken, updateMatch);
// router.delete('/api/matches/:id', verifyToken, deleteMatch);

//  rate limiter middleware
router.get('/api/googlemapsapikey', limiter, (req, res) => {
  res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

router.get('/api/testgeocode', async (req, res) => {
  try {
    const result = await geocodeAddress(
      '1600 Amphitheatre Parkway, Mountain View, CA'
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Geocoding failed', reason: error.message });
  }
});

module.exports = router;
