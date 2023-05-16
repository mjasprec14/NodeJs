const express = require('express');
const cors = require('cors');
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
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
  'http://127.0.0.1:5500',
];

var corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// for form data
app.use(express.urlencoded({ extended: false }));

// for json
app.use(express.json());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/subdir', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on Port:${PORT}`));
