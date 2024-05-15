"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import axios from "axios";
import React, { useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

type Inputs = {
  fullName: string;
  DOB: Date;
  bloodGroup: string; // Add bloodGroup property
  location: string; // Add location property
  disease: string; // Add disease property
  contactNumber: string; // Add contactNumber property
};

export default function BecomeDonor() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    reset,
  } = useForm<Inputs>({ mode: "onChange" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const handleRegistration = async (formData: Inputs): Promise<void> => {
    try {
      const response = await axios.post(
        "http://localhost:3000/become-a-donor",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Form submission successful:", response.data);
        // Handle successful response (e.g., clear form, show success message)
        setIsSubmitted(true); // Set state to display success message
        reset();
        router.push("/donors");
      } else {
        console.error("Form submission failed:", response);
        // Handle error (e.g., display error message to user)
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle errors (e.g., network issues, server errors)
    }
  };

  const registerOptions = {
    fullName: {
      required: "Can't be blank",
      pattern: {
        value: /^[a-zA-Z\s]+$/, // Only allows letters and spaces
        message: "Please enter only letters and spaces",
      },
    },

    DOB: {
      required: "Can't be blank",
    },

    bloodGroup: {
      required: "Can't be blank",
    },

    Location: {
      required: "Can't be blank",
    },

    contactNumber: {
      required: "Can't be blank",
      pattern: {
        value: /^\d+$/, // Allows only digits (basic number validation)
        message: "Please enter a valid phone number (digits only)",
      },
    },
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleRegistration)}>
        <div className={styles.formDiv}>
          <TextField
            label="Name"
            {...register("fullName", registerOptions.fullName)}
            error={!!errors.fullName} // Set error prop based on validation
            helperText={errors.fullName?.message} // Set helper text for error message
            fullWidth
          />
        </div>

        <div className={styles.formDiv}>
          <Controller
            name="DOB"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }} // Optional: Shrink label on focus
                {...register("DOB", registerOptions.DOB)}
                onChange={onChange}
                value={value}
                error={!!errors.DOB} // Set error prop based on validation
                helperText={errors.DOB?.message} // Set helper text for error message
                fullWidth
              />
            )}
          />
        </div>

        <div className={styles.formDiv}>
          <TextField
            label="Blood Group"
            {...register("bloodGroup", registerOptions.bloodGroup)}
            error={!!errors.bloodGroup} // Set error prop based on validation
            helperText={errors.bloodGroup?.message} // Set helper text for error message
            fullWidth
          />
        </div>

        <div className={styles.formDiv}>
          <TextField
            label="Location"
            {...register("location", registerOptions.Location)}
            error={!!errors.location} // Set error prop based on validation
            helperText={errors.location?.message} // Set helper text for error message
            fullWidth
          />
        </div>

        <div className={styles.formDiv}>
          <TextField
            label="Disease (if any)"
            {...register("disease")} // No validation for disease field
            error={!!errors.disease} // Display error if validation is added
            helperText={errors.disease?.message} // Display error message if added
            fullWidth
          />
        </div>

        <div className={styles.formDiv}>
          <TextField
            label="Contact Number"
            {...register("contactNumber", registerOptions.contactNumber)}
            error={!!errors.contactNumber} // Set error prop based on validation
            helperText={errors.contactNumber?.message} // Set helper text for error message
            fullWidth
          />
        </div>
        <Button
          fullWidth
          className={styles.formDiv}
          type="submit"
          variant="contained"
        >
          Submit
        </Button>
      </form>
    </>
  );
}
