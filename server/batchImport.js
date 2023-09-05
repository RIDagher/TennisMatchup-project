const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const { users } = require('./data');
const { DB_NAME, US_COLL, MTCH_COLL } = require('./constants');

const batchImportUsers = async () => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    console.log('Connected!');

    const db = client.db(DB_NAME);
    const result = await db.collection(US_COLL).insertMany(users);
    console.log(result);
    if (result.acknowledged === true && result.insertedCount === users.length) {
      console.log('Users batch import was successfull!');
    } else {
      console.log('Something went wrong, check MongoDB');
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
    console.log('Disconnected!');
  }
};

//batchImportUsers();
