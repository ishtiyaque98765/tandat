import React, { useState, useEffect } from "react";
import axios from "../utility/axiosUtils"; // Import your axios utility
import { useNavigate } from "react-router-dom"; // For navigation (React Router v6)
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

function UserUpdatePage() {
  const navigate = useNavigate();

  // State for form fields
  const [firstNameEn, setFirstNameEn] = useState("");
  const [lastNameEn, setLastNameEn] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          navigate("/"); // Redirect to login if no token
          return;
        }

        // Fetch user details from the API
        const response = await axios.get("/user/details", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.status) {
          const user = response.data.data;
          setFirstNameEn(user.firstName.en || "");
          setLastNameEn(user.lastName.en || "");
          setEmail(user.email || "");
          setPhoneNumber(user.phoneNumber || "");
        } else {
          setError(response.data.message || "Failed to fetch user details.");
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("An error occurred while fetching user details.");
      }
    };

    fetchUserDetails();
  }, [navigate]);

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      // Clear previous errors and success messages
      setError("");
      setSuccess("");

      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        navigate("/"); // Redirect to login if no token
        return;
      }

      // Prepare the update request body
      const updateBody = {
        firstName: {
          en: firstNameEn,
        },
        lastName: {
          en: lastNameEn,
        },
        email,
        phoneNumber,
      };

      // Send the PUT request to the update API
      const response = await axios.put("/user/update", updateBody, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Check if the response is successful
      if (response.data.status) {
        setSuccess(response.data.message || "Update successful!");
      } else {
        // Handle session expiration
        if (response.data.statusCode === 440) {
          setError(response.data.message);
          localStorage.removeItem("authToken"); // Clear token
          setTimeout(() => {
            navigate("/"); // Redirect to login page
          }, 2000);
        } else {
          setError(response.data.message || "Update failed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("An error occurred during update. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Update Profile
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
      <form onSubmit={handleUpdate}>
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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "1rem" }}
        >
          Update Profile
        </Button>
      </form>
    </Container>
  );
}

export default UserUpdatePage;