const FirestoreService = require('../services/firestore.service');

class RawDataDao {
  constructor() {
    this.firestoreService = new FirestoreService('rawData');
  }

  async findAll() {
    return this.firestoreService.fetchAll();
  }
}

module.exports = RawDataDao;
