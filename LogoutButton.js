import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../utility/axiosUtils"; // Import your axios utility

function LogoutButton() {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call the logout API
      const response = await axios.post("/logout");

      // Check if the logout was successful
      if (response.data.status === false && response.data.statusCode === 440) {
        // Clear the authentication token from localStorage
        localStorage.removeItem("authToken");

        // Redirect to the login page
        navigate("/");
      } else {
        console.error("Unexpected response from logout API:", response.data);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleLogout}
      style={{ marginLeft: "1rem" }}
    >
      Logout
    </Button>
  );
}

export default LogoutButton;