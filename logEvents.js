const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = async (message) => {
  const id = uuid();
  const dateTime = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss');
  const logItem = `${dateTime}\t${id}\t${message}`;

  try {
    if (!fs.existsSync(path.join(__dirname, 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, 'logs'));
    }

    await fsPromises.appendFile(
      path.join(__dirname, 'logs', 'eventLog.txt'),
      logItem
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = logEvents;
