const RawDataDao = require('../dao/rawData.dao');
const EventDao = require('../dao/event.dao');
const BandDao = require('../dao/band.dao');
const PersonDao = require('../dao/person.dao');
const EventBandDao = require('../dao/eventBand.dao');
const AttendanceDao = require('../dao/attendance.dao');
const DataTransformer = require('../transformers/data.transformer');
const mysqlService = require('../services/mysql.service');

class EtlService {
  constructor() {
    this.rawDataDao = new RawDataDao();
    this.eventDao = new EventDao();
    this.bandDao = new BandDao();
    this.personDao = new PersonDao();
    this.eventBandDao = new EventBandDao();
    this.attendanceDao = new AttendanceDao();
    this.transformer = new DataTransformer();
  }

  async run() {
    console.log('Starting ETL pipeline...');

    const rawData = await this.rawDataDao.findAll();
    console.log(`Extracted ${rawData.length} raw records from Firestore`);

    const transformed = this.transformer.transform(rawData);
    console.log('Transformation complete');

    await this.load(transformed);
    console.log('ETL pipeline finished successfully');
  }

  async load(data) {
    await mysqlService.transaction(async () => {
      await this.clearTables();

      await this.bandDao.saveAll(data.bands);
      console.log(`Loaded ${data.bands.length} bands`);

      await this.eventDao.saveAll(data.events);
      console.log(`Loaded ${data.events.length} events`);

      await this.personDao.saveAll(data.people);
      console.log(`Loaded ${data.people.length} people`);

      await this.eventBandDao.saveAll(data.eventBands);
      console.log(`Loaded ${data.eventBands.length} event-band relations`);

      await this.attendanceDao.saveAll(data.attendances);
      console.log(`Loaded ${data.attendances.length} attendances`);
    });
  }

  async clearTables() {
    await mysqlService.query('DELETE FROM attendances');
    await mysqlService.query('DELETE FROM event_bands');
    await mysqlService.query('DELETE FROM people');
    await mysqlService.query('DELETE FROM events');
    await mysqlService.query('DELETE FROM bands');
    console.log('Cleared existing data from all tables');
  }
}

module.exports = new EtlService();
