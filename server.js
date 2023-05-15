const express = require('express');
const cors = require('cors');
const path = require('path');
// const logEvents = require('./middleware/logEvents');
const { logger } = require('./middleware/logEvents');
const PORT = process.env.PORT || 3500;

const app = express();

// custom middleware logger
app.use(logger);

// cross origin resources sharing
const whitelist = [
  'https://www.google.com',
  'https://www.google.com/',
  'http://localhost:3500/',
  'http://localhost:3500',
  'localhost:3500/',
  'localhost:3500',
  'http://127.0.0.1:5500',
];

var corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors());

// for form data
app.use(express.urlencoded({ extended: false }));

// for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|index(.html)?', (req, res) =>
  // res.sendFile('./views/index.html', { root: __dirname })
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
);

app.get('/new-page(.html)?', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
);

app.get('/old-page(.html)?', (req, res) => {
  res.redirect(301, '/new-page.html');
});

app.get(
  '/hello(.html)?',
  (req, res, next) => {
    console.log('attempted to load hello.html');
    next();
  },
  (req, res) => res.send('Hello World')
);

const one = (req, res, next) => {
  console.log('one');
  next();
};

const two = (req, res, next) => {
  console.log('two');
  next();
};

const three = (req, res, next) => {
  console.log('three');
  res.send('Finished!');
};

app.get('/chain(.html)?', [one, two, three]);

app.get('/*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(PORT, () => console.log(`Server is running on Port:${PORT}`));
