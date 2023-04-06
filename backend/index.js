// Check all required environment variables were passed in.
const process = require('process');
[
  'DB_HOST',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_SCHEMA',
  'DEMO_USER_ID'
].forEach(v => {
  if (!process.env[v]) {
    console.log(`Environment variable ${v} not supplied.`);
    process.exit(1);
  }
})

// Set up Express.
const express = require('express');
const app = express();
app.use(express.json());

// Session middleware. In a real application we would put actual logic here.
// For this coding challenge, it's sufficient to hard-code the user ID.
app.use((req, res, next) => {
  req.session = {
    user: {
      id: process.env.DEMO_USER_ID
    }
  };
  next();
});

// Import the DB client.
const DB = require('./db');
const db = new DB();

// Import the HTTP handlers.
const Handlers = require('./handlers');
const handlers = new Handlers(db);

// Set up the endpoints.
const URL_BASE = '/api';

// Get all jobs.
app.get(URL_BASE + '/jobs', async (req, res) => {
  handlers.getJobs(req, res);
});

// Get a single job.
app.get(URL_BASE + '/jobs/:id', async (req, res) => {
  handlers.getJob(req, res);
});

// Raise a job.
app.post(URL_BASE + '/jobs', async (req, res) => {
  handlers.raiseJob(req, res);
});

// Get all properties.
app.get(URL_BASE + '/properties', async (req, res) => {
  handlers.getProperties(req, res);
})

// Handle uncaught exceptions.
process.on('uncaughtException', err => {
  console.log(err);
});

// Start Express.
app.listen(3000, () => {
  console.log('Backend listening on 3000...');
});