"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "./styles.module.css";

type Inputs = {
  username?: string; // Optional username field
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onChange" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleLogin = async (formData: Inputs): Promise<void> => {
    try {
      const response = await axios.post(
        "http://localhost:3000/users/login",
        formData,

        {
          headers: {
            "Content-Type": "application/json",
          },
          // withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Login successful:", response.data);
        // Handle successful login (e.g., redirect to protected area, show success message)
        setIsSubmitted(true);
        router.push("/donors");
      } else {
        console.error("Login failed:", response);
        // Handle login errors (e.g., display error message to user)
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle errors (e.g., network issues, server errors)
    }
  };

  const registerOptions = {
    username: {
      // Make username optional (remove required property)
      required: "username is required",
      pattern: {
        // Optional username format validation (adjust based on your needs)
        value: /^[a-zA-Z0-9_.-]*$/,
        message:
          "Username can only contain letters, numbers, underscores, hyphens, and periods",
      },
    },
    // email: {
    //   required: "Email is required",
    //   pattern: {
    //     value: /^\S+@\S+\.\S+$/, // Basic email format validation
    //     message: "Please enter a valid email address",
    //   },
    // },
    password: {
      required: "Password is required",
      minLength: 6, // Minimum password length requirement (optional)
      message: "Password must be at least 6 characters long",
    },
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className={styles.formDiv}>
          <TextField
            label="Username"
            {...register("username", registerOptions.username)}
            error={!!errors.username} // Set error prop based on validation
            helperText={errors.username?.message} // Set helper text for error message
            fullWidth
          />
        </div>

        {/* <div className={styles.formDiv}>
          <TextField
            label="Email"
            {...register("email", registerOptions.email)}
            error={!!errors.email} // Set error prop based on validation
            helperText={errors.email?.message} // Set helper text for error message
            fullWidth
          />
        </div> */}

        <div className={styles.formDiv}>
          <TextField
            label="Password"
            type="password"
            {...register("password", registerOptions.password)}
            error={!!errors.password} // Set error prop based on validation
            helperText={errors.password?.message} // Set helper text for error message
            fullWidth
          />
        </div>

        <Button
          fullWidth
          className={styles.formDiv}
          type="submit"
          variant="contained"
        >
          Login
        </Button>
      </form>
    </>
  );
}
