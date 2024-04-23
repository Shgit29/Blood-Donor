"use client";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import RecipeReviewCard from "./card";

interface Donor {
  donorid: number;
  donorname: string;
  dateofbirth: string;
  bloodgroup: string;
  location: string;
  disease?: string;
  contact: string;
}

interface DonorProps {
  donor: Donor | null; // Adjust the prop type to accept a single donor or null
}

export default function SimpleContainer({ donor }: DonorProps) {
  if (!donor) {
    return null; // Return null if donor is null or undefined
  }
  return (
    <div>
      <CssBaseline />
      <Container maxWidth="lg">
        <RecipeReviewCard donor={donor} />
        
        {donor.donorname}
      </Container>
    </div>
  );
}
