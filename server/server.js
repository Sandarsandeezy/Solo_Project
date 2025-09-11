import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import MissingPerson from './models/MissingPerson';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

// Derive __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

/**
 * handle parsing request body
 */
app.use(cors());
app.use(express.json());
dotenv.config();
const URI = process.env.MONGO_ATLAS;

mongoose
  .connect(URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
/**
 * handle requests for static files
 */

app.use('/assets', express.static(path.join(__dirname, '../client/assets')));
app.get('/', (req, res) => {
  res.status(200).json({ Hello: 'Hello world' });
});
app.post('/geocode', async (req, res) => {
  try {
    const { formData, address } = req.body;
    console.log('Kimmie', address);
    const {
      name,
      number,
      reportee,
      relationship,
      selectedDate,
      street,
      city,
      description,
    } = formData;
    const geoResponse = await axios.get(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
        address
      )}&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
    );
    const coords = geoResponse.data.features?.[0]?.geometry?.coordinates;
    console.log('coord', coords);
    const MissingPersonInfo = await MissingPerson.create({
      name,
      number,
      reportee,
      relationship,
      selectedDate: selectedDate ? new Date(selectedDate) : null,
      address: {
        street,
        city,
        full: address,
      },
      location: {
        type: 'Point',
        coordinates: coords, // [lng, lat]
      },
      description,
    });

    console.log('savin to DB', MissingPersonInfo);
    return res
      .status(200)
      .json({ data: MissingPersonInfo, coordinates: coords });
  } catch (error) {
    console.log('Error making Mapbox API request:', error.message);
    res.status(500).json({ error: 'Failed to fetch geocoding data' });
  }
});
app.get('/getAllPersons', async (req, res) => {
  try {
    const getPersons = await MissingPerson.find();

    // console.log('all perons', getPersons);
    console.log('Total people', getPersons.length);
    res.status(200).json({ persons: getPersons });
  } catch (error) {
    console.error('Error gettin all persons', error.message);
    res.status(500).json({ error: 'Failed to fetch all persons' });
  }
});
app.delete('/:id', async (req, res) => {
  // console.log('deleting id', req.params.id);
  const personid = req.params.id;
  try {
    const removePerson = await MissingPerson.findByIdAndDelete(personid);
    console.log('removedPerson', removePerson);
    res.status(200).json(removePerson);
  } catch (error) {
    console.error('Error deleting', error.message);
    res.status(500).json({ error: 'Failed to delete person' });
  }
});
// app.get('/', (req, res) => {
//   return res.sendFile(path.join(__dirname, '../index.html'));
// });

// // catch-all route handler for any requests to an unknown route
// app.use((req, res) => {
//   res.sendStatus(404);
// });

// /**
//  * configure express global error handler
//  */
app.use((err, req, res, next) => {
  console.log('error object received by Global Error Handler:', err);
  console.log('proof of type!:', typeof err);
  // defaultErr object
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  //over writing/merging the target with source error
  const errorObj = { ...defaultErr, ...err };
  //log error details internally
  console.log(errorObj.log);
  //send only safe error message to the client
  return res.status(errorObj.status).json(errorObj.message);
});

/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export default app;
