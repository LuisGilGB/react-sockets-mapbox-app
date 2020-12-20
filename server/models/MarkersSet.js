class MasrkersSet {
  constructor() {
    this.markers = {};
  }

  getMarkers() {
    return this.markers;
  }

  addMarker({ id, ...markerProps }) {
    if (id) {
      this.markers[id] = { id, ...markerProps };
    }
  }

  updateMarker({ id, ...updatedProps }) {
    if (id) {
      this.markers[id] = { ...this.markers[id], ...updatedProps };
    }
  }

  deleteMarker(id) {
    delete this.markers[id];
  }
}

module.exports = MasrkersSet;
