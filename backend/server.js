const express = require("express");
const db = require("./db");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

//show all donors

app.get("/donors", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM blood_donors");
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//creating a new donor

app.post("/become-a-donor", async (req, res) => {
  try {
    const donorData = req.body;
    const insertQuery = `INSERT INTO blood_donors (donorname, dateofbirth, bloodgroup, location, disease, contact) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const result = await db.query(insertQuery, [
      donorData.fullName,
      donorData.DOB,
      donorData.bloodGroup,
      donorData.location,
      donorData.disease || null, // Handle optional disease field
      donorData.contactNumber,
    ]);
    // console.log("Received donor data:", donorData);
    res.status(201).json({ message: "Donor registration successful" });
  } catch (err) {
    console.error("Error processing donor registration:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//getting detail for a specific donor
app.get("/donors/:donorid", async (req, res) => {
  try {
    const id = await req.params.donorid;
    // console.log(id);
    const result = await db.query(
      `SELECT * FROM blood_donors WHERE donorid =${id} `
    );

    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
