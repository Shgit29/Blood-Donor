const express = require("express");
const db = require("./db");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
// const requireLogin = require("./middleware");

const session = require("express-session");
const app = express();
app.use(cors());
app.use(bodyParser.json());

// const sessionConfig = {
//   secret: "bettersecret",
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: true,
//   },
// };
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key", // Replace with a secure random string
    resave: false,
    saveUninitialized: false,
  })
);

//show all donors

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.status(401).send("Unauthorized");
    // console.log(req.session);
  }
  next();
};

app.get("/donors", requireLogin, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM blood_donors");
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//creating a new donor

app.post("/become-a-donor", requireLogin, async (req, res) => {
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
    const id = req.params.donorid;
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

app.put("/donors/:donorid", async (req, res) => {
  try {
    const donorId = req.params.donorid;
    const updatedData = req.body;

    const updateQuery = `
      UPDATE blood_donors 
      SET 
        donorname = $1, 
        dateofbirth = $2, 
        bloodgroup = $3, 
        location = $4, 
        disease = $5, 
        contact = $6 
      WHERE 
        donorid = $7
      RETURNING *`;

    const result = await db.query(updateQuery, [
      updatedData.fullName,
      updatedData.DOB,
      updatedData.bloodGroup,
      updatedData.location,
      updatedData.disease || null,
      updatedData.contactNumber,
      donorId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.json({
      message: "Donor updated successfully",
      updatedDonor: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating donor:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/donors/:donorid", async (req, res) => {
  try {
    const donorId = parseInt(req.params.donorid); // Parse donorId as integer

    if (isNaN(donorId)) {
      // Check if donorId is a valid integer
      return res.status(400).json({ message: "Invalid donor ID" });
    }

    // Perform deletion operation in the database
    const deleteQuery = `DELETE FROM blood_donors WHERE donorid = $1`;
    const result = await db.query(deleteQuery, [donorId]);

    if (result.rowCount === 0) {
      // If no rows were affected, it means the donor with the provided ID does not exist
      return res.status(404).json({ message: "Donor not found" });
    }

    // Donor successfully deleted
    res.status(200).json({ message: "Donor deleted successfully" });
  } catch (error) {
    console.error("Error deleting donor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//user routes

app.post("/users/register", async (req, res) => {
  const { password, username, email } = req.body;

  try {
    const hash = await bcrypt.hash(password, 12);

    const query = {
      text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING userid",
      values: [username, email, hash],
    };

    const result = await db.query(query);
    const userId = result.rows[0].userid;

    req.session.user_id = userId;
    console.log(req.session);

    res.status(200).send("User registered successfully");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Error registering user");
  }
});

app.post("/users/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Retrieve the user from the database based on the provided username
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };

    const result = await db.query(query);

    if (result.rows.length === 0) {
      return res.status(401).send("User not found");
    }

    const user = result.rows[0];

    // Compare the hashed password stored in the database with the password provided by the user
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send("Incorrect password");
    }

    // Store user's unique identifier in the session
    req.session.user_id = user.userid;
    console.log(req.session);

    // Authentication successful
    res.status(200).send("Login successful");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error during login");
  }
});
// Logout route
app.post("/users/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error logging out");
    }
    res.status(200).send("Logout successful");
  });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
