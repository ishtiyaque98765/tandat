import React, { useEffect, useState } from "react";
import axios from "../../utility/axiosUtils";
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

function ProductsListing() {
  const [products, setProducts] = useState([]); // State to store the product list
  const [selectedProductId, setSelectedProductId] = useState(null); // State to store the selected product ID
  const [selectedProductIdDetails, setSelectedProductIdDetails] = useState(null); // State to store the selected product details

  // Function to fetch product details for a single product
  const fetchProductDetails = async (productId) => {
    try {
      const listingBody = {
        pageIndex: 0,
        pageSize: 1,
        searchValue: productId, // Pass the product ID to fetch details
        sortActive: "name",
        sortOrder: "asc",
      };
      const request = await axios.post("/product/details", listingBody);
      const data = request.data.data;

      // Log the API response for debugging
      console.log("API Response for Product Details:", data);

      // Check if the product details are found
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Product details not found");
      }

      // Extract stock and size from the API response
      const productDetails = data[0];
      return {
        id: productDetails._id || "id not found",
        name: productDetails.name || "name not found",
        description: productDetails.description || "description not found",
        image: productDetails.images?.[0] || "image not found",
        stock: productDetails.stock || "stock not found", // Extract stock
        size: productDetails.size?.join(", ") || "size not found", // Extract size (join array into a string)
      };
    } catch (error) {
      console.log("Error fetching product details:", error);
      return null; // Return null if product details are not found
    }
  };

  // Function to fetch the product list and integrate details
  const getProductsList = async () => {
    try {
      console.log("Calling");
      const listingBody = {
        pageIndex: 0,
        pageSize: 9,
        searchValue: "",
        sortActive: "name",
        sortOrder: "asc",
      };
      const request = await axios.post("/product/list", listingBody);
      const data = request.data.data;

      // Log the API response for debugging
      console.log("API Response for Product List:", data);

      if (!Array.isArray(data)) {
        throw new Error("data is not array");
      }

      // Fetch details for each product
      const productsWithDetails = await Promise.all(
        data.map(async (product) => {
          const details = await fetchProductDetails(product._id);

          // Log the details for debugging
          console.log(`Details for Product ID ${product._id}:`, details);

          // Merge product details with the product object
          return {
            ...product, // Include all existing product fields
            details: details || {}, // Add product details (or an empty object if null)
          };
        })
      );

      setProducts(productsWithDetails); // Set the products state with details
    } catch (error) {
      console.log("Error", error);
    }
  };

  // Handle "Learn More" button click
  const handleLearnMore = async (productId) => {
    setSelectedProductId(productId); // Set the selected product ID

    // Fetch the details for the selected product
    const details = await fetchProductDetails(productId);
    setSelectedProductIdDetails(details); // Store the details in the state
  };

  // Close the additional information section
  const handleCloseDetails = () => {
    setSelectedProductId(null); // Clear the selected product ID
    setSelectedProductIdDetails(null); // Clear the selected product details
  };

  useEffect(() => {
    getProductsList();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" align="center" gutterBottom>
        Products Listing
      </Typography>
      <Grid container spacing={3} style={{ display: "flex" }}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardMedia
                component="img"
                height="140"
                image={product.images?.[0] || "image not found"} // Use product.images instead of product.image
                alt={product.name}
              />
              <CardContent style={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleLearnMore(product._id)}>
                  Learn More
                </Button>
              </CardActions>

              {/* Additional Information Section */}
              {selectedProductId === product._id && (
                <div style={{ padding: "16px", borderTop: "1px solid #ccc" }}>
                  <Typography variant="h6" gutterBottom>
                    Additional Information
                  </Typography>
                  {selectedProductIdDetails ? (
                    <>
                      <Typography variant="body1">
                        Stock: {selectedProductIdDetails.stock || "stock not found"}
                      </Typography>
                      <Typography variant="body1">
                        Size: {selectedProductIdDetails.size || "size not found"}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1" color="error">
                      ID details not found.
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCloseDetails}
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

export default ProductsListing;