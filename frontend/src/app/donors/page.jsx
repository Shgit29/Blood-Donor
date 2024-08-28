"use client";

import React, { useState, useEffect } from "react";
import IntroDivider from "./IntroDivider";
import styles from "./styles.module.css";
import MapboxMap from "./MapboxMap";

// Define ShowDonors component
const ShowDonors = () => {
  // State to store donors data
  const [donors, setDonors] = useState([]);

  // Fetch donors data from the server
  useEffect(() => {
    async function fetchDonors() {
      try {
        const response = await fetch("http://localhost:3000/donors", {
          method: "GET",
          credentials: "include", // Ensure the cookie is sent with the request
        });
        if (!response.ok) {
          throw new Error("Failed to fetch donor data");
        }
        const donorData = await response.json();
        setDonors(donorData);
      } catch (error) {
        console.error("Error fetching donor data:", error);
      }
    }

    fetchDonors();
  }, []);

  // Create a single GeoJSON object from donor geometries
  const donorGeojson = {
    features: donors.map((donor) => ({
      geometry: donor.geometry,
    })),
  };

  // Render component
  return (
    <div>
      <div>
        <MapboxMap geojson={donorGeojson} />
      </div>

      <div className={styles.show}>
        {donors.map((donor) => (
          <div key={donor.donorid} className={styles.intro}>
            <IntroDivider donor={donor} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowDonors;
