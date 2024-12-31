import React, { useEffect, useState } from "react";
import axios from "../utility/axiosUtils";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

function CategoryListing() {
  const [categoryList, setCategoryList] = useState([]); // State to store the category list
  const [activeCategoryId, setActiveCategoryId] = useState(null); // State to store the selected category ID
  const [activeCategoryDetails, setActiveCategoryDetails] = useState(null); // State to store the selected category details

  // Function to fetch category details for a single category
  const fetchCategoryDetailsById = async (categoryId) => {
    try {
      const requestBody = {
        pageIndex: 0,
        pageSize: 1,
        searchValue: categoryId, // Pass the category ID to fetch details
        sortActive: "name",
        sortOrder: "asc",
      };
      const response = await axios.post("/category/details", requestBody);
      const data = response.data.data;

      // Log the API response for debugging
      console.log("API Response for Category Details:", data);

      // Check if the category details are found
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Category details not found");
      }

      // Extract details from the API response
      const categoryDetails = data[0];
      return {
        id: categoryDetails._id || "id not found",
        name: categoryDetails.name || "name not found",
        description: categoryDetails.description || "description not found",
        image: categoryDetails.image || "https://via.placeholder.com/150", // Fallback image
        createdAt: categoryDetails.createdAt || "createdAt not found",
        updatedAt: categoryDetails.updatedAt || "updatedAt not found",
      };
    } catch (error) {
      console.log("Error fetching category details:", error);
      return null; // Return null if category details are not found
    }
  };

  // Function to fetch the category list
  const fetchCategoryList = async () => {
    try {
      console.log("Fetching category list...");
      const requestBody = {
        pageIndex: 0,
        pageSize: 10,
        searchValue: "",
        sortActive: "name",
        sortOrder: "asc",
      };
      const response = await axios.post("/category/list", requestBody);
      const data = response.data.data;

      // Log the API response for debugging
      console.log("API Response for Category List:", data);

      if (!Array.isArray(data)) {
        throw new Error("data is not array");
      }

      // Debugging: Log each category's image URL
      data.forEach((category) => {
        console.log(`Category ID: ${category._id}, Image URL: ${category.image}`);
      });

      setCategoryList(data); // Set the category list state
    } catch (error) {
      console.log("Error fetching category list:", error);
    }
  };

  // Handle "Learn More" button click
  const handleLearnMoreClick = async (categoryId) => {
    setActiveCategoryId(categoryId); // Set the selected category ID

    // Fetch the details for the selected category
    const details = await fetchCategoryDetailsById(categoryId);
    setActiveCategoryDetails(details); // Store the details in the state
  };

  // Close the additional information section
  const handleCloseDetailsClick = () => {
    setActiveCategoryId(null); // Clear the selected category ID
    setActiveCategoryDetails(null); // Clear the selected category details
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" align="center" gutterBottom>
        Category Listing
      </Typography>
      <Grid container spacing={3} style={{ display: "flex" }}>
        {categoryList.map((category) => (
          <Grid item key={category._id} xs={12} sm={6} md={4}>
            <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Debugging: Log the image URL being used */}
              <CardMedia
                component="img"
                height="140"
                image={category.image || "https://via.placeholder.com/150"} // Use category.image directly
                alt={category.name}
                onError={(e) => {
                  console.error(`Error loading image for category ID: ${category._id}`);
                  e.target.onerror = null; // Prevent infinite loop on error
                  e.target.src = "https://via.placeholder.com/150"; // Fallback image
                }}
              />
              <CardContent style={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {category.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleLearnMoreClick(category._id)}>
                  Learn More
                </Button>
              </CardActions>

              {/* Additional Information Section */}
              {activeCategoryId === category._id && (
                <div style={{ padding: "16px", borderTop: "1px solid #ccc" }}>
                  <Typography variant="h6" gutterBottom>
                    Additional Information
                  </Typography>
                  {activeCategoryDetails ? (
                    <>
                      <Typography variant="body1">
                        Created At: {new Date(activeCategoryDetails.createdAt).toLocaleString()}
                      </Typography>
                      <Typography variant="body1">
                        Updated At: {new Date(activeCategoryDetails.updatedAt).toLocaleString()}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1" color="error">
                      Category details not found.
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

export default CategoryListing;