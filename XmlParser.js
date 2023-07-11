const xml2js = require('xml2js');

class XmlParser {
  parse(xmlData) {
    return new Promise((resolve, reject) => {
      console.log(xmlData);
      xml2js.parseString(xmlData, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = XmlParser;
