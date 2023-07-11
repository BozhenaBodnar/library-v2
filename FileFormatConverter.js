const fs = require('fs');
const xml2js = require('xml2js');
const Record = require('./Record');
const RecordEditor = require('./RecordEditor');

class FileFormatConverter {
  constructor(parser) {
    this.records = [];
    this.parser = parser;
  }

  async read(file, format) {
    const xmlData = fs.readFileSync(file, 'utf-8');
    const fileData = await this.parser.parse(xmlData);
    if (format === 'xml') {
      this.readXmlFile(fileData);
    } else if (format === 'binary') {
      this.readBinaryFile(fileData);
    } else {
      throw new Error('Unsupported file format.');
    }
  }

  readXmlFile(xmlData) {
    const cars = xmlData.Document.Car;
    if (cars) {
      for (const car of cars) {
        const date = car.Date[0];
        const brandName = car.BrandName[0];
        const price = parseInt(car.Price[0]);
        this.records.push(new Record(date, brandName, price));
      }
    }
  }

  readBinaryFile(buffer) {
    const binaryParser = new BinaryParser();
    this.records = binaryParser.parse(buffer);
  }

  editRecord(index, newData) {
    if (index >= 0 && index < this.records.length) {
      const recordEditor = new RecordEditor();
      this.records[index] = recordEditor.edit(this.records[index], newData);
    } else {
      throw new Error('Invalid record index.');
    }
  }

  addRecord(record) {
    this.records.push(record);
  }

  deleteRecord(index) {
    if (index >= 0 && index < this.records.length) {
      this.records.splice(index, 1);
    } else {
      throw new Error('Invalid record index.');
    }
  }

  convertToXml() {
    const xmlObj = {
      Document: {
        Car: this.records.map((record) => ({
          Date: record.date,
          BrandName: record.brandName,
          Price: record.price.toString(),
        })),
      },
    };
    const builder = new xml2js.Builder();
    return builder.buildObject(xmlObj);
  }

  convertToBinary() {
    const maxBrandNameLength = this.calculateMaxBrandNameLength();
    const bufferSize = 6 + this.records.length * (14 + maxBrandNameLength * 2);
    const buffer = Buffer.alloc(bufferSize);
    buffer.writeInt16LE(0x2526, 0);
    buffer.writeInt32LE(this.records.length, 2); 
    let offset = 6;
    for (const record of this.records) {
      buffer.write(record.date, offset, 8, 'utf8');
      offset += 8;
      const brandNameLength = Buffer.byteLength(record.brandName, 'utf16le') / 2;
      buffer.writeInt16LE(brandNameLength, offset);
      offset += 2;
      buffer.write(record.brandName, offset, brandNameLength * 2, 'utf16le');
      offset += brandNameLength * 2;
      buffer.writeInt32LE(record.price, offset);
      offset += 4;
    }
    return buffer;
  }

  calculateMaxBrandNameLength() {
    let maxBrandNameLength = 0;
    for (const record of this.records) {
      const brandNameLength = Buffer.byteLength(record.brandName, 'utf16le') / 2;
      maxBrandNameLength = Math.max(maxBrandNameLength, brandNameLength);
    }
    return maxBrandNameLength;
  }
}

module.exports = FileFormatConverter;
