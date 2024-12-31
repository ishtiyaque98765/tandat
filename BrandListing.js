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

function BrandListing() {
  const [brandList, setBrandList] = useState([]); // State to store the brand list
  const [activeBrandId, setActiveBrandId] = useState(null); // State to store the selected brand ID
  const [activeBrandDetails, setActiveBrandDetails] = useState(null); // State to store the selected brand details

  // Function to fetch brand details for a single brand
  const fetchBrandDetailsById = async (brandId) => {
    try {
      const requestBody = {
        pageIndex: 0,
        pageSize: 1,
        searchValue: brandId, // Pass the brand ID to fetch details
        sortActive: "name",
        sortOrder: "asc",
      };
      const response = await axios.post("/brand/details", requestBody);
      const data = response.data.data;

      // Log the API response for debugging
      console.log("API Response for Brand Details:", data);

      // Check if the brand details are found
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Brand details not found");
      }

      // Extract details from the API response
      const brandDetails = data[0];
      return {
        id: brandDetails._id || "id not found",
        name: brandDetails.name || "name not found",
        description: brandDetails.description || "description not found",
        image: brandDetails.image || "https://via.placeholder.com/150", // Fallback image
        createdAt: brandDetails.createdAt || "createdAt not found",
        updatedAt: brandDetails.updatedAt || "updatedAt not found",
      };
    } catch (error) {
      console.log("Error fetching brand details:", error);
      return null; // Return null if brand details are not found
    }
  };

  // Function to fetch the brand list
  const fetchBrandList = async () => {
    try {
      console.log("Fetching brand list...");
      const requestBody = {
        pageIndex: 0,
        pageSize: 10,
        searchValue: "",
        sortActive: "name",
        sortOrder: "asc",
      };
      const response = await axios.post("/brand/list", requestBody);
      const data = response.data.data;

      // Log the API response for debugging
      console.log("API Response for Brand List:", data);

      if (!Array.isArray(data)) {
        throw new Error("data is not array");
      }

      // Debugging: Log each brand's image URL
      data.forEach((brand) => {
        console.log(`Brand ID: ${brand._id}, Image URL: ${brand.image}`);
      });

      setBrandList(data); // Set the brand list state
    } catch (error) {
      console.log("Error fetching brand list:", error);
    }
  };

  // Handle "Learn More" button click
  const handleLearnMoreClick = async (brandId) => {
    setActiveBrandId(brandId); // Set the selected brand ID

    // Fetch the details for the selected brand
    const details = await fetchBrandDetailsById(brandId);
    setActiveBrandDetails(details); // Store the details in the state
  };

  // Close the additional information section
  const handleCloseDetailsClick = () => {
    setActiveBrandId(null); // Clear the selected brand ID
    setActiveBrandDetails(null); // Clear the selected brand details
  };

  useEffect(() => {
    fetchBrandList();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" align="center" gutterBottom>
        Brand Listing
      </Typography>
      <Grid container spacing={3} style={{ display: "flex" }}>
        {brandList.map((brand) => (
          <Grid item key={brand._id} xs={12} sm={6} md={4}>
            <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardMedia
                component="img"
                height="140"
                image={brand.image || "https://via.placeholder.com/150"} // Use brand.image directly
                alt={brand.name}
                onError={(e) => {
                  console.error(`Error loading image for brand ID: ${brand._id}`);
                  e.target.onerror = null; // Prevent infinite loop on error
                  e.target.src = "https://via.placeholder.com/150"; // Fallback image
                }}
              />
              <CardContent style={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {brand.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {brand.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleLearnMoreClick(brand._id)}>
                  Learn More
                </Button>
              </CardActions>

              {/* Additional Information Section */}
              {activeBrandId === brand._id && (
                <div style={{ padding: "16px", borderTop: "1px solid #ccc" }}>
                  <Typography variant="h6" gutterBottom>
                    Additional Information
                  </Typography>
                  {activeBrandDetails ? (
                    <>
                      <Typography variant="body1">
                        Created At: {new Date(activeBrandDetails.createdAt).toLocaleString()}
                      </Typography>
                      <Typography variant="body1">
                        Updated At: {new Date(activeBrandDetails.updatedAt).toLocaleString()}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1" color="error">
                      Brand details not found.
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

export default BrandListing;