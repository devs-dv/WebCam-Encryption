const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connection = require("./config/db.js");
const router = require('./routes/video.route.js')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connection();
app.use('/api/v1',router)
app.get("/", (req, res) => {
  res.send("Server is Running! 🚀");
});

module.exports = app;
