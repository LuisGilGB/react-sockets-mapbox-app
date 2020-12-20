const MasrkersSet = require("./MarkersSet");

class Socket {
  constructor(io, props = {}) {
    this.io = io;
    this.markersSet = new MasrkersSet();

    this.addSocketEvents();
  }

  addSocketEvents() {
    this.io.on("connection", (socket) => {
      console.log("Socket client connected.");

      const broadcastServerUpdate = () => {
        socket.broadcast.emit("server-update", {
          payload: {
            markers: this.markersSet.markers,
          },
        });
      };

      socket.emit("connection-message", {
        msg: "Welcome to server!",
        date: new Date(),
      });
      socket.emit("server-update", {
        payload: {
          markers: this.markersSet.markers,
        },
      });

      socket.on("add-marker", ({ payload }) => {
        this.markersSet.addMarker(payload);
        broadcastServerUpdate();
      });

      socket.on("update-marker", ({ payload }) => {
        this.markersSet.updateMarker(payload);
        broadcastServerUpdate();
      });
    });
  }
}

module.exports = Socket;
