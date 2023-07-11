class RecordEditor {
  edit(record, newData) {
    return { ...record, ...newData };
  }
}

module.exports = RecordEditor;
