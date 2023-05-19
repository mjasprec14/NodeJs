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

module.exports = corsOptions;
