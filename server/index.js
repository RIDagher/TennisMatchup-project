const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const multer = require('multer');
const cors = require('cors');
const userRoutes = require('./routes/routes');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const { DB_NAME } = require('./constants');
const { error } = require('console');

const port = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(morgan('tiny'));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// File Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/assets'),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Routes
app.use(userRoutes);

// Test route
app.get('/api/test', (req, res) =>
  res.status(200).json({ message: 'hello world!' })
);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// MongoDB Connection & Server start
const options = { useNewUrlParser: true, useUnifiedTopology: true };

MongoClient.connect(process.env.MONGO_URI, options)
  .then((client) => {
    console.log('Connected to MongoDB');
    app.locals.db = client.db(DB_NAME);
    app.listen(port, () =>
      console.log(`Server is up and listening at port: ${port}`)
    );
  })
  .catch((error) =>
    console.error(`Failed to connect to MongoDB: ${error.message}`)
  );
