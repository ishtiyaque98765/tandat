import React, { useState } from "react";
import axios from "../utility/axiosUtils"; // Import your axios utility
import { useNavigate } from "react-router-dom"; // For navigation (React Router v6)
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from "@mui/material";

function SignUpPage() {
  const navigate = useNavigate();

  // State for form fields
  const [firstNameEn, setFirstNameEn] = useState("");
  const [lastNameEn, setLastNameEn] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("674ca314cabc4897f7838087"); // Default roleId
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // Clear previous errors and success messages
      setError("");
      setSuccess("");

      // Prepare the sign-up request body
      const signUpBody = {
        firstName: {
          en: firstNameEn,
        },
        lastName: {
          en: lastNameEn,
        },
        email,
        phoneNumber,
        password,
        roleId,
      };

      // Send the POST request to the sign-up API
      const response = await axios.post("/user/signup", signUpBody);

      // Check if the response is successful
      if (response.data.status) {
        setSuccess(response.data.message || "Sign-up successful!");
        setTimeout(() => {
          navigate("/"); // Redirect to login page after success
        }, 2000);
      } else {
        setError(response.data.message || "Sign-up failed. Please try again.");
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      setError("An error occurred during sign-up. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>
      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}
      <form onSubmit={handleSignUp}>
        <Typography variant="h6" gutterBottom>
          First Name
        </Typography>
        <TextField
          label="First Name (English)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={firstNameEn}
          onChange={(e) => setFirstNameEn(e.target.value)}
          required
        />

        <Typography variant="h6" gutterBottom>
          Last Name
        </Typography>
        <TextField
          label="Last Name (English)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={lastNameEn}
          onChange={(e) => setLastNameEn(e.target.value)}
          required
        />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          margin="normal"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "1rem" }}
        >
          Sign Up
        </Button>
      </form>
      <Typography variant="body2" align="center" style={{ marginTop: "1rem" }}>
        Already have an account?{" "}
        <Link component="button" onClick={() => navigate("/")}>
          Login
        </Link>
      </Typography>
    </Container>
  );
}

export default SignUpPage;