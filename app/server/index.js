const express = require("express");
const cors = require("cors");
const caseRoute = require("./route/caseRoute.js")

const app = express();

  app.listen(8080, () => {
    console.log(`API for Missing Persons Tracker`);
  });
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options('*', cors());

//Routes
app.use("/case", caseRoute);