const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = async (message, logName) => {
  const id = uuid();
  const dateTime = format(new Date(), '\nyyyy-MM-dd\tHH:mm:ss');
  const logItem = `\t${dateTime}\t${id}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
    }

    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', logName),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logEvents, logger };
