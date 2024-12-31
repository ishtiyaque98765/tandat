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

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // React Router navigation

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Clear any previous errors
      setError("");

      // Prepare the login request body
      const loginBody = {
        email,
        password,
      };

      // Send the POST request to the login API
      const response = await axios.post("/user/login", loginBody);

      // Check if the response is successful
      if (response.data.status) {
        // Extract the token from the response
        const token = response.data.data[0].token;

        // Store the token in localStorage
        localStorage.setItem("authToken", token);

        // Redirect to the dashboard or another page
        navigate("/dashboard");
      } else {
        // Handle API error message
        setError(
          response.data.message ||
            "Login failed. Please check your credentials or sign up if you don't have an account."
        );
      }
    } catch (err) {
      // Handle network or server errors
      console.error("Login error:", err);
      setError(
        "An error occurred during login. Please try again or sign up if you don't have an account."
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          action={
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Link>
          }
        >
          {error}
        </Alert>
      )}
      <form onSubmit={handleLogin}>
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
          Login
        </Button>
      </form>
      <Typography variant="body2" align="center" style={{ marginTop: "1rem" }}>
        Don't have an account?{" "}
        <Link component="button" onClick={() => navigate("/signup")}>
          Sign Up
        </Link>
      </Typography>
    </Container>
  );
}

export default LoginPage;