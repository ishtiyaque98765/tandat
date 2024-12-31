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

function SubCategoryListing() {
  const [subCategoryList, setSubCategoryList] = useState([]); // State to store the subcategory list
  const [activeSubCategoryId, setActiveSubCategoryId] = useState(null); // State to store the selected subcategory ID
  const [activeSubCategoryDetails, setActiveSubCategoryDetails] = useState(null); // State to store the selected subcategory details

  // Function to fetch subcategory details for a single subcategory
  const fetchSubCategoryDetailsById = async (subCategoryId) => {
    try {
      const requestBody = {
        pageIndex: 0,
        pageSize: 1,
        searchValue: subCategoryId, // Pass the subcategory ID to fetch details
        sortActive: "name",
        sortOrder: "asc",
      };
      const response = await axios.post("/sub-category/details", requestBody);
      const data = response.data.data;

      // Log the API response for debugging
      console.log("API Response for SubCategory Details:", data);

      // Check if the subcategory details are found
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("SubCategory details not found");
      }

      // Extract details from the API response
      const subCategoryDetails = data[0];
      return {
        id: subCategoryDetails._id || "id not found",
        name: subCategoryDetails.name || "name not found",
        description: subCategoryDetails.description || "description not found",
        createdAt: subCategoryDetails.createdAt || "createdAt not found",
        updatedAt: subCategoryDetails.updatedAt || "updatedAt not found",
      };
    } catch (error) {
      console.log("Error fetching subcategory details:", error);
      return null; // Return null if subcategory details are not found
    }
  };

  // Function to fetch the subcategory list
  const fetchSubCategoryList = async () => {
    try {
      console.log("Fetching subcategory list...");
      const requestBody = {
        pageIndex: 0,
        pageSize: 10,
        searchValue: "",
        sortActive: "name",
        sortOrder: "asc",
      };
      const response = await axios.post("/sub-category/list", requestBody);
      const data = response.data.data;

      // Log the API response for debugging
      console.log("API Response for SubCategory List:", data);

      if (!Array.isArray(data)) {
        throw new Error("data is not array");
      }

      setSubCategoryList(data); // Set the subcategory list state
    } catch (error) {
      console.log("Error fetching subcategory list:", error);
    }
  };

  // Handle "Learn More" button click
  const handleLearnMoreClick = async (subCategoryId) => {
    setActiveSubCategoryId(subCategoryId); // Set the selected subcategory ID

    // Fetch the details for the selected subcategory
    const details = await fetchSubCategoryDetailsById(subCategoryId);
    setActiveSubCategoryDetails(details); // Store the details in the state
  };

  // Close the additional information section
  const handleCloseDetailsClick = () => {
    setActiveSubCategoryId(null); // Clear the selected subcategory ID
    setActiveSubCategoryDetails(null); // Clear the selected subcategory details
  };

  useEffect(() => {
    fetchSubCategoryList();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" align="center" gutterBottom>
        SubCategory Listing
      </Typography>
      <Grid container spacing={3} style={{ display: "flex" }}>
        {subCategoryList.map((subCategory) => (
          <Grid item key={subCategory._id} xs={12} sm={6} md={4}>
            <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardContent style={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {subCategory.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subCategory.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleLearnMoreClick(subCategory._id)}>
                  Learn More
                </Button>
              </CardActions>

              {/* Additional Information Section */}
              {activeSubCategoryId === subCategory._id && (
                <div style={{ padding: "16px", borderTop: "1px solid #ccc" }}>
                  <Typography variant="h6" gutterBottom>
                    Additional Information
                  </Typography>
                  {activeSubCategoryDetails ? (
                    <>
                      <Typography variant="body1">
                        Created At: {new Date(activeSubCategoryDetails.createdAt).toLocaleString()}
                      </Typography>
                      <Typography variant="body1">
                        Updated At: {new Date(activeSubCategoryDetails.updatedAt).toLocaleString()}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1" color="error">
                      SubCategory details not found.
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

export default SubCategoryListing;