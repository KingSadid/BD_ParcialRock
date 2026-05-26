const firestore = require('../env/firebaseConfig');

class FirestoreService {
  constructor(collectionName) {
    this.collection = firestore.collection(collectionName);
  }

  async fetchAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(document => ({
      id: document.id,
      ...document.data()
    }));
  }
}

module.exports = FirestoreService;
