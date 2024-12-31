import React, { useEffect, useState } from "react";
import axios from "../utility/axiosUtils";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

function UserListing() {
  const [userList, setUserList] = useState([]); // State to store the user list
  const [activeUserId, setActiveUserId] = useState(null); // State to store the selected user ID
  const [activeUserDetails, setActiveUserDetails] = useState(null); // State to store the selected user details

  // Function to fetch user details for a single user
  const fetchUserDetailsById = async (userId) => {
    try {
      const requestBody = {
        pageIndex: 0,
        pageSize: 1,
        searchValue: userId, // Pass the user ID to fetch details
        sortActive: "firstName",
        sortOrder: "asc",
      };
      const response = await axios.post("/user/details", requestBody);
      const data = response.data.data;

      // Log the API response for debugging
      console.log("API Response for User Details:", data);

      // Check if the user details are found
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("User details not found");
      }

      // Extract details from the API response
      const userDetails = data[0];
      return {
        id: userDetails._id || "id not found",
        firstName: userDetails.firstName || "firstName not found",
        lastName: userDetails.lastName || "lastName not found",
        email: userDetails.email || "email not found",
        phoneNumber: userDetails.phoneNumber || "phoneNumber not found",
        createdAt: userDetails.createdAt || "createdAt not found",
        description: userDetails.description || "description not found",
        profileImage: userDetails.profileImage || "profileImage not found",
        addresses: userDetails.addresses || "addresses not found",
      };
    } catch (error) {
      console.log("Error fetching user details:", error);
      return null; // Return null if user details are not found
    }
  };

  // Function to fetch the user list
  const fetchUserList = async () => {
    try {
      console.log("Fetching user list...");
      const requestBody = {
        pageIndex: 0,
        pageSize: 10,
        searchValue: "",
        sortActive: "firstName",
        sortOrder: "asc",
      };
      const response = await axios.post("/user/list", requestBody);
      const data = response.data.data;

      // Log the API response for debugging
      console.log("API Response for User List:", data);

      if (!Array.isArray(data)) {
        throw new Error("data is not array");
      }

      setUserList(data); // Set the user list state
    } catch (error) {
      console.log("Error fetching user list:", error);
    }
  };

  // Handle "Learn More" button click
  const handleLearnMoreClick = async (userId) => {
    setActiveUserId(userId); // Set the selected user ID

    // Fetch the details for the selected user
    const details = await fetchUserDetailsById(userId);
    setActiveUserDetails(details); // Store the details in the state
  };

  // Close the additional information section
  const handleCloseDetailsClick = () => {
    setActiveUserId(null); // Clear the selected user ID
    setActiveUserDetails(null); // Clear the selected user details
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" align="center" gutterBottom>
        User Listing
      </Typography>
      <Grid container spacing={3} style={{ display: "flex" }}>
        {userList.map((user) => (
          <Grid item key={user._id} xs={12} sm={6} md={4}>
            <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardContent style={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {user.phoneNumber}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleLearnMoreClick(user._id)}>
                  Learn More
                </Button>
              </CardActions>

              {/* Additional Information Section */}
              {activeUserId === user._id && (
                <div style={{ padding: "16px", borderTop: "1px solid #ccc" }}>
                  <Typography variant="h6" gutterBottom>
                    Additional Information
                  </Typography>
                  {activeUserDetails ? (
                    <>
                      <Typography variant="body1">
                        Created At: {new Date(activeUserDetails.createdAt).toLocaleString()}
                      </Typography>
                      <Typography variant="body1">
                        Description: {activeUserDetails.description}
                      </Typography>
                      <Typography variant="body1">
                        Profile Image: {activeUserDetails.profileImage}
                      </Typography>
                      <Typography variant="body1">
                        Addresses: {activeUserDetails.addresses.join(", ") || "No addresses found"}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1" color="error">
                      User details not found.
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCloseDetailsClick}
                    style={{ marginTop: "16px" }}
                  >
                    Close Details
                  </Button>
                </div>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default UserListing;