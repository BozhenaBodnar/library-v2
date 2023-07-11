const FileFormatConverter = require('./FileFormatConverter');
const FileReader = require('./FileReader');
const XmlParser = require('./XmlParser');
const Record = require('./Record');

async function main() {
  const converter = new FileFormatConverter(new XmlParser());
  
  await converter.read('data.xml', 'xml');
  console.log();
  const newRecord = new Record('20.07.2023', 'Tesla Model 3', 50000);
  converter.addRecord(newRecord);
  
  converter.editRecord(1, { price: 55000 });
  
  converter.deleteRecord(0);
  
  const xmlData = converter.convertToXml();
  console.log('Converted XML:', xmlData);
  
  const binaryData = converter.convertToBinary();
  console.log('Converted Binary:', binaryData);
}

main().catch((error) => {
  console.error('An error occurred:', error.message);
});
