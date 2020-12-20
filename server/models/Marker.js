const { v4: uuidV4 } = require("uuid");

class Marker {
  constructor({ id, lat, lng }) {
    this.id = id ?? uuidV4();
    this.lat = lat ?? 0;
    this.lng = lng ?? 0;
  }

  updatePosition({ lat, lng }) {
    this.lat = lat ?? this.lat;
    this.lng = lng ?? this.lng;
  }
}

module.exports = Marker;
