const Record = require('./Record');

class BinaryParser {
  parse(buffer) {
    const recordsCount = buffer.readInt32LE(2);
    let offset = 6;
    const records = [];
    for (let i = 0; i < recordsCount; i++) {
      const date = buffer.slice(offset, offset + 8).toString('utf8');
      offset += 8;
      const brandNameLength = buffer.readInt16LE(offset);
      offset += 2;
      const brandName = buffer.slice(offset, offset + brandNameLength * 2).toString('utf16le');
      offset += brandNameLength * 2;
      const price = buffer.readInt32LE(offset);
      offset += 4;
      records.push(new Record(date, brandName, price));
    }
    return records;
  }
}

module.exports = BinaryParser;
