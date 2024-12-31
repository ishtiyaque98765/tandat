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

function UserRoleListing() {
  const [userRoles, setUserRoles] = useState([]); // State to store the user roles list
  const [activeRoleId, setActiveRoleId] = useState(null); // State to store the selected role ID
  const [activeRoleDetails, setActiveRoleDetails] = useState(null); // State to store the selected role details

  // Function to fetch user role details for a single role
  const fetchRoleDetailsById = async (roleId) => {
    try {
      const requestBody = {
        pageIndex: 0,
        pageSize: 1,
        searchValue: roleId, // Pass the role ID to fetch details
        sortActive: "name",
        sortOrder: "asc",
      };
      const response = await axios.post("/user-role/details", requestBody);
      const data = response.data.data;

      // Log the API response for debugging
      console.log("API Response for Role Details:", data);

      // Check if the role details are found
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Role details not found");
      }

      // Extract details from the API response
      const roleDetails = data[0];
      return {
        id: roleDetails._id || "id not found",
        name: roleDetails.name || "name not found",
        type: roleDetails.type || "type not found",
        description: roleDetails.description || "description not found",
        createdAt: roleDetails.createdAt || "createdAt not found",
        updatedAt: roleDetails.updatedAt || "updatedAt not found",
      };
    } catch (error) {
      console.log("Error fetching role details:", error);
      return null; // Return null if role details are not found
    }
  };

  // Function to fetch the user role list
  const fetchUserRoleList = async () => {
    try {
      console.log("Fetching user role list...");
      const requestBody = {
        pageIndex: 0,
        pageSize: 10,
        searchValue: "",
        sortActive: "name",
        sortOrder: "asc",
      };
      const response = await axios.post("/user-role/list", requestBody);
      const data = response.data.data;

      // Log the API response for debugging
      console.log("API Response for User Role List:", data);

      if (!Array.isArray(data)) {
        throw new Error("data is not array");
      }

      setUserRoles(data); // Set the user roles state
    } catch (error) {
      console.log("Error fetching user role list:", error);
    }
  };

  // Handle "Learn More" button click
  const handleLearnMoreClick = async (roleId) => {
    setActiveRoleId(roleId); // Set the selected role ID

    // Fetch the details for the selected role
    const details = await fetchRoleDetailsById(roleId);
    setActiveRoleDetails(details); // Store the details in the state
  };

  // Close the additional information section
  const handleCloseDetailsClick = () => {
    setActiveRoleId(null); // Clear the selected role ID
    setActiveRoleDetails(null); // Clear the selected role details
  };

  useEffect(() => {
    fetchUserRoleList();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" align="center" gutterBottom>
        User Role Listing
      </Typography>
      <Grid container spacing={3} style={{ display: "flex" }}>
        {userRoles.map((role) => (
          <Grid item key={role._id} xs={12} sm={6} md={4}>
            <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardContent style={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {role.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {role.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: {role.type}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleLearnMoreClick(role._id)}>
                  Learn More
                </Button>
              </CardActions>

              {/* Additional Information Section */}
              {activeRoleId === role._id && (
                <div style={{ padding: "16px", borderTop: "1px solid #ccc" }}>
                  <Typography variant="h6" gutterBottom>
                    Additional Information
                  </Typography>
                  {activeRoleDetails ? (
                    <>
                      <Typography variant="body1">
                        Created At: {new Date(activeRoleDetails.createdAt).toLocaleString()}
                      </Typography>
                      <Typography variant="body1">
                        Updated At: {new Date(activeRoleDetails.updatedAt).toLocaleString()}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1" color="error">
                      Role details not found.
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

export default UserRoleListing;