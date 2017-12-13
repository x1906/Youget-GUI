import fs from 'fs';

const LOG_FILE = 'error.log';

class Logger {
  static info(info) {
    fs.appendFileSync(LOG_FILE, info.toString(), (err) => {
      console.error(err);
    });
  }
  static error(error) {
    console.error(error.stack);
    fs.appendFileSync(LOG_FILE, error.stack, (err) => {
      console.error(err);
    });
  }
}


export default Logger;
