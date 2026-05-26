const admin = require('firebase-admin');
const serviceAccount = require('../env/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();

const rawData = [
  { tipo: 'toque', id: 'TQ001', nombre: 'Noche de Rock en Matik-Matik', fecha: '2024-05-18', lugar: 'Matik-Matik, Chapinero, Bogota', bandas: ['Los Suziox', 'Diamante Electrico', 'Los Petitfellas'] },
  { tipo: 'toque', id: 'TQ002', nombre: 'Underground Sessions', fecha: '2024-07-13', lugar: 'Bar Latino, Bogota', bandas: ['LOS SUZIOX', 'Superlitio'] },
  { tipo: 'toque', id: 'TQ003', nombre: 'Rock al Aire Libre', fecha: '2024-09-28', lugar: 'Plaza de Bolivar, Chia', bandas: ['Diamante Electrico', 'los suziox', 'Superlitio'] },
  { tipo: 'toque', id: 'TQ004', nombre: 'Rocktubre', fecha: '2024-10-19', lugar: 'Teatron, Bogota', bandas: ['Los Petitfellas'] },
  { tipo: 'banda', id: 'B001', nombre: 'Los Suziox', ano_fundacion: 2002 },
  { tipo: 'banda', id: 'B002', nombre: 'LOS SUZIOX', ano_fundacion: 2002 },
  { tipo: 'banda', id: 'B003', nombre: 'los suziox', ano_fundacion: 2002 },
  { tipo: 'banda', id: 'B004', nombre: 'Diamante Electrico', ano_fundacion: 2012 },
  { tipo: 'banda', id: 'B005', nombre: 'Los Petitfellas', ano_fundacion: 2007 },
  { tipo: 'banda', id: 'B006', nombre: 'Superlitio', ano_fundacion: 1995 },
  { tipo: 'persona', id: 'P001', nombres: 'Liliana Mercado', cedula: '1043998877', edad: 27 },
  { tipo: 'persona', id: 'P002', nombres: 'Hugo Hernan Salcedo', cedula: '8456789', edad: null },
  { tipo: 'persona', id: 'P003', nombres: 'Elvira del Rosario Banquez', cedula: '22334455', edad: 0 },
  { tipo: 'persona', id: 'P004', nombres: 'Wilfrido Andres Pineda', cedula: '1140998877', edad: 'adulto' },
  { tipo: 'persona', id: 'P005', nombres: 'Ana Lucia Yepes', cedula: '32112233' },
  { tipo: 'asistencia', id: 'AS001', persona_id: 'P001', toque_id: 'TQ001' },
  { tipo: 'asistencia', id: 'AS002', persona_id: 'P002', toque_id: 'TQ001' },
  { tipo: 'asistencia', id: 'AS003', persona_id: 'P001', toque_id: 'TQ003' },
  { tipo: 'asistencia', id: 'AS004', persona_id: 'P003', toque_id: 'TQ002' },
  { tipo: 'asistencia', id: 'AS005', persona_id: 'P004', toque_id: 'TQ004' }
];

async function seed() {
  const batch = firestore.batch();
  const collection = firestore.collection('rawData');

  for (const record of rawData) {
    const document = collection.doc(record.id);
    batch.set(document, record);
  }

  await batch.commit();
  console.log(`Seeded ${rawData.length} documents into rawData`);
}

seed().catch(error => {
  console.error('Seed failed:', error);
  process.exit(1);
});
