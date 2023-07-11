const fs = require('fs');

class FileReader {
  read(file) {
    return fs.readFileSync(file, 'utf-8');
  }
}

module.exports = FileReader;
