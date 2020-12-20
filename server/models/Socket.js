class Socket {
  constructor(io, props = {}) {
    this.io = io;
    this.markers = {};

    this.addSocketEvents();
  }

  addSocketEvents() {
    this.io.on("connection", (socket) => {
      console.log("Socket client connected.");

      const broadcastServerUpdate = () => {
        socket.broadcast.emit("server-update", {
          payload: {
            markers: this.markers,
          },
        });
      };

      socket.emit("connection-message", {
        msg: "Welcome to server!",
        date: new Date(),
      });
      socket.emit("server-update", {
        payload: {
          markers: this.markers,
        },
      });

      socket.on("add-marker", ({ payload }) => {
        this.addMarker(payload);
        broadcastServerUpdate();
      });

      socket.on("update-marker", ({ payload }) => {
        this.updateMarker(payload);
        broadcastServerUpdate();
      });
    });
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
}

module.exports = Socket;
