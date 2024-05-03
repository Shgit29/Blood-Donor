"use client";
import React from "react";
import BecomeDonor from "./inputs";
import styles from "./styles.module.css";
import Box from "@mui/material/Box";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

function page() {
  const [donor, setDonor] = useState(null);
  const params = useParams();

  useEffect(() => {
    async function fetchDonor() {
      try {
        const donorId = params.donorid;

        const response = await fetch(`http://localhost:3000/donors/${donorId}`);
        // console.log("response:", response); // Log the response for debugging

        if (!response.ok) {
          throw new Error("Failed to fetch donor details");
        }

        const donorData = await response.json();
        setDonor(donorData);
      } catch (error) {
        console.error("Error fetching donor details:", error);
        // Handle errors in the UI (e.g., display an error message)
      }
    }

    fetchDonor();
  }, [params]);
  return (
    <div className={styles.formPage}>
      <Box component="section" sx={{ p: 2, border: "1px  grey" }}>
        <div>
          {donor ? (
            <>
              <BecomeDonor donor={donor} />
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </Box>
    </div>
  );
}

export default page;
