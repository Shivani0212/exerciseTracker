// const express = require('express')
// const app = express()
// const cors = require('cors')
// require('dotenv').config()

// app.use(cors())
// app.use(express.static('public'))
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/views/index.html')
// });





// const listener = app.listen(process.env.PORT || 3000, () => {
//   console.log('Your app is listening on port ' + listener.address().port)
// })
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory data structures to store users and exercises
let users = [];
let exercises = [];

// POST endpoint to create a new user
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const newUser = { _id: generateUserId(), username };
  users.push(newUser);
  res.status(201).json(newUser);
});

// GET endpoint to retrieve all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// POST endpoint to add an exercise for a user
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const user = getUserById(_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const newExercise = {
    _id: generateExerciseId(),
    userId: _id,
    description,
    duration: Number(duration),
    date: date ? new Date(date) : new Date()
  };
  exercises.push(newExercise);
  res.status(201).json(newExercise);
});

// GET endpoint to retrieve exercise logs of a user
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const user = getUserById(_id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userExercises = exercises.filter(exercise => exercise.userId === _id);
  const log = userExercises.map(exercise => ({
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString()
  }));
  res.json({ username: user.username, count: log.length, _id: user._id, log });
});

// Helper function to generate a unique user ID
function generateUserId() {
  return Math.random().toString(36).substr(2, 9);
}

// Helper function to generate a unique exercise ID
function generateExerciseId() {
  return Math.random().toString(36).substr(2, 9);
}

// Helper function to get user by ID
function getUserById(id) {
  return users.find(user => user._id === id);
}

// Route for the root path to serve index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const port = process.env.PORT || 3000;
const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
