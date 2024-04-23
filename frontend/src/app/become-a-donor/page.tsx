"use client";
import React from "react";
import BecomeDonor from "./Inputs";
import styles from "./styles.module.css";
import Box from "@mui/material/Box";

function page() {
  return (
    <div className={styles.formPage}>
      <Box component="section" sx={{ p: 2, border: "1px  grey" }}>
        <BecomeDonor />
      </Box>
    </div>
  );
}

export default page;
