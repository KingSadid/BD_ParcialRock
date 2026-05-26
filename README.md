# ETL Pipeline - Dataset C (Toques de Rock Locales)

Sistema de extraccion, transformacion y carga de datos heterogeneos desde Firestore hacia MySQL.
Proyecto desarrollado para el parcial practico de Bases de Datos.

## Requisitos Previos

- Node.js (v18 o superior)
- MySQL Server (v8.0 o superior)
- Acceso a Firebase Console (proyecto sadiddatabase)

## Configuracion Inicial

### 1. Base de Datos MySQL

Ejecutar el script de esquema para crear la base de datos y las 5 tablas:

```bash
mysql -u root -p < schema.sql
```

Esto crea la base de datos `local_rock_events` con las tablas:
- `events` (toques)
- `bands` (bandas normalizadas)
- `people` (asistentes con edad tipificada)
- `event_bands` (relacion M:N evento-banda)
- `attendances` (relacion M:N persona-evento)

### 2. Dependencias Node.js

Desde la raiz del proyecto ejecutar:

```bash
npm install
```

Esto instala `firebase-admin`, `mysql2` y `dotenv`.

### 3. Firebase Firestore

El proyecto ya incluye las credenciales de servicio en `env/serviceAccountKey.json`.

El evaluador debe verificar que la base de datos Firestore este activa en el proyecto `sadiddatabase` desde Firebase Console:
- URL: https://console.firebase.google.com/project/sadiddatabase/firestore
- Si no existe, crearla en modo prueba o produccion.

## Ejecucion Paso a Paso

### Paso 1: Cargar Dataset Crudo a Firestore (Tarea 1)

Sube los 20 registros heterogeneos tal cual al arreglo original, sin modificacion, a la coleccion `rawData`:

```bash
node scripts/seed_firestore.js
```

Salida esperada:
```
Seeded 20 documents into rawData
```

Verificacion: En Firebase Console, dentro de la coleccion `rawData`, deben existir exactamente 20 documentos con los IDs originales (TQ001-TQ004, B001-B006, P001-P005, AS001-AS005).

### Paso 2: Ejecutar el Pipeline ETL (Tarea 3)

Extrae desde Firestore, transforma segun las reglas documentadas en `decisiones.txt`, y carga en MySQL:

```bash
node etl.js
```

Salida esperada:
```
Starting ETL pipeline...
Extracted 20 raw records from Firestore
Transformation complete
Loaded 4 bands
Loaded 4 events
Loaded 5 people
Loaded 9 event-band relations
Loaded 5 attendances
ETL pipeline finished successfully
```

### Paso 3: Verificar Resultados en MySQL

Ejecutar las siguientes consultas para validar la transformacion:

#### Bandas unicas (duplicados por capitalizacion resueltos)
```sql
SELECT * FROM local_rock_events.bands;
```
Esperado: 4 registros unicos. Los Suziox aparece una sola vez (las variantes LOS SUZIOX y los suziox fueron normalizadas al ID B001).

#### Eventos
```sql
SELECT * FROM local_rock_events.events;
```
Esperado: 4 registros (TQ001 a TQ004).

#### Personas con edad tipificada
```sql
SELECT * FROM local_rock_events.people;
```
Esperado:
- P001: age = 27, age_type = 'numeric'
- P002: age = NULL, age_type = 'unknown' (valor nulo original)
- P003: age = NULL, age_type = 'unknown' (valor 0 interpretado como desconocido)
- P004: age = NULL, age_type = 'adulto' (valor string preservado como categorico)
- P005: age = NULL, age_type = 'unknown' (campo ausente en el origen)

#### Relaciones evento-banda
```sql
SELECT * FROM local_rock_events.event_bands;
```
Esperado: 9 registros. TQ001 tiene 3 bandas, TQ002 tiene 2, TQ003 tiene 3, TQ004 tiene 1.

#### Asistencias
```sql
SELECT * FROM local_rock_events.attendances;
```
Esperado: 5 registros (AS001 a AS005).

## Estructura del Proyecto

```
rock-etl/
├── dao/                    # Objetos de acceso a datos (persistencia por entidad)
│   ├── rawData.dao.js      # Lectura desde Firestore
│   ├── event.dao.js
│   ├── band.dao.js
│   ├── person.dao.js
│   ├── eventBand.dao.js
│   └── attendance.dao.js
├── env/
│   ├── mysqlConfig.js      # Pool de conexiones MySQL
│   └── firebaseConfig.js   # Inicializacion Firebase Admin
├── services/
│   ├── mysql.service.js    # Abstraccion de queries y transacciones
│   ├── firestore.service.js # Abstraccion de lectura Firestore
│   └── etl.service.js      # Orquestador del pipeline
├── transformers/
│   └── data.transformer.js # Logica pura de limpieza y normalizacion
├── scripts/
│   └── seed_firestore.js   # Carga inicial del dataset crudo
├── routes/
│   └── etl.routes.js       # Router HTTP (POST /run-etl)
├── public/
│   └── index.html          # Pagina de estado del servicio
├── schema.sql              # Creacion de la base de datos y tablas
├── decisiones.txt          # Hallazgos, decisiones de diseno y reglas de transformacion
├── etl.js                  # Entry point del pipeline
├── server.js               # Servidor HTTP opcional
└── package.json
```

## Decisiones de Diseno Resumidas

1. **Normalizacion de bandas**: Se identifican duplicados comparando nombres en minusculas. Se conserva el primer ID encontrado como canonical (B001 para Los Suziox) y se descartan los registros duplicados (B002, B003).

2. **Resolucion de edades**: Se tipifican en dos columnas: `age` (valor numerico o NULL) y `age_type` (descriptor del caso). Esto permite almacenar tanto valores numericos como categoricos sin perder semantica.

3. **Modelo relacional**: 5 tablas exactas. Descomposicion del arreglo heterogeneo en entidades normalizadas con relaciones M:N explicitas.

4. **Transaccionalidad**: La carga en MySQL se ejecuta dentro de una transaccion. Si falla cualquier insercion, se revierte todo el lote.

## Servidor HTTP (Opcional)

Si se prefiere ejecutar via endpoint REST:

```bash
npm start
```

Luego enviar POST a `http://localhost:3000/run-etl`.

## Notas para el Evaluador

- El dataset original no fue modificado en ningun momento. La coleccion `rawData` en Firestore es un espejo exacto del arreglo entregado.
- Toda la limpieza, normalizacion y resolucion de inconsistencias ocurre dentro del ETL, documentada en `decisiones.txt`.
- Los codigos fuente siguen los principios SOLID, DRY y KISS. Cada clase tiene una unica responsabilidad y los nombres son autoexplicativos.
