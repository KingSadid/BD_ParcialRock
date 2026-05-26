class DataTransformer {
  transform(rawData) {
    const bandMap = this.buildBandMap(rawData);
    const canonicalBands = this.extractCanonicalBands(bandMap);

    return {
      events: this.extractEvents(rawData),
      bands: canonicalBands,
      people: this.extractPeople(rawData),
      eventBands: this.extractEventBands(rawData, bandMap),
      attendances: this.extractAttendances(rawData)
    };
  }

  buildBandMap(rawData) {
    const bandRecords = rawData.filter(record => record.tipo === 'banda');
    const map = new Map();

    for (const record of bandRecords) {
      const normalized = this.normalizeBandName(record.nombre);

      if (!map.has(normalized)) {
        map.set(normalized, {
          canonicalId: record.id,
          canonicalName: this.toTitleCase(record.nombre),
          foundedYear: record.ano_fundacion
        });
      }
    }

    return map;
  }

  extractCanonicalBands(bandMap) {
    const bands = [];
    for (const entry of bandMap.values()) {
      bands.push({
        id: entry.canonicalId,
        name: entry.canonicalName,
        foundedYear: entry.foundedYear
      });
    }
    return bands;
  }

  extractEvents(rawData) {
    return rawData
      .filter(record => record.tipo === 'toque')
      .map(record => ({
        id: record.id,
        name: record.nombre,
        eventDate: record.fecha,
        location: record.lugar
      }));
  }

  extractPeople(rawData) {
    return rawData
      .filter(record => record.tipo === 'persona')
      .map(record => {
        const ageResult = this.resolveAge(record.edad);
        return {
          id: record.id,
          fullName: record.nombres,
          idNumber: record.cedula,
          age: ageResult.age,
          ageType: ageResult.ageType
        };
      });
  }

  resolveAge(rawAge) {
    if (rawAge === undefined || rawAge === null) {
      return { age: null, ageType: 'unknown' };
    }

    if (typeof rawAge === 'number') {
      if (rawAge > 0) {
        return { age: rawAge, ageType: 'numeric' };
      }
      return { age: null, ageType: 'unknown' };
    }

    if (typeof rawAge === 'string') {
      return { age: null, ageType: rawAge };
    }

    return { age: null, ageType: 'unknown' };
  }

  extractEventBands(rawData, bandMap) {
    const relations = [];
    const toques = rawData.filter(record => record.tipo === 'toque');

    for (const toque of toques) {
      for (const bandName of toque.bandas) {
        const normalized = this.normalizeBandName(bandName);
        const bandEntry = bandMap.get(normalized);

        if (bandEntry) {
          relations.push({
            eventId: toque.id,
            bandId: bandEntry.canonicalId
          });
        }
      }
    }

    return relations;
  }

  extractAttendances(rawData) {
    return rawData
      .filter(record => record.tipo === 'asistencia')
      .map(record => ({
        id: record.id,
        personId: record.persona_id,
        eventId: record.toque_id
      }));
  }

  normalizeBandName(name) {
    return name.toLowerCase().trim();
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, txt =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
}

module.exports = DataTransformer;
