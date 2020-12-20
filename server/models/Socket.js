class Socket {
  constructor(io, props = {}) {
    this.io = io;
    this.markers = {};

    this.addSocketEvents();
  }

  addSocketEvents() {
    this.io.on("connection", (socket) => {
      console.log("Socket client connected.");

      const emitUpdateData = () => {
        this.io.emit("update-data", {
          payload: {
            markers: this.markers,
          },
        });
      };

      socket.emit("connection-message", {
        msg: "Welcome to server!",
        date: new Date(),
      });
      socket.emit("update-data", {
        payload: {
          markers: this.markers,
        },
      });

      socket.on("add-marker", ({ payload }) => {
        this.addMarker(payload);
        emitUpdateData();
      });

      socket.on("update-marker", ({ payload }) => {
        this.updateMarker(payload);
        emitUpdateData();
      });
    });
  }

  addMarker({ id, ...markerProps }) {
    id ?? (this.markers[id] = { id, ...markerProps });
  }

  updateMarker({ id, ...updatedProps }) {
    id ?? (this.markers[id] = { ...this.markers[id], ...markerProps });
  }
}

module.exports = Socket;
