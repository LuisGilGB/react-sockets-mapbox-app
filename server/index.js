const Server = require("./models/Server");
require("dotenv").config();

const server = new Server();

server.run();
